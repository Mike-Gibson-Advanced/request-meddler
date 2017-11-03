import axios from "axios";
import { ActionContext } from "vuex";
import * as webSocket from "../webSocket";
import { State } from "./state";

export const actions = {
    loadRequests: async (store: ActionContext<State, State>) => {
        const result = await axios.get("api/requests");
        const requests = result.data;
        store.commit("setRequests", requests);
    },
    loadRules: async (store: ActionContext<State, State>) => {
        const result = await axios.get("api/rules");
        const rules = result.data;
        store.commit("setRules", rules);
    },
    respondToQuestion: (
        store: ActionContext<State, State>,
        payload: { questionId: number, result: any }) => {
            const question = store.state.questions.find((q) => q.id === payload.questionId);
            if (!question) {
                return;
            }

            webSocket.trySendMessage("userResponse", { id: payload.questionId, response: payload.result });
            store.commit("removeQuestion", payload.questionId);
        },
};
