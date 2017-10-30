import Vue from "vue";
import Component from "vue-class-component";
import * as router from "../../router";

@Component({
    template: require("./navbar.html"),
})
export class NavbarComponent extends Vue {
    get requestsRouteLocation() {
        return router.getRequestsRouteLocation();
    }

    get requestsByRuleRouteLocation() {
        return router.getRequestsByRuleRouteLocation();
    }

    get settingsRouteLocation() {
        return router.getSettingsRouteLocation();
    }
}
