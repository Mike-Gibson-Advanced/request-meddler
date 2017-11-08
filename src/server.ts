import * as http from "http";
import config from "./config";
import * as loggers from "./logger";
import { server as proxyServer } from "./proxy";
import { server as uiServer } from "./ui";

function listen(server: http.Server, port: number, logger: loggers.LoggerInstance) {
    logger.info(`Will now listen on ${port}`);
    server.on("listening", () => {
        logger.info(`Listening on ${port}`);
    });
    server.listen(port);
}

listen(uiServer, config.uiPort, loggers.uiLogger);
listen(proxyServer, config.proxyPort, loggers.proxyLogger);

// TEMP:
import { config as proxyConfig } from "./proxy";
import { config as rulesConfig } from "./rules";
import * as actions from "./rules/actions";

proxyConfig.setProxyAddress("http://127.0.0.1:8889");

// rulesConfig.addRule({
//     description: "All API requests",
//     urlPattern: /\/api/i,
//     actions: [
//         new actions.DelayAction(2000),
//     ],
// });

rulesConfig.addRule({
    description: "Care needs list",
    urlPattern: /\/api\/serviceusers\/(.*)\/careneeds$/i,
    actions: [
        new actions.ManualDelayAction(30 * 1000),
    ],
});
