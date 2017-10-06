import * as http from "http";
import config from "./config";
import * as loggers from "./logger";
import { server as proxyServer } from "./server-proxy";
import { server as uiServer } from "./server-ui";

function listen(server: http.Server, port: number, logger: loggers.LoggerInstance) {
    logger.info(`Will now listen on ${port}.`);
    server.on("listening", () => {
        logger.info("Listening");
    });
    server.listen(port);
}

listen(uiServer, config.uiPort, loggers.uiLogger);
listen(proxyServer, config.proxyPort, loggers.proxyLogger);
