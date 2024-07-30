![NPM Version](https://img.shields.io/npm/v/%40rekarel%2Fcli)


This is the command line interface for a Karel compiler.

- [Install](#install)
- [Commands](#commands)
  - [Run](#run)
  - [Compile](#compile)

# Install

`npm install -g @rekarel/cli`

# Commands

`rekarel [-v]`

## Run

`rekarel run <filename> [-w world.in]`

Runs a filename (if it has extension .kx it runs it directly, otherwise it compiles it first) and outputs the world.out to stdout

If a world.in is not supplied, it reads the world from stdin, but if specified, then it reads the file.

**Exit codes**

- **0**: `OK`
- **1** `INSTRUCTION` Karel tried to execute more instructions than allowed.
- **2** `WALL` Karel tried to execute more instructions than allowed.
- **3** `WORLDUNDERFLOW` Karel tried to take a beeper on an empty cell.
- **4** `BAGUNDERFLOW` Karel tried to leave a beeper with an empty bag.
- **5** `STACK` Karel suffered a stack overflow.

## Compile

`rekarel compile <filename>`

Compiles a source code into a .kx file, Karel's bytecode
