import { IAction } from "./actions";

export interface IRule {
    description: string;
    urlPattern: RegExp;
    action: IAction; // TODO: Array of actions?
}

class Config {
    private rules: IRule[] = [];

    findRules(url: string): IRule[] {
        return this.rules.filter((rule) => rule.urlPattern.test(url));
    }

    addRule(rule: IRule) {
        this.rules.push(rule);
    }
}

export const config = new Config();
