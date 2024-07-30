export var RunResult;
(function (RunResult) {
    RunResult[RunResult["OK"] = 0] = "OK";
    RunResult[RunResult["INSTRUCTION"] = 1] = "INSTRUCTION";
    RunResult[RunResult["WALL"] = 2] = "WALL";
    RunResult[RunResult["WORLDUNDERFLOW"] = 3] = "WORLDUNDERFLOW";
    RunResult[RunResult["BAGUNDERFLOW"] = 4] = "BAGUNDERFLOW";
    RunResult[RunResult["STACK"] = 5] = "STACK";
})(RunResult || (RunResult = {}));
export function compilationError(err) {
    console.error("Compilation error:", err.message);
    if (err.hash) {
        console.error(err.hash);
    }
}
//# sourceMappingURL=errors.js.map