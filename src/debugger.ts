import {World} from "@rekarel/core"
import { run } from "node:test"

interface DebuggerOptions {
    code?: string
    slowMode?:number,
    delay?:number
}

export class KarelDebugger {
    private world:World
    private breakpoints:Set<number>
    private delay:number
    private lines:string[];
    private slowMode:number


    constructor(world:World, options:DebuggerOptions) {
        this.world = world;
        this.delay = options.delay??300;
        this.slowMode = options.slowMode??-1;
        this.lines = options.code ? options.code.split('\n') : [];
        this.breakpoints = new Set<number>();
    }

    GetWorld() {
        return this.world;
    }


    RunTillEnd() {
        const runtime = this.world.runtime;
        while (this.PerformAutoStep());
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


    private PerformAutoStep(ignoreBreakpoints:boolean = false) {
        const runtime = this.world.runtime;
        const result = runtime.step();
        if (this.slowMode > -1 && runtime.state.ic as number >=  this.slowMode && !runtime.disableStackEvents) {
            runtime.disableStackEvents = true;            
        }
        return result && (ignoreBreakpoints || !this.CheckForBreakPointOnCurrentLine());
    }

    CheckForBreakPointOnCurrentLine():boolean {
        const runtime = this.world.runtime;
        return this.breakpoints.has(runtime.state.pc);        
    }
}