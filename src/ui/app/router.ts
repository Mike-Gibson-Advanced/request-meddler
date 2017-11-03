import Vue from "vue";
import VueRouter, { Location } from "vue-router";

import { RequestListComponent } from "./components/requestList";
import { RequestsByRuleComponent } from "./components/requestsByRule";
import { TimelineComponent } from "./components/timeline";

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
                name: "timeline",
                path: "/timeline",
                component: TimelineComponent,
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

export function getTimelineRouteLocation(): Location {
    return {
        name: "timeline",
    };
}
