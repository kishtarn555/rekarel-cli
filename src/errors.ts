export enum RunResult {
    OK=0,
    WALL = 16+0,
    WORLDUNDERFLOW = 16+1,
    BAGUNDERFLOW = 16+2,
    STACK = 16+3,    
    INSTRUCTION = 32+16+0,
    INSTRUCTION_LEFT = 32+16+1,
    INSTRUCTION_FORWARD = 32+16+2,
    INSTRUCTION_PICK = 32+16+3,
    INSTRUCTION_LEAVE = 32+16+4,
  }


  export function compilationError(err) {
    console.error("Compilation error:", err.message);
    if (err.hash) {
        console.error(err.hash);
    }
  }