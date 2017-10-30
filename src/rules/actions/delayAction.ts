import { IAction, IActionProcessingContext } from "./action";

export class DelayAction implements IAction {
    private delayInMilliseconds: number;

    get description() {
        return `Delay by ${this.delayInMilliseconds}`;
    }

    constructor(delayInMilliseconds: number) {
        this.delayInMilliseconds = delayInMilliseconds;
    }

    process(next: () => void, context: IActionProcessingContext): void {
        setTimeout(() => {
            context.log("Calling next");
            next();
        }, this.delayInMilliseconds);
    }
}
