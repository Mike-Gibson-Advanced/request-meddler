import Vue from "vue";
import VueRouter, { Location } from "vue-router";

import { RequestListComponent } from "./components/requestList";
import { RequestsByRuleComponent } from "./components/requestsByRule";

Vue.use(VueRouter);

export function createRouter() {
    return new VueRouter({
        routes: [
            {
                path: "/",
                redirect: getRequestsRouteLocation(),
            },
            {
                name: "requests",
                path: "/requests",
                component: RequestListComponent,
            },
            {
                name: "requestsByRule",
                path: "/requestsByRule",
                component: RequestsByRuleComponent,
            },
            {
                path: "/settings",
                component: { template: "<router-view></router-view>" },
                children: [
                    {
                        name: "settings.home",
                        path: "",
                        component: { template: `<p>Todo <br/> <a href="#settings/proxy">Proxy</a></p>` },
                    },
                    {
                        name: "settings.proxy",
                        path: "proxy",
                        component: { template: "<p>Todo</p>" },
                    },
                ],
            },
        ],
    });
}

export function getRequestsRouteLocation(): Location {
    return {
        name: "requests",
    };
}

export function getRequestsByRuleRouteLocation(): Location {
    return {
        name: "requestsByRule",
    };
}

export function getSettingsRouteLocation(): Location {
    return {
        name: "settings.home",
    };
}
