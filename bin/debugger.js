export class KarelDebugger {
    constructor(world, options) {
        var _a, _b;
        this.world = world;
        this.delay = (_a = options.delay) !== null && _a !== void 0 ? _a : 300;
        this.slowMode = (_b = options.slowMode) !== null && _b !== void 0 ? _b : -1;
        this.lines = options.code ? options.code.split('\n') : [];
        this.breakpoints = new Set();
        this.autoStepInterval = 0;
        this.futureStepping = false;
    }
    GetWorld() {
        return this.world;
    }
    StartRun() {
        this.world.reset();
        let runtime = this.world.runtime;
        runtime.disableStackEvents = false;
        runtime.reset();
        runtime.start();
    }
    RunTillEnd() {
        this.StopAutoStep();
        while (this.PerformAutoStep())
            ;
    }
    StopAutoStep() {
        if (this.autoStepInterval !== 0) {
            clearInterval(this.autoStepInterval);
            this.autoStepInterval = 0;
        }
    }
    StartAutoStep(delay) {
        this.delay = delay;
        this.autoStepInterval = window.setInterval(() => {
            if (!this.world.runtime.running) {
                this.StopAutoStep();
                return;
            }
            if (this.futureStepping) {
                //Is futureStepping, wait for it to end.
                return;
            }
            this.Step();
        }, this.delay);
    }
    Step() {
        const runtime = this.world.runtime;
        runtime.step();
        if (this.lines.length > runtime.state.line) {
            const pascal = /\@saltatela/g;
            const java = /\@autoSkip/g;
            const text = this.lines[runtime.state.line];
            if (pascal.test(text) || java.test(text)) {
                this.StepOut();
            }
            console.log("line ", text);
        }
    }
    StepOut() {
        this.futureStepping = true;
        const runtime = this.world.runtime;
        const startWStackSize = runtime.state.stackSize;
        if (startWStackSize === 0) {
            this.RunTillEnd();
            return;
        }
        this.futureStepping = true;
        while (this.PerformAutoStep() && runtime.state.stackSize >= startWStackSize)
            ;
        this.futureStepping = false;
    }
    StepOver() {
        const runtime = this.world.runtime;
        const startWStackSize = runtime.state.stackSize;
        runtime.step();
        if (runtime.state.stackSize > startWStackSize) {
            while (this.PerformAutoStep() && runtime.state.stackSize > startWStackSize)
                ;
        }
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
    Output() {
        return this.world.output();
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