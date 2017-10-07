export interface IAction {
    readonly description: string;
    process(proxyRequest: () => void): void;
}

export class DelayAction implements IAction {
    private delayInMilliseconds: number;

    get description() {
        return `Delay by ${this.delayInMilliseconds}`;
    }

    constructor(delayInMilliseconds: number) {
        this.delayInMilliseconds = delayInMilliseconds;
    }

    process(proxyRequest: () => void): void {
        setTimeout(() => {
            proxyRequest();
        }, this.delayInMilliseconds);
    }
}
