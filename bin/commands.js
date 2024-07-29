#!/usr/bin/env node
"use strict";
import { Command } from 'commander';
import { javaParser, pascalParser, compile } from "@rekarel/core";
import * as fs from 'fs';
const program = new Command();
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
program.parse(process.argv);
//# sourceMappingURL=commands.js.map