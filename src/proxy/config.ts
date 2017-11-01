import * as HttpProxyRules from "http-proxy-rules";

class Config {
    private proxyRules = new HttpProxyRules({ rules: [] });

    getProxyRules(): HttpProxyRules {
        if (!this.proxyRules.default) {
            throw new Error("Must call setProxyAddress first");
        }

        return this.proxyRules;
    }

    setProxyAddress(address: string) {
        this.proxyRules.default = address;
    }
}

export const config = new Config();
