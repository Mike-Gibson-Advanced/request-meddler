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

            next();
            resolved = true;
        }, 7000);

        const actions = [
            { value: true, text: "Yes", primary: true },
            { value: false, text: "No", primary: false },
        ];
        context.askUser("Return error?", actions)
            .then((returnError: boolean) => {
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
                resolved = true;
            });
    }
}
