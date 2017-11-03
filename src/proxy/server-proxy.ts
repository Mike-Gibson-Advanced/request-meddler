import * as http from "http";
import * as httpProxy from "http-proxy";
import { proxyLogger as logger } from "../logger";
import { config as rulesConfig } from "../rules";
import { emitter } from "../state";
import { addHitRequest, addHitResponse, linkRulesTohit /*, getState */ } from "../state";
import { config } from "./config";

const proxy = httpProxy.createProxy();

proxy.on("proxyRes", function(proxyRes, req, res) {
    // collect response data
    let proxyResData = "";
    proxyRes.on("data", function(chunk) {
        proxyResData += chunk;
    });
    proxyRes.on("end", () => {
        const hitId: number = (<any>req)._hitId;
        addHitResponse(hitId, proxyResData, res);
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
            const response = { error: true, message: details.message };
            writeError(res, details.code, response);
            addHitResponse(id, JSON.stringify(response), res);
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
                                confirmWithUser: (question: string) => {
                                    return new Promise<boolean>((resolve) => {
                                        // tslint:disable-next-line:no-console
                                        console.log("asking...", { id: id, question: question });
                                        emitter.emit("askUser", { id: id, question: question });
                                        const listener = (response: { id: number, response: boolean }) => {
                                            if (response.id === id) {
                                                resolve(response.response);
                                                emitter.removeListener("userResponse", listener);
                                            }
                                        };
                                        emitter.on("userResponse", listener);
                                    });
                                },
                                cancelConfirm: () => {
                                    emitter.emit("cancelAskUser", { id: id });
                                },
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

function writeError(res: http.ServerResponse, code: number, content: any) {
    res.setHeader("content-type", "application/json");
    res.writeHead(code);
    res.end(JSON.stringify(typeof(content) === "string" ? { error: true, message: content } : content));
}
