import * as router from "koa-router";

export const routes = new router();

routes.get("/api/temp", (ctx) => {
    ctx.body = "TEMP";
});
