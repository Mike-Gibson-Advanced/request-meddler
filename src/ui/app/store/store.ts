import { Store } from "vuex";
import { actions } from "./actions";
import { getters } from "./getters";
import { mutations } from "./mutations";
import { State } from "./state";

export function createStore(): Store<State> {
    return new Store<State>({
        state: new State(),
        actions: actions,
        getters: getters,
        mutations: mutations,
        strict: true,
    });
}
