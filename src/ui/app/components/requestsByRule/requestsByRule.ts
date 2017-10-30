
import { IRequest } from "requests";
import { IRule } from "rules";
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { RuleDetailsComponent } from "./details";

export interface IRuleWithRequests extends IRule {
    requests: IRequest;
}

@Component({
    template: require("./requestsByRule.html"),
    components: {
        "rule-details": RuleDetailsComponent,
    },
})
export class RequestsByRuleComponent extends Vue {
    get rules(): IRuleWithRequests[] {
        return this.$store.getters.rules.map((rule: IRule) => ({
            ...rule,
            requests: this.$store.getters.requests
                .filter((request: IRequest) => request.appliedRules && request.appliedRules.indexOf(rule.id) > -1)
                .sort((a: IRequest, b: IRequest) => b.id - a.id),
        }));
    }

    get selectedRule(): IRuleWithRequests | null {
        if (this.selectedRuleId === null) {
            return null;
        }

        return this.rules.find((rule) => rule.id === this.selectedRuleId) || null;
    }

    selectedRuleId: number | null = null;

    select(rule: IRuleWithRequests | null) {
        this.selectedRuleId = rule === null ? null : rule.id;
        const query = rule === null ? undefined : { selected: rule.id.toString() };
        this.$router.push({ name: "requestsByRule", query: query });
    }

    async created() {
        try {
            await this.$store.dispatch("loadRules");
            const selectedId = this.$route.query.selected;
            if (selectedId) {
                this.selectedRuleId = parseInt(selectedId, 0);
            }
        } catch (error) {
            alert("Error loading rules");
        }

        try {
            await this.$store.dispatch("loadRequests");
        } catch (error) {
            alert("Error loading requests");
        }
    }
}
