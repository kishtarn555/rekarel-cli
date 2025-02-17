#!/usr/bin/env node

"use strict";

import { Command, option } from 'commander';
import { javaCompiler, pascalCompiler, compile, World } from "@rekarel/core"
import * as fs from 'fs';
import { DOMParser } from '@xmldom/xmldom';
import { version } from "../package.json"
import { compilationError, RunResult, sendErrorResultToStderr } from './errors';
const program = new Command();


function readStdin() {
    return new Promise(function (resolve, reject) {
        let chunks = [];
        process.stdin
            .setEncoding('utf-8')
            .on('data', chunk => chunks.push(chunk))
            .on('end', chunk => resolve(chunks.join('')));
    });
}

program.version(version);

program.command('compile')
    .arguments('<source>')
    .option('-l, --language <type>')
    .option('-o, --output [target]')
    .option('-e, --expected-version [target]')
    .action((source, options) => {

        if (options.expectedVersion) {
            let expectedMajor = options.expectedVersion.split('.')[0];
            let expectedMinor = options.expectedVersion.split('.')[1];
            let actualMajor = version.split('.')[0];
            let actualMinor = version.split('.')[1];

            if (expectedMajor !== actualMajor || expectedMinor !== actualMinor) {
                console.error(`Expected version ${expectedMajor}.${expectedMinor}.x, but the actual version is ${version}`);
                process.exit(2);
            }
        }

        let parser = compile;
        if (options.language) {
            switch (options.language) {
                case "java":
                    parser = javaCompiler;
                    break;
                case "pascal":
                    parser = pascalCompiler;
                    break;
                default:
                    console.error(`'${options.language}' is not recognized as a valid language. Options are 'pascal' or 'java'`);
                    process.exit(-1);
            }
        }


        let output = options.output ?? "a.kx";
        let file = "";
        try {
            file = fs.readFileSync(source, { encoding: 'utf-8' });
        } catch (err) {
            console.log("Error reading file: ", source);
            process.exit(-1);
        }
        let compiled: ReturnType<typeof parser>[0]; // FIXME: This is a temporary hack to obtain the type RawProgram, this should be public in the core!
        try {
            compiled = parser(file)[0];
        } catch (err) {
            compilationError(err);
            process.exit(1);
        }
        try {
            fs.writeFileSync(output, JSON.stringify(compiled));
        } catch (err) {
            console.log("Error writing to file: ", output);
            process.exit(-1);
        }


    });

program
    .command('run <filename>')
    .option('--debug', 'enables debug output')
    .option('-i, --input [worldIn]', 'If specified, it reads the world from the file, otherwise it reads from stdin')
    .option('-o, --output [worldOut]', 'If specified, it writes the output to the file, otherwise it writes to stdout')
    .description('runs file')
    .action(function (filename, options) {
        var file = "";
        try {
            file = fs.readFileSync(filename, { encoding: 'utf-8' });
        } catch (error) {
            console.error("Error reading file", filename);
            if (options.debug) {
                console.error(error);
            }
            process.exit(-1)
        }
        var compiled = null;
        try {
            if (filename.endsWith('.kx')) {
                compiled = JSON.parse(file);
            } else {
                compiled = compile(file);
            }
        } catch (err) {
            compilationError(err);
            process.exit(-1);
        }

        function run(worldXml) {
            var world = new World(100, 100);
            world.load(worldXml);
            if (options.debug) {
                world.runtime.debug = true;
                world.runtime.eventController.addEventListener('debug', function (ev) {
                    if (ev.details.type !=="debug") {
                        //This should never happen!
                        return;
                    }
                    console.log(ev.details.debugType, ev.details.message);
                });
            }
            world.runtime.load(compiled);
            while (world.runtime.step());
            if (options.output) {
                fs.writeFileSync(options.output, world.output());
            } else {
                console.log(world.output());
            }
            if (world.runtime.state.error) {
                const error:string = world.runtime.state.error;
                sendErrorResultToStderr(error);
                return RunResult[error];
            }
            return RunResult.OK;
        }
        if (options.input) {
            let file = "";
            try {
                file = fs.readFileSync(options.input, { encoding: 'utf-8' });
            } catch (err) {
                console.error("Error reading world:", options.input);
                process.exit(-1);
            }
            let worldXml = new DOMParser().parseFromString(file, 'text/xml');
            process.exit(run(worldXml));
        } else {
            readStdin()
                .then(stdin => {
                    let worldXml = new DOMParser().parseFromString(stdin as string, 'text/xml');
                    process.exit(run(worldXml));
                });
        }
    });


program.parse(process.argv);