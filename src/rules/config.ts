import { IAction } from "./actions";

export interface IRule {
    id: number;
    description: string;
    urlPattern: RegExp;
    actions: IAction[];
}

class Config {
    private nextRuleId: number = 1;
    private rules: IRule[] = [];

    getAllRules(): IRule[] {
        return this.rules;
    }

    findRules(url: string): IRule[] {
        return this.rules.filter((rule) => rule.urlPattern.test(url));
    }

    addRule(rule: { description: string, urlPattern: RegExp, actions: IAction[] }) {
        this.rules.push({
            id: this.nextRuleId++,
            ...rule,
        });
    }
}

export const config = new Config();
