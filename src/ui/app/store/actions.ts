import axios from "axios";
import { ActionContext } from "vuex";
import { State } from "./state";

export const actions = {
    loadRequests: async (store: ActionContext<State, State>) => {
        const result = await axios.get("api/requests");
        const requests = result.data;
        store.commit("setRequests", requests);
    },
};
