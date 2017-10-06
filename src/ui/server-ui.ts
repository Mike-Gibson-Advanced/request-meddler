import * as http from "http";
import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as koaLogger from "koa-logger-winston";
import * as Router from "koa-router";
import { uiLogger as logger } from "../logger";

import { routes } from "./temp";

const router = new Router();
router
    .use(routes.routes())
    .use(routes.allowedMethods());

const app = new Koa()
    .use(koaLogger(logger))
    .use(bodyParser())
    .use(router.routes());

export const server = http.createServer(app.callback());
