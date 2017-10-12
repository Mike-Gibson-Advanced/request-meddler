import Vue from "vue";
import Vuex from "vuex";
import { getStore } from "./store";

import { RequestListComponent } from "./components/requestList";

import "./sass/main.scss";

Vue.use(Vuex);

new Vue({
    store: getStore(),
    el: "#app-main",
    components: {
        "request-list": RequestListComponent,
    },
});

// Web socket stuff...

// tslint:disable:no-console

const getWebSocketLogMessage = (message: string) => `[Web Socket]: ${message}`;

const webSocketAddress = `ws://${window.location.host}`;

console.log(getWebSocketLogMessage(`Connecting to ${webSocketAddress}`));

const socket = new WebSocket(webSocketAddress);

socket.onopen = () => {
    console.log(getWebSocketLogMessage("Connected"));
};

socket.onmessage = (event) => {
    console.log(getWebSocketLogMessage("Received: "), event);

    let data: any;
    try {
        data = JSON.parse(event.data);
    } catch (error) {
        console.error(getWebSocketLogMessage(`Could not parse web socket message event data: ${error}`));
        return;
    }

    if (data && data.type) {
        const store = getStore();

        switch (data.type) {
            case "newRequest":
                store.commit("addRequest", data.payload);
                break;
            default:
                console.warn(getWebSocketLogMessage(`Unrecognised type: ${data.type}`));
                break;
        }
    }
};
