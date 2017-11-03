import { IQuestionOption } from "questions";

export interface IAction {
    readonly description: string;
    process(
        next: () => void,
        context: IActionProcessingContext,
        error: (details: { code: number, message: string }) => void): void;
}

export interface IActionProcessingContext {
    log(message: string): void;
    askUser(question: string, options: IQuestionOption[]): Promise<any>;
    cancelConfirm(): void;
}
