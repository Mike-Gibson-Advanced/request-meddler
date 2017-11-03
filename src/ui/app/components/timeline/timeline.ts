
import { distanceInWordsStrict, format } from "date-fns";
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

    visibleRequests: IRequest[] = [];
    min: Date = new Date();
    max: Date = new Date();

    private intervalId: any;

    formatDate(date: Date) {
        return format(date, "HH:mm:ss.SSS");
    }

    getDuration(requestTime: Date, responseTime: Date) {
        return distanceInWordsStrict(requestTime, responseTime);
    }

    @Watch("allRequests", { deep: true, immediate: true })
    onAllRequestsChanged() {
        this.refreshData();
    }

    async created() {
        try {
            await this.$store.dispatch("loadRequests");
        } catch (error) {
            alert("Error loading requests");
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
                ((r.response && r.response.time) || now) >= this.min;
        });
    }
}
