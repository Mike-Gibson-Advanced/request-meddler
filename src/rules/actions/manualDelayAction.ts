import { IAction, IActionProcessingContext } from "./action";

export class ManualDelayAction implements IAction {
    get description() {
        return `Manual delay (timeout after ${this.timeoutInMilliseconds} ms)`;
    }

    constructor(private timeoutInMilliseconds: number = 5000) {
    }

    process(
        next: () => void, context: IActionProcessingContext): void {
        let resolved = false;

        const timeout = setTimeout(() => {
            if (resolved) {
                return;
            }

            context.log("Timeout, not returning error");
            context.cancelConfirm();

            resolved = true;
            next();
        }, this.timeoutInMilliseconds);

        const actions = [
            { value: true, text: "OK", primary: true },
        ];
        context.askUser("Click OK to continue processing request", actions)
            .then(() => {
                if (resolved) {
                    return;
                }

                clearTimeout(timeout);

                context.log("Forwarding request");
                next();

                resolved = true;
            });
    }
}
