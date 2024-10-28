![NPM Version](https://img.shields.io/npm/v/%40rekarel%2Fcli)


This is the command line interface for a Karel compiler.

- [Install](#install)
- [Commands](#commands)
  - [Run](#run)
  - [Compile](#compile)

# Install

`npm install -g @rekarel/cli`

# Commands

## Versioning

`rekarel [-V]`

Shows the version of the rekarel command.

## Run

`rekarel run <filename> [-i world.in] [-o world.out]`

Runs a filename (if it has extension .kx it runs it directly, otherwise it compiles it first) and outputs the world.out to stdout

### Arguments

* `-i` If a world.in is not supplied, it reads the world from stdin, but if specified, then it reads the file.

* `-o `If a world.out is not supplied, it prints the output to stdout, but if specidied, then it writes to the path provided.

**Behaviour**

Depending on how the execution ends, the console returns a exit signal and may print to stderr based on the follow table:

| Status                  | Exit signal | Stderr                                | Description                                                        |
|-------------------------|-------------|---------------------------------------|--------------------------------------------------------------------|
| OK                      | 0           | ----                                  | No error, execution succeeded.                                     |
| WALL                    | 16          | MOVIMIENTO INVALIDO                   | Karel tried to move into a wall.                                   |
| WORLDUNDERFLOW          | 17          | ZUMBADOR INVALIDO MUNDO               | Karel tried to take a beeper on an empty cell.                     |
| BAGUNDERFLOW            | 18          | ZUMBADOR INVALIDO MOCHILA             | Karel tried to leave a beeper with an empty bag.                   |
| STACK                   | 19          | STACK OVERFLOW                        | Karel suffered a stack overflow.                                   |
| STACKMEMORY             | 20          | LIMITE DE MEMORIA DEL STACK           | Karel exceeded the stack memory limits.                            |
| CALLSIZE                | 21          | LIMITE DE LONGITUD DE LLAMADA         | Karel exceeded the number of parameters permitted in a call.       |
| INSTRUCTION             | 48          | LIMITE DE INSTRUCCIONES GENERAL       | Karel exceeded the general number of allowed instructions.         |
| INSTRUCTION_LEFT        | 49          | LIMITE DE INSTRUCCIONES IZQUIERDA     | Karel exceeded the number of allowed turnleft.                     |
| INSTRUCTION_FORWARD     | 50          | LIMITE DE INSTRUCCIONES AVANZA        | Karel exceeded the number of allowed move.                         |
| INSTRUCTION_PICKBUZZER  | 51          | LIMITE DE INSTRUCCIONES COGE_ZUMBADOR | Karel exceeded the number of allowed pickbeeper.                   |
| INSTRUCTION_LEAVEBUZZER | 52          | LIMITE DE INSTRUCCIONES DEJA_ZUMBADOR | Karel exceeded the number of allowed putbeeper.                    |

> Notice that what is usually considered RTE has only 16 bit on, while errors that are considered TLE or Instruction limit exceeded (ILE) have both the 16 and 32 bit on.

## Compile

`rekarel compile <filename> [-l java|pascal] [-o output]`

Compiles a source code into a .kx file, Karel's bytecode

### Arguments
* `-l` `--language` If set, it tries to compile to the specified target language. If not, the compiler attempts to detect the language.
* `-o` `--output` If set, it compiles to the target file, if not, it generates a file named `a.kx`
