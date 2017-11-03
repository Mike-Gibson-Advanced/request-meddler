import * as http from "http";
import * as httpProxy from "http-proxy";
import { IQuestionOption } from "questions";
import { proxyLogger as logger } from "../logger";
import { config as rulesConfig } from "../rules";
import { emitter } from "../state";
import { addHitRequest, addHitResponse, linkRulesTohit /*, getState */ } from "../state";
import { config } from "./config";

const proxy = httpProxy.createProxy();

proxy.on("proxyRes", function(proxyRes, req, res) {
    const hitId = (<any>req)._hitId;

    let proxyResData = "";
    proxyRes.on("data", function(chunk) {
        proxyResData += chunk;
    });
    proxyRes.on("end", () => {
        addHitResponse(hitId, proxyResData, res);
    });
});

const getRequestLogMessage = (id: number, message: string) => `[Request ${id}] ${message}`;

export const server = http.createServer((req, res) => {
    logger.debug(`matching '${req.url}' ...`);

    const target = config.getProxyRules().match(req);
    if (target) {
        logger.debug(`Matched. Proxying to '${target}'.`);

        const id = addHitRequest(req);
        // Attach identifier
        (<any>req)._hitId = id;

        const getLogMessage = (message: string) => getRequestLogMessage(id, message);

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
                                askUser: (question: string, options: IQuestionOption[]) => {
                                    return new Promise<boolean>((resolve) => {
                                        askUserListeners[id] = resolve;
                                        actionLog(`Asking '${question}'`);
                                        emitter.emit("askUser", { id: id, question: question, options: options });
                                    });
                                },
                                cancelConfirm: () => {
                                    delete askUserListeners[id];
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

        res.on("close", () => {
            logger.debug(getRequestLogMessage(id, "Request was closed by client"));
            // Clean up
            addHitResponse(id, "", res);
            delete askUserListeners[id];
            emitter.emit("cancelAskUser", { id: id });
        });
        startChain();
        return;
    }

    writeError(res, 500, "The request url and path did not match any of the listed rules");
});

emitter.on("userResponse", (response: { id: number, response: any }) => {
    const resolve = askUserListeners[response.id];
    resolve && resolve(response.response);
});

const askUserListeners: { [id: number]: (result: any) => void } = {};

function writeError(res: http.ServerResponse, code: number, content: any) {
    res.setHeader("content-type", "application/json");
    res.writeHead(code);
    res.end(JSON.stringify(typeof(content) === "string" ? { error: true, message: content } : content));
}
