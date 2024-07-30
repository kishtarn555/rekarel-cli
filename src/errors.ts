export enum RunResult {
    OK,
    INSTRUCTION,
    WALL,
    WORLDUNDERFLOW,
    BAGUNDERFLOW,
    STACK
  }


  export function compilationError(err) {
    console.error("Compilation error:", err.message);
    if (err.hash) {
        console.error(err.hash);
    }
  }