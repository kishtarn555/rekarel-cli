// TypeScript (.ts)
import { Command } from 'commander';
import { javaParser, pascalParser, compile} from "@rekarel/core"
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();



program.version("cli-1.0.0; rekarel-1.0.0");

program.command('compile')
    .argument('<source>', 'source code')
    .option('-l, --language <type>')
    .option('-o, --output [target]')
    .action((source, options)=> {
        let parser = compile;
        if (options.language) {
            switch(options.parser) {
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
            let output = options.output?? "a.kx";
            let file = fs.readFileSync(source, {encoding: 'utf-8'});
            let compiled=parser(file);
            fs.writeFileSync(output, JSON.stringify(compiled));
        } catch(error) {
            console.error(error);
        }

    });