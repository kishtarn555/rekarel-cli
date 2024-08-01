export var RunResult;
(function (RunResult) {
    RunResult[RunResult["OK"] = 0] = "OK";
    RunResult[RunResult["WALL"] = 16] = "WALL";
    RunResult[RunResult["WORLDUNDERFLOW"] = 17] = "WORLDUNDERFLOW";
    RunResult[RunResult["BAGUNDERFLOW"] = 18] = "BAGUNDERFLOW";
    RunResult[RunResult["STACK"] = 19] = "STACK";
    RunResult[RunResult["INSTRUCTION"] = 48] = "INSTRUCTION";
    RunResult[RunResult["INSTRUCTION_LEFT"] = 49] = "INSTRUCTION_LEFT";
    RunResult[RunResult["INSTRUCTION_FORWARD"] = 49] = "INSTRUCTION_FORWARD";
    RunResult[RunResult["INSTRUCTION_PICK"] = 50] = "INSTRUCTION_PICK";
    RunResult[RunResult["INSTRUCTION_LEAVE"] = 51] = "INSTRUCTION_LEAVE";
})(RunResult || (RunResult = {}));
export function compilationError(err) {
    console.error("Compilation error:", err.message);
    if (err.hash) {
        console.error(err.hash);
    }
}
//# sourceMappingURL=errors.js.map