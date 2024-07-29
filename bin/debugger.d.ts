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
    private autoStepInterval;
    private futureStepping;
    constructor(world: World, options: DebuggerOptions);
    GetWorld(): World;
    StartRun(): void;
    RunTillEnd(): void;
    StopAutoStep(): void;
    StartAutoStep(delay: number): void;
    Step(): void;
    StepOut(): void;
    StepOver(): void;
    SetBreakpoints(breakpoints: number[]): void;
    ClearBreakpoints(): void;
    AddBreakpoint(line: number): void;
    RemoveBreakPoint(line: number): void;
    Output(): any;
    private PerformAutoStep;
    CheckForBreakPointOnCurrentLine(): boolean;
}
export {};
