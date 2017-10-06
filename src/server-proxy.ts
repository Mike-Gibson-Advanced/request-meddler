import * as http from "http";
import * as httpProxy from "http-proxy";
import * as HttpProxyRules from "http-proxy-rules";
import { proxyLogger as logger } from "./logger";

const proxyRules = new HttpProxyRules({
    rules: {
        // '.*/api/': 'http://127.0.0.1:8888/api',
    },
    default: "http://127.0.0.1:8889",
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

export const server = http.createServer((req, res) => {
    logger.info(`matching '${req.url}' ...`);

    const target = proxyRules.match(req);
    if (target) {
        logger.info(`matched. Proxying to '${target}'.`);
        proxy.web(req, res, {
            target: target,
        }, (e) => {
            const error = `Error proxying request to ${target}: ${e.message}`;
            logger.error(error);

            res.writeHead(500, { "content-type": "application/json" });
            res.statusCode = 500;

            res.end(JSON.stringify({
                error: true,
                message: error,
            }));
        });
        return;
    }

    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({
        message: "REVERSE PROXY: The request url and path did not match any of the listed rules!"
    }));
});
