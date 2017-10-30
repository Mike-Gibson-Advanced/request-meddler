import { IAppliedRulesChanged, IRequest, IResponseDetails } from "requests";
import { IRule } from "rules";
import Vue from "vue";
import { State } from "./state";

export const mutations = {
    setRequests: (state: State, requests: IRequest[]) => {
        state.requests = requests;
    },
    addRequest: (state: State, request: IRequest) => {
        state.requests.unshift(request);
    },
    addResponse: (state: State, response: IResponseDetails) => {
        const request = state.requests.find((r) => r.id === response.id);

        if (!request) {
            return;
        }

        Vue.set(request, "response", response.response);
        Vue.set(request, "appliedRules", response.appliedRules);
    },
    setAppliedRules: (state: State, changes: IAppliedRulesChanged) => {
        const request = state.requests.find((r) => r.id === changes.id);

        if (!request) {
            return;
        }

        Vue.set(request, "appliedRules", changes.appliedRules);
    },
    setRules: (state: State, rules: IRule[]) => {
        state.rules = rules;
    },
};
