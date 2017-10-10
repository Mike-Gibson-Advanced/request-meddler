export interface IAction {
    readonly description: string;
    process(proxyRequest: () => void, context: IActionProcessingContext): void;
}

export interface IActionProcessingContext {
    log(message: string): void;
}
