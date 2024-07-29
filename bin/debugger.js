export class KarelDebugger {
    constructor(world, options) {
        var _a, _b;
        this.world = world;
        this.delay = (_a = options.delay) !== null && _a !== void 0 ? _a : 300;
        this.slowMode = (_b = options.slowMode) !== null && _b !== void 0 ? _b : -1;
        this.lines = options.code ? options.code.split('\n') : [];
        this.breakpoints = new Set();
    }
    GetWorld() {
        return this.world;
    }
    RunTillEnd() {
        const runtime = this.world.runtime;
        while (this.PerformAutoStep())
            ;
    }
    SetBreakpoints(breakpoints) {
        this.breakpoints.clear();
        breakpoints.forEach(bp => this.breakpoints.add(bp));
    }
    ClearBreakpoints() {
        this.breakpoints.clear();
    }
    AddBreakpoint(line) {
        this.breakpoints.add(line);
    }
    RemoveBreakPoint(line) {
        this.breakpoints.delete(line);
    }
    PerformAutoStep(ignoreBreakpoints = false) {
        const runtime = this.world.runtime;
        const result = runtime.step();
        if (this.slowMode > -1 && runtime.state.ic >= this.slowMode && !runtime.disableStackEvents) {
            runtime.disableStackEvents = true;
        }
        return result && (ignoreBreakpoints || !this.CheckForBreakPointOnCurrentLine());
    }
    CheckForBreakPointOnCurrentLine() {
        const runtime = this.world.runtime;
        return this.breakpoints.has(runtime.state.pc);
    }
}
//# sourceMappingURL=debugger.js.map