import * as Winston from "winston";

function createLogger(label?: string) {
    return new Winston.Logger({
        level: "debug",
        transports: [
            new Winston.transports.Console({
                handleExceptions: true,
                label: label,
                colorize: true,
            }),
        ],
        exitOnError: false,
    });
}

export { LoggerInstance } from "winston";
export const defaultLogger = createLogger();
export const uiLogger = createLogger("UI");
export const proxyLogger = createLogger("Proxy");
