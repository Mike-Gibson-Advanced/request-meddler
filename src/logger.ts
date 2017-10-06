import * as Winston from "winston";

const logger = new Winston.Logger({
    level: "debug",
    transports: [
        new Winston.transports.Console({
            handleExceptions: true,
        }),
    ],
    exitOnError: false,
});

export default logger;
