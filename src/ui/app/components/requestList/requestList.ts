
import { distanceInWordsStrict, format } from "date-fns";
import { IRequest } from "requests";
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { RequestDetailsComponent } from "./details";

@Component({
    template: require("./requestList.html"),
    components: {
        "request-details": RequestDetailsComponent,
    },
})
export class RequestListComponent extends Vue {
    get requests(): IRequest[] {
        return this.$store.getters.requests;
    }

    get selectedRequest(): IRequest | null {
        if (this.selectedRequestId === null) {
            return null;
        }

        return this.requests.find((request) => request.id === this.selectedRequestId) || null;
    }

    selectedRequestId: number | null = null;

    formatDate(date: Date) {
        return format(date, "DD MMM HH:mm:ss.SSS");
    }

    getDuration(requestTime: Date, responseTime: Date) {
        return distanceInWordsStrict(requestTime, responseTime);
    }

    select(request: IRequest | null) {
        this.selectedRequestId = request === null ? null : request.id;
        const query = request === null ? undefined : { selected: request.id.toString() };
        this.$router.push({ name: "requests", query: query });
    }

    async created() {
        try {
            await this.$store.dispatch("loadRequests");
            const selectedId = this.$route.query.selected;
            if (selectedId) {
                this.selectedRequestId = parseInt(selectedId, 0);
            }
        } catch (error) {
            alert("Error loading requests");
        }

        try {
            await this.$store.dispatch("loadRules");
        } catch (error) {
            alert("Error loading rules");
        }
    }
}
