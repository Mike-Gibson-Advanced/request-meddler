import { IRequest, IResponseDetails } from "requests";
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
        const shift = state.requests.find((request) => request.id === response.id);

        if (!shift) {
            return;
        }

        Vue.set(shift, "response", response.response);
        Vue.set(shift, "appliedRules", response.appliedRules);
    },
};
