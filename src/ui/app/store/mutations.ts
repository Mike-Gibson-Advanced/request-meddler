import { IRequest } from "requests";
import { State } from "./state";

export const mutations = {
    setRequests: (state: State, requests: IRequest[]) => {
        state.requests = requests;
    },
};
