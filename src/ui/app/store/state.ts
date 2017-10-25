import { IRequest } from "requests";
import { IRule } from "rules";

export class State {
    requests: IRequest[] = [];
    rules: IRule[] = [];
}
