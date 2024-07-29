This is the command line interface for a Karel compiler.

# Install

`npm install -g @rekarel/cli`

# Command
`rekarel [-v]`

## Run

`rekarel run <filename> [-w world.in]`

Runs a filename (if it has extension .kx it runs it directly, otherwise it compiles it first) and outputs the world.out to stdout

If a world.in is not supplied, it reads the world from stdin, but if specified, then it reads the file.

## Compile

`rekarel compile <filename>`

Compiles a source code into a .kx file, Karel's bytecode
