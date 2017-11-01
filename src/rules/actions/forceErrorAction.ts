import { IAction, IActionProcessingContext } from "./action";

export class ForceErrorAction implements IAction {
    private probability: number;

    get description() {
        if (this.probability === 1) {
            return "Always return error";
        }
        if (this.probability === 0) {
            return "Never return error";
        }

        return `Return error (probability = ${this.probability})`;
    }

    constructor(probability: number) {
        this.probability = Math.min(probability, 1);
        this.probability = Math.max(0, this.probability);
    }

    process(
        next: () => void,
        context: IActionProcessingContext,
        error: (details: { code: number, message: string }) => void): void {
        const returnError = Math.random() < this.probability; // Math.random returns value in [0, 1)

        if (returnError) {
            context.log("Returning error");

            error({ code: 500, message: "Forced error"});
        } else {
            context.log("Not returning error");
            next();
        }
    }
}
