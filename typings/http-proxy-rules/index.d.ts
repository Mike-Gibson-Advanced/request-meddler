declare module "http-proxy-rules" {
    namespace HttpProxyRules {
    }

    class HttpProxyRules {
        constructor(args: any);
        match(req: any): string | undefined | null;
        default: string;
    }

    export = HttpProxyRules;
}
