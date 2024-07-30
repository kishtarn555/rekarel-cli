export var RunResult;
(function (RunResult) {
    RunResult[RunResult["OK"] = 0] = "OK";
    RunResult[RunResult["INSTRUCTION"] = 1] = "INSTRUCTION";
    RunResult[RunResult["WALL"] = 2] = "WALL";
    RunResult[RunResult["WORLDUNDERFLOW"] = 3] = "WORLDUNDERFLOW";
    RunResult[RunResult["BAGUNDERFLOW"] = 4] = "BAGUNDERFLOW";
    RunResult[RunResult["STACK"] = 5] = "STACK";
})(RunResult || (RunResult = {}));
//# sourceMappingURL=errors.js.map