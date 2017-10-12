
import { IRequest } from "requests";
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({
    template: require("./requestList.html"),
    components: {
    },
})
export class RequestListComponent extends Vue {
    get requests(): IRequest[] {
        return this.$store.getters.requests;
    }

    async created() {
        try {
            await this.$store.dispatch("loadRequests");
        } catch (error) {
            alert("Error loading requests");
        }
    }
}
