import { distanceInWordsStrict, format } from "date-fns";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { IRuleWithRequests } from "../requestsByRule";

@Component({
    template: require("./details.html"),
    components: {
    },
})
export class RuleDetailsComponent extends Vue {
    @Prop()
    rule: IRuleWithRequests;

    currentTab: tabType = "list";

    selectTab(tab: tabType) {
        this.currentTab = tab;
    }

    formatDate(date: Date) {
        return format(date, "DD MMM HH:mm:ss.SSS");
    }

    getDuration(requestTime: Date, responseTime: Date) {
        return distanceInWordsStrict(requestTime, responseTime);
    }
}

type tabType = "list" | "timeline";
