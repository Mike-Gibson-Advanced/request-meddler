import { IAction } from "./actions";

export interface IRule {
    id: number;
    description: string;
    urlPattern: RegExp;
    action: IAction; // TODO: Array of actions?
}

class Config {
    private nextRuleId: number = 1;
    private rules: IRule[] = [];

    findRules(url: string): IRule[] {
        return this.rules.filter((rule) => rule.urlPattern.test(url));
    }

    addRule(rule: { description: string, urlPattern: RegExp, action: IAction }) {
        this.rules.push({
            id: this.nextRuleId++,
            ...rule,
        });
    }
}

export const config = new Config();
