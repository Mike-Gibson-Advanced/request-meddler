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
import { config as rulesConfig } from "./rules";
import { DelayAction } from "./rules/actions";

rulesConfig.addRule({
    description: "All API requests",
    urlPattern: /\/api/,
    action: new DelayAction(5000),
});
