import { Store } from "vuex";
import { actions } from "./actions";
import { getters } from "./getters";
import { mutations } from "./mutations";
import { State } from "./state";

let store: Store<State> | null = null;

export function getStore(): Store<State> {
    if (store === null) {
        store = new Store<State>({
            state: new State(),
            actions: actions,
            getters: getters,
            mutations: mutations,
            strict: true,
        });
    }

    return store;
}
