import { IRequest } from "requests";
import { IRule } from "rules";

export class State {
    requests: IRequest[] = [];
    rules: IRule[] = [];
    questions: Array<{ id: number, question: string, sendResult: (result: boolean) => void }> = [];
}
