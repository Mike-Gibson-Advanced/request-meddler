import * as http from "http";
import * as httpProxy from "http-proxy";
import { proxyLogger as logger } from "../logger";
import { config as rulesConfig } from "../rules";
import { addHitRequest, addHitResponse, linkRulesTohit /*, getState */ } from "../state";
import { config } from "./config";

const proxy = httpProxy.createProxy();

// proxy.on("proxyReq", function(proxyReq, req, res, options) {
//     // var target = proxyRules.match(req);
//     // //console.log("HOST: ", options);

//     // if (options.target.host === "127.0.0.1:8889") {
//     //     console.log("localhost, NOT overriding session ID");
//     //     return;
//     // }

//     // if (sessionIdOverride)
//     //     proxyReq.setHeader("X-Session-Id", sessionIdOverride);
// });

// tslint:disable-next-line:variable-name
proxy.on("proxyRes", function(proxyRes, req, res) {
    // collect response data
    let proxyResData = "";
    proxyRes.on("data", function(chunk) {
        proxyResData += chunk;
    });
    proxyRes.on("end", () => {
        const hitId: number = (<any>req)._hitId;
        addHitResponse(hitId, proxyResData, res);

        // logger.info(JSON.stringify(getState()));
    });
});

export const server = http.createServer((req, res) => {
    logger.debug(`matching '${req.url}' ...`);

    const target = config.getProxyRules().match(req);
    if (target) {
        logger.debug(`Matched. Proxying to '${target}'.`);

        const id = addHitRequest(req);
        // Attach identifier
        (<any>req)._hitId = id;

        const getLogMessage = (message: string) => `[Request ${id}] ${message}`;

        const rules = rulesConfig.findRules(req.url || "");
        logger.debug(getLogMessage(`Found ${rules.length} rule(s) for url '${req.url}'`));

        linkRulesTohit(id, rules);

        const next = () => {
            logger.debug(getLogMessage(`Proxying request to '${target}'`));

            return proxy.web(req, res, {
                target: target,
                // https: true,
                // secure: false,
                // changeOrigin: true,
            }, (e) => {
                const error = `Error proxying request to ${target}: ${e.message}`;
                logger.error(getLogMessage(error));
                writeError(res, 500, error);
            });
        };

        const returnError = (details: { code: number, message: any }) => {
            writeError(res, details.code, details.message);
            addHitResponse(id, "Errored", res);
        };

        const startChain = rules.reverse().reduce((accumulator, current) => {
            return () => {
                const ruleLog = (message: string) =>
                    logger.debug(getLogMessage(`[Rule '${current.description}'] ${message}`));

                if (!current.actions.length) {
                    ruleLog("No actions defined");
                    accumulator();
                } else {
                    const startAction = [...current.actions].reverse().reduce((actionAccumulator, currentAction) => {
                        return () => {
                            const actionLog = (message: string) => logger
                                .debug(getLogMessage(`[Rule '${current.description}'] ` +
                                    `[Action '${currentAction.description}'] ${message}`));
                            const processingContext = {
                                log: actionLog,
                            };

                            ruleLog(`Running action '${currentAction.description}'`);
                            currentAction.process(actionAccumulator, processingContext, returnError);
                        };
                    }, accumulator);

                    startAction();
                }
            };
        }, next);

        startChain();
        return;
    }

    writeError(res, 500, "The request url and path did not match any of the listed rules");
});

function writeError(res: http.ServerResponse, code: number, message: string) {
    res.writeHead(code, { "content-type": "application/json" });
    res.end(JSON.stringify({
        error: true,
        message: message,
    }));
}
