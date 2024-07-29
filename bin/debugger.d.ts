import { World } from "@rekarel/core";
interface DebuggerOptions {
    code?: string;
    slowMode?: number;
    delay?: number;
}
export declare class KarelDebugger {
    private world;
    private breakpoints;
    private delay;
    private lines;
    private slowMode;
    constructor(world: World, options: DebuggerOptions);
    GetWorld(): World;
    RunTillEnd(): void;
    SetBreakpoints(breakpoints: number[]): void;
    ClearBreakpoints(): void;
    AddBreakpoint(line: number): void;
    RemoveBreakPoint(line: number): void;
    private PerformAutoStep;
    CheckForBreakPointOnCurrentLine(): boolean;
}
export {};
