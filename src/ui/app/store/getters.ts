import { State } from "./state";

export const getters = {
    requests: (state: State) => state.requests,
    requestById: (state: State) => (requestId: number) => state.requests.find((r) => r.id === requestId) || null,
    rules: (state: State) => state.rules,
    ruleById: (state: State) => (ruleId: number) => state.rules.find((rule) => rule.id === ruleId) || null,
    questions: (state: State) => state.questions,
};
