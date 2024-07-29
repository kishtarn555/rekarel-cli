#!/usr/bin/env node
"use strict";
import { Command } from 'commander';
import { javaParser, pascalParser, compile, World } from "@rekarel/core";
import * as fs from 'fs';
import { DOMParser } from '@xmldom/xmldom';
import { KarelDebugger } from './debugger.js';
import * as readline from 'readline';
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
program.version("cli-1.0.0; rekarel-1.0.0");
program.command('compile')
    .argument('<source>', 'source code')
    .option('-l, --language <type>')
    .option('-o, --output [target]')
    .action((source, options) => {
    var _a;
    let parser = compile;
    if (options.language) {
        switch (options.language) {
            case "java":
                parser = javaParser;
                break;
            case "pascal":
                parser = pascalParser;
                break;
            default:
                console.error(`'${options.language}' is not recognized as a valid language. Options are 'pascal' or 'java'`);
        }
    }
    try {
        let output = (_a = options.output) !== null && _a !== void 0 ? _a : "a.kx";
        let file = fs.readFileSync(source, { encoding: 'utf-8' });
        let compiled = parser(file);
        fs.writeFileSync(output, JSON.stringify(compiled));
    }
    catch (error) {
        console.error(error);
    }
});
program
    .command('run <filename>')
    .option('--debug', 'enables debug output')
    .option('-w, --world [world]', 'If specified, it reads the world from the file, otherwise it reads from stdin')
    .description('runs file')
    .action(function (filename, options) {
    var file = fs.readFileSync(filename, { encoding: 'utf-8' });
    var compiled = null;
    if (filename.endsWith('.kx')) {
        compiled = JSON.parse(file);
    }
    else {
        compiled = compile(file);
    }
    function run(worldXml) {
        var world = new World(100, 100);
        world.load(worldXml);
        if (options.debug) {
            world.runtime.debug = true;
            world.runtime.addEventListener('debug', function (ev) {
                console.log(ev.debugType, ev.message);
            });
        }
        world.runtime.load(compiled);
        while (world.runtime.step())
            ;
        console.log(world.output());
    }
    if (options.world) {
        let file = fs.readFileSync(options.world, { encoding: 'utf-8' });
        let worldXml = new DOMParser().parseFromString(file, 'text/xml');
        run(worldXml);
    }
    else {
        readStdin()
            .then(stdin => {
            let worldXml = new DOMParser().parseFromString(stdin, 'text/xml');
            run(worldXml);
        });
    }
});
program
    .command('debugger <source> <world>')
    .option('--debug', 'enables debug output')
    .description('runs file')
    .action(function (sourcePath, worldPath, options) {
    let source = fs.readFileSync(sourcePath, { encoding: 'utf-8' });
    let compiled = null;
    let rawSource = false;
    if (source.endsWith('.kx')) {
        compiled = JSON.parse(source);
    }
    else {
        compiled = compile(source);
        rawSource = true;
    }
    let worldFile = fs.readFileSync(worldPath, { encoding: 'utf-8' });
    let worldXml = new DOMParser().parseFromString(worldFile, 'text/xml');
    var world = new World(100, 100);
    world.load(worldXml);
    world.runtime.debug = true;
    world.runtime.load(compiled);
    if (options.debug) {
        world.runtime.addEventListener('debug', function (ev) {
            console.log(ev.debugType, ev.message);
        });
    }
    const karelDebugger = new KarelDebugger(world, {
        code: rawSource ? source : undefined
    });
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '> '
    });
    karelDebugger.StartRun();
    rl.prompt();
    rl.on('line', (line) => {
        const [command, ...args] = line.trim().split(' ');
        if (command === "step") {
            karelDebugger.Step();
            rl.prompt();
            return;
        }
        if (command === "exit") {
            process.exit(0);
            return;
        }
    });
});
program.parse(process.argv);
//# sourceMappingURL=commands.js.map