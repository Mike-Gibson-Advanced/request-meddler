import * as http from "http";
import * as httpProxy from "http-proxy";
import * as HttpProxyRules from "http-proxy-rules";
import { proxyLogger as logger } from "../logger";
import { config as rulesConfig } from "../rules";
import { addHitRequest, addHitResponse, linkRulesTohit /*, getState */ } from "../state";

const proxyRules = new HttpProxyRules({
    rules: {
        // '.*/api/': 'http://127.0.0.1:8888/api',
    },
    default: "http://127.0.0.1:8889",
    // default: "http://localhost:7000/api/temp",
});

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
proxy.on("proxyRes", function(proxyRes, req, _res) {
    // collect response data
    let proxyResData = "";
    proxyRes.on("data", function(chunk) {
        proxyResData += chunk;
    });
    proxyRes.on("end", () => {
        const hitId: number = (<any>req)._hitId;
        addHitResponse(hitId, proxyResData);

        // logger.info(JSON.stringify(getState()));
    });
});

export const server = http.createServer((req, res) => {
    logger.debug(`matching '${req.url}' ...`);

    const target = proxyRules.match(req);
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
                writeError(res, error);
            });
        };

        const startChain = rules.reverse().reduce((accumulator, current) => {
            return () => {
                const processingContext = {
                    log: (message: string) => logger.debug(getLogMessage(`[Rule '${current.description}'] ${message}`)),
                };
                processingContext.log(`Running action '${current.action.description}'`);
                current.action.process(accumulator, processingContext);
            };
        }, next);

        startChain();
        return;
    }

    writeError(res, "The request url and path did not match any of the listed rules");
});

function writeError(res: http.ServerResponse, message: string) {
    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({
        error: true,
        message: message,
    }));
}