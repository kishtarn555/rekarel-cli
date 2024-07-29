#!/usr/bin/env node

"use strict";

import { Command } from 'commander';
import { javaParser, pascalParser, compile, World} from "@rekarel/core"
import * as fs from 'fs';
import * as path from 'path';
import { DOMParser } from '@xmldom/xmldom';

const program = new Command();


function readStdin() {
    return new Promise(function(resolve, reject) {
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
    .action((source, options)=> {
        let parser = compile;
        if (options.language) {
            switch(options.language) {
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
        
        
        let output = options.output?? "a.kx";
        let file = fs.readFileSync(source, {encoding: 'utf-8'});
        let compiled=parser(file);
        fs.writeFileSync(output, JSON.stringify(compiled));
        

    });

program
    .command('run <filename>')
    .option('--debug','enables debug output')
    .option('-i, --input [worldIn]','If specified, it reads the world from the file, otherwise it reads from stdin')
    .option('-o, --output [worldOut]','If specified, it writes the output to the file, otherwise it writes to stdout')
    .description('runs file')
    .action(function(filename, options) {
        var file = fs.readFileSync(filename, {encoding: 'utf-8'});
        var compiled = null;
        if (filename.endsWith('.kx')) {
            compiled = JSON.parse(file);
        } else {
            compiled = compile(file);
        }

        function run(worldXml) {
            var world = new World(100, 100);
            world.load(worldXml);
            if (options.debug) {
                world.runtime.debug = true;
                world.runtime.addEventListener('debug', function(ev) {
                console.log(ev.debugType, ev.message);
                });
            }
            world.runtime.load(compiled);
            while (world.runtime.step());
            if (options.output) {
                fs.writeFileSync(options.output, world.output());
            } else {
                console.log(world.output());
            }
        }
        if (options.input) {
            let file = fs.readFileSync(options.input, {encoding: 'utf-8'});
            let worldXml = new DOMParser().parseFromString(file, 'text/xml');
            run(worldXml);
        } else {
            readStdin()
                .then(stdin => {
                    let worldXml = new DOMParser().parseFromString(stdin as string, 'text/xml');
                    run(worldXml);
            });
        }
    });

    
program.parse(process.argv);