import Vue from "vue";
import Vuex from "vuex";
import { createStore } from "./store";

import { RequestListComponent } from "./components/requestList";

import "./sass/main.scss";

Vue.use(Vuex);

new Vue({
    store: createStore(),
    el: "#app-main",
    components: {
        "request-list": RequestListComponent,
    },
});

// TODO: use browser address
const socket = new WebSocket("ws://localhost:7000/");

socket.onopen = function() {
    // tslint:disable-next-line:no-console
    console.log("CONNECTED!");
    socket.send({ type: "message", payload: { message: "My message!" } });
};
socket.onmessage = function(event) {
    // tslint:disable-next-line:no-console
    console.log("RECEIVED: " + event.data);
};
