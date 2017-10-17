
import { IRequest } from "requests";
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
}
