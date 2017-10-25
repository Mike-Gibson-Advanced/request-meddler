import * as router from "koa-router";
import { IRule } from "rules";
import { config } from "../../rules";

export const routes = new router();

routes.get("/api/rules", (ctx) => {
    const rules: IRule[] = config
        .getAllRules()
        .map<IRule>((rule) => ({
            id: rule.id,
            urlPattern: rule.urlPattern.toString(),
            description: rule.description,
            actionDescription: rule.action.description,
        }));
    ctx.body = rules;
});
