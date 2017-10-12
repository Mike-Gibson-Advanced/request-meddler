import * as http from "http";
import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as koaLogger from "koa-logger-winston";
import * as Router from "koa-router";
import { uiLogger as logger } from "../logger";

import { devMiddleware /*, hotMiddleware */ } from "koa-webpack-middleware";
import * as webpack from "webpack";

// tslint:disable-next-line:no-var-requires
const devConfig = require("../../config/webpack.config.dev");

import { routes } from "./requests";

const router = new Router();
router
    .use(routes.routes())
    .use(routes.allowedMethods());

const compile = webpack(devConfig);

const app = new Koa()
    .use(koaLogger(logger))
    .use(bodyParser())
    .use(router.routes())
    .use(devMiddleware(compile, {
        noInfo: false,
        quiet: false,
        lazy: false,
        watchOptions: {
            aggregateTimeout: 300,
            poll: true,
        },

        // public path to bind the middleware to
        // use the same as in webpack
        // publicPath: "/assets/",

        stats: {
            colors: true,
        },
    }));
    // .use(hotMiddleware(compile, {
    //     log: console.log,
    //     path: "/__webpack_hmr",
    //     heartbeat: 1 * 1000,
    // }));

export const server = http.createServer(app.callback());

// Websocket stuff, could be moved:
import { Server as WebSocketServer } from "ws";

const socketServer = new WebSocketServer({ server: server });

socketServer.on("connection", (socket) => {
    logger.debug("WebSocket connection received");

    socket.on("error", (error) => {
        logger.debug(`WebSocket error occurred: ${error}`);
    });

    socket.on("message", (message) => {
        logger.debug(`WebSocket message received: ${message}`);
    });

    socket.send("HI from server");
});
