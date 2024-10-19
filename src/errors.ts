export enum RunResult {
    OK=0,
    WALL = 16+0,
    WORLDUNDERFLOW = 16+1,
    BAGUNDERFLOW = 16+2,
    STACK = 16+3,
    STACKMEMORY = 16+4,
    CALLSIZE = 16+5,
    INSTRUCTION = 32+16+0,
    INSTRUCTION_LEFT = 32+16+1,
    INSTRUCTION_FORWARD = 32+16+2,
    INSTRUCTION_PICKBUZZER = 32+16+3,
    INSTRUCTION_LEAVEBUZZER = 32+16+4,
  }
  export enum ERROR_STDERR {    
    WALL = "MOVIMIENTO INVALIDO",
    WORLDUNDERFLOW = "ZUMBADOR INVALIDO MUNDO",
    BAGUNDERFLOW = "ZUMBADOR INVALIDO MOCHILA",
    STACK = "STACK OVERFLOW",
    STACKMEMORY = "LIMITE DE LONGITUD DE LLAMADA",
    CALLSIZE = "LIMITE DE LONGITUD DE LLAMADA",
    INSTRUCTION = "LIMITE DE INSTRUCCIONES GENERAL",
    INSTRUCTION_LEFT = "LIMITE DE INSTRUCCIONES IZQUIERDA",
    INSTRUCTION_FORWARD = "LIMITE DE INSTRUCCIONES AVANZA",
    INSTRUCTION_PICKBUZZER = "LIMITE DE INSTRUCCIONES COGE_ZUMBADOR",
    INSTRUCTION_LEAVEBUZZER = "LIMITE DE INSTRUCCIONES DEJA_ZUMBADOR",
  }

  export function sendErrorResultToStderr(result: string):boolean {
    if (result in ERROR_STDERR) {
      console.error(ERROR_STDERR[result]);
      return true;
    }
    return false;
  }

  export function compilationError(err) {
    console.error("Compilation error:", err.message);
    if (err.hash) {
        console.error(err.hash);
    }
  }