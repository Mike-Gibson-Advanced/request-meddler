import { IAction, IActionProcessingContext } from "./action";

export class ForceOutOfOrderAction implements IAction {
    private timeoutInMilliseconds: number;
    private timeoutId: number | null;

    private previousRequest: {
        timeout: NodeJS.Timer,
        complete: () => void,
    } | null;

    get description() {
        return "Force out of order responses";
    }

    constructor(timeoutInMilliseconds: number) {
        this.timeoutInMilliseconds = timeoutInMilliseconds;
        this.timeoutId = null;
    }

    process(proxyRequest: () => void, context: IActionProcessingContext): void {
        if (this.previousRequest) {
            context.log("Already have a previous request, completing this one and then the other");
            proxyRequest();
            clearTimeout(this.previousRequest.timeout);
            this.previousRequest.complete();
            this.previousRequest = null;
            return;
        }

        context.log(`No previous request, waiting for ${this.timeoutInMilliseconds}ms ` +
            "or a subsequent request before completion");
        this.previousRequest = {
            timeout: setTimeout(() => {
                context.log(
                    `No subsequent request received within ${this.timeoutInMilliseconds}ms, completing request`),
                proxyRequest();
                this.previousRequest = null;
            }, this.timeoutInMilliseconds),
            complete: proxyRequest,
        };
    }
}
