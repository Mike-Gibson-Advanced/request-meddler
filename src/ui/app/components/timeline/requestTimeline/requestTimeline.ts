import * as d3 from "d3";
import { IRequest } from "requests";
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";

import "./requestTimeline.scss";

@Component({
    template: require("./requestTimeline.html"),
})
export class RequestTimelineComponent extends Vue {
    @Prop()
    request: IRequest;

    @Prop()
    min: Date;

    @Prop()
    max: Date;

    private redraw: () => void;

    private get chartData() {
        return {
            request: this.request,
            min: this.min,
            max: this.max,
        };
    }

    mounted() {
        const svg = d3.select(this.$el);
        const svgWidth = this.$el.getBoundingClientRect().width;
        const svgHeight = this.$el.getBoundingClientRect().height;

        const margin = { top: 2, right: 2, bottom: 2, left: 2 };
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;

        const x = d3.scaleTime().range([0, width]);

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        const chart = svg.append("g")
            .attr("class", "chart")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const chartArea = chart.append("g")
            .attr("clip-path", "url(#clip)");

        const rect = chartArea
            .append("rect");

        const getClass = (request: IRequest) =>
            `request ${request.response
                ? (request.response.statusCode >= 400 ? "error" : "")
                : "in-flight"}`;

        this.redraw = () => {
            x.domain([this.min, this.max]);
            rect
                .attr("x", x(this.request.request.time))
                .attr("y", 0)
                .attr("width", x((this.request.response &&
                    this.request.response.time) || this.max) - x(this.request.request.time))
                .attr("height", height)
                .attr("class", getClass(this.request));
        };

        this.redraw();
    }

    @Watch("chartData", { deep: true })
    onChartDataChanged() {
        this.redraw();
    }
}
