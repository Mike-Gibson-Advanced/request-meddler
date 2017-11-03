import { IAction, IActionProcessingContext } from "./action";

export class ManualErrorAction implements IAction {
    get description() {
        return `Manual error`;
    }

    process(
        next: () => void,
        context: IActionProcessingContext,
        error: (details: { code: number, message: string }) => void): void {

        let resolved = false;

        const timeout = setTimeout(() => {
            if (resolved) {
                return;
            }

            context.log("Timeout, not returning error");
            context.cancelConfirm();

            resolved = true;
            next();
        }, 7000);

        context.confirmWithUser("Return error?")
            .then((returnError) => {

                context.log("returnError:" + returnError);
                if (resolved) {
                    return;
                }

                clearTimeout(timeout);

                if (returnError) {
                    context.log("Returning error");
                    error({ code: 500, message: "Manual error"});
                } else {
                    context.log("Not returning error");
                    next();
                }
            });
    }
}
