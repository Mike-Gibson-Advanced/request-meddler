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

import { routes as requests } from "./requests";
import { routes as rules } from "./rules";

const router = new Router();
router
    .use(requests.routes())
    .use(requests.allowedMethods())
    .use(rules.routes())
    .use(rules.allowedMethods());

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

import { emitter } from "../state";

const socketServer = new WebSocketServer({ server: server });

socketServer.on("connection", (socket) => {
    logger.debug("WebSocket connection received");

    connections.push(socket);

    socket.on("error", (error) => {
        logger.debug(`WebSocket error occurred: ${error}`);
    });

    socket.on("message", (rawMessage) => {
        logger.debug(`WebSocket message received: ${rawMessage}`);

        const message = JSON.parse(rawMessage.toString()) as { type: string, payload: any };

        switch (message.type) {
            case "userResponse":
                emitter.emit("userResponse", message.payload);
                break;
            default:
                logger.error(`Unexpected message type: '${message.type}'`);
        }
    });

    socket.on("close", () => {
        const index = connections.indexOf(socket);
        if (index > -1) {
            connections.splice(index, 1);
        }
    });
});

const connections: any[] = [];
function sendToAll(type: string, payload: any) {
    connections.forEach((socket: WebSocket) => {
        if (socket.readyState !== socket.OPEN) {
            // TODO: Properly implement unsubscribe
            logger.error("Subscribed web socket client, not in OPEN state");
            return;
        }

        socket.send(JSON.stringify({ type: type, payload: payload }));
    });
}

emitter.on("newRequest", (request) => {
    sendToAll("newRequest", request);
});

emitter.on("newResponse", (response) => {
    sendToAll("newResponse", response);
});

emitter.on("appliedRulesChanged", (response) => {
    sendToAll("appliedRulesChanged", response);
});

emitter.on("askUser", (options) => {
    sendToAll("askUser", options);
});

emitter.on("cancelAskUser", (options) => {
    sendToAll("cancelAskUser", options);
});
