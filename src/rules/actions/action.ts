export interface IAction {
    readonly description: string;
    process(next: () => void, context: IActionProcessingContext): void;
}

export interface IActionProcessingContext {
    log(message: string): void;
}
