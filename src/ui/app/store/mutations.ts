import { IRequest } from "requests";
import { State } from "./state";

export const mutations = {
    setRequests: (state: State, requests: IRequest[]) => {
        state.requests = requests;
    },
    addRequest: (state: State, request: IRequest) => {
        state.requests.unshift(request);
    },
};
