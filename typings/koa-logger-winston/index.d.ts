declare module "koa-logger-winston" {
    import * as Winston from "winston";
    import * as koa from "koa";

    function logger(logger: Winston.LoggerInstance): koa.Middleware;
    namespace logger { }

    export = logger;
}
