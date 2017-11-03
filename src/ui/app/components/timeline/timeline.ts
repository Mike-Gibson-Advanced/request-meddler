
import { IRequest } from "requests";
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { RequestTimelineComponent } from "./requestTimeline";

@Component({
    template: require("./timeline.html"),
    components: {
        "request-timeline": RequestTimelineComponent,
    },
})
export class TimelineComponent extends Vue {
    get allRequests(): IRequest[] {
        return this.$store.getters.requests;
    }

    get thresholdInSeconds() {
        return 30;
    }

    get filterText() {
        return `${this.customRegex ? `Requests with URL matching '${this.regex}'` : "All requests" } ` +
            `in the last ${this.thresholdInSeconds} seconds`;
    }

    get customRegex(): RegExp | null {
        if (!this.regex) {
            return null;
        }

        try {
            return new RegExp(this.regex);
        } catch (error) {
            return null;
        }
    }

    showFilter: boolean = false;
    regex: string = "";
    regexError: boolean = false;

    visibleRequests: IRequest[] = [];
    min: Date = new Date();
    max: Date = new Date();

    private intervalId: any;

    @Watch("allRequests", { deep: true, immediate: true })
    onAllRequestsChanged() {
        this.refreshData();
    }

    regexChanged(newValue: string) {
        this.regex = newValue;
        try {
            new RegExp(newValue);
            this.regexError = false;
            this.refreshData();
        } catch (error) {
            this.regexError = true;
        }
    }

    async created() {
        try {
            await this.$store.dispatch("loadRequests");
        } catch (error) {
            alert("Error loading requests");
        }

        try {
            await this.$store.dispatch("loadRules");
        } catch (error) {
            alert("Error loading rules");
        }

        this.intervalId = setInterval(() => {
            this.refreshData();
        }, 50);
    }

    async destroyed() {
        clearInterval(this.intervalId);
    }

    private refreshData() {
        const now = new Date();
        this.min = new Date(now.getTime() - this.thresholdInSeconds * 1000);
        this.max = new Date(now.getTime());
        this.visibleRequests = this.allRequests.filter((r) => {
            return r.request.time <= this.max &&
                ((r.response && r.response.time) || now) >= this.min &&
                (this.customRegex || new RegExp(".*")).test(r.url);
        });
    }
}
