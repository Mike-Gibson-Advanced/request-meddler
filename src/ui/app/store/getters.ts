import { State } from "./state";

export const getters = {
    requests: (state: State) => state.requests,
    ruleById: (state: State) => (ruleId: number) => state.rules.find((rule) => rule.id === ruleId) || null,
};
