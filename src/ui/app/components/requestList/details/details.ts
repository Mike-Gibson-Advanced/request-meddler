
import { IRequest } from "requests";
import { IRule } from "rules";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({
    template: require("./details.html"),
    components: {
    },
})
export class RequestDetailsComponent extends Vue {
    @Prop()
    request: IRequest;

    get appliedRules(): IRule[] | null {
        if (!this.request.appliedRules) {
            return null;
        }

        return this.request.appliedRules
            .map((ruleId) => this.$store.getters.ruleById(ruleId) || {
                id: 0,
                description: "Could not find rule",
                urlPattern: null,
                actionDescription: "",
            });
    }

    currentTab: tabType = "request";

    selectTab(tab: tabType) {
        this.currentTab = tab;
    }

    canDisplayBody(contentType: string | null) {
        const normalised = (contentType || "").toLocaleLowerCase();
        return ["application/json", "text", "text/html"].indexOf(normalised) > -1 ||
            normalised.indexOf("application/json") === 0;
    }
}

type tabType = "request" | "response" | "rules";
