import * as router from "koa-router";
import { IRequest } from "requests";
import { getState } from "../../state";

export const routes = new router();

routes.get("/api/requests", (ctx) => {
    const state = getState();

    ctx.body = state.hits
        .map((hit) => (<IRequest>{
            ...hit,
            appliedRules: hit.appliedRules.map((rule) => ({ id: rule.id})),
        }))
        .reverse();
});
