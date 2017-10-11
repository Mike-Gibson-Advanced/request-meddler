import Vue from "vue";

import "./sass/main.scss";

new Vue({
    el: "#app-main",
    components: {
        test: {
            template: `
            <div class="alert alert-primary" role="alert">
                Wow
            </div>`,
        },
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
