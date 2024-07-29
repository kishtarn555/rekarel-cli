import { World } from "@rekarel/core"
import { run } from "node:test"

interface DebuggerOptions {
    code?: string
    slowMode?: number,
    delay?: number
}

export class KarelDebugger {
    private world: World
    private breakpoints: Set<number>
    private delay: number
    private lines: string[];
    private slowMode: number;
    private autoStepInterval: number;
    private futureStepping: boolean;


    constructor(world: World, options: DebuggerOptions) {
        this.world = world;
        this.delay = options.delay ?? 300;
        this.slowMode = options.slowMode ?? -1;
        this.lines = options.code ? options.code.split('\n') : [];
        this.breakpoints = new Set<number>();
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
        while (this.PerformAutoStep());
    }

    StopAutoStep() {
        if (this.autoStepInterval !== 0) {
            clearInterval(this.autoStepInterval);
            this.autoStepInterval = 0;
        }
    }

    StartAutoStep(delay:number) {
        this.delay = delay;
        this.autoStepInterval = window.setInterval(
            () => {
                if (!this.world.runtime.running) {
                    this.StopAutoStep();
                    return;
                }
                if (this.futureStepping) {
                    //Is futureStepping, wait for it to end.
                    return;
                }
                this.Step();
            },
            this.delay
        );
    }

    Step() {
        const runtime = this.world.runtime;
        runtime.step();
        if (this.lines.length > runtime.state.line) {
            const pascal = /\@saltatela/g
            const java = /\@autoSkip/g
            const text = this.lines[runtime.state.line]
            if (pascal.test(text) || java.test(text)) {
                this.StepOut();
            }
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
        while (this.PerformAutoStep() && runtime.state.stackSize >= startWStackSize);
        this.futureStepping = false;
    }

    StepOver() {


        const runtime = this.world.runtime;
        const startWStackSize = runtime.state.stackSize;
        runtime.step();
        if (runtime.state.stackSize > startWStackSize) {
            while (this.PerformAutoStep() && runtime.state.stackSize > startWStackSize);
        }
    }

    SetBreakpoints(breakpoints: number[]) {
        this.breakpoints.clear();
        breakpoints.forEach(bp => this.breakpoints.add(bp));
    }

    ClearBreakpoints() {
        this.breakpoints.clear();
    }

    AddBreakpoint(line: number) {
        this.breakpoints.add(line);
    }

    RemoveBreakPoint(line: number) {
        this.breakpoints.delete(line);
    }


    private PerformAutoStep(ignoreBreakpoints: boolean = false) {
        const runtime = this.world.runtime;
        const result = runtime.step();
        if (this.slowMode > -1 && runtime.state.ic as number >= this.slowMode && !runtime.disableStackEvents) {
            runtime.disableStackEvents = true;
        }
        return result && (ignoreBreakpoints || !this.CheckForBreakPointOnCurrentLine());
    }

    CheckForBreakPointOnCurrentLine(): boolean {
        const runtime = this.world.runtime;
        return this.breakpoints.has(runtime.state.pc);
    }
}