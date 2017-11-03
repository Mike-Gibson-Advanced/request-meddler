import { getStore } from "./store";

// tslint:disable:no-console

let socket: WebSocket;

export const connect = () => {
    if (socket) {
        return;
    }

    const webSocketAddress = `ws://${window.location.host}`;

    console.log(getWebSocketLogMessage(`Connecting to ${webSocketAddress}`));

    socket = new WebSocket(webSocketAddress);

    socket.onopen = () => {
        console.log(getWebSocketLogMessage("Connected"));
    };

    socket.onmessage = (event) => {
        // console.log(getWebSocketLogMessage("Received: "), event);

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
                case "newResponse":
                    store.commit("addResponse", data.payload);
                    break;
                case "appliedRulesChanged":
                    store.commit("setAppliedRules", data.payload);
                    break;
                case "askUser":
                    store.commit("addQuestion", data.payload);
                    break;
                case "cancelAskUser":
                    store.commit("removeQuestion", data.payload.id);
                    break;
                default:
                    console.warn(getWebSocketLogMessage(`Unrecognised type: ${data.type}`));
                    break;
            }
        }
    };
};

export function trySendMessage(type: string, payload: {}) {
    socket.send(JSON.stringify({ type: type, payload: payload }));
}

const getWebSocketLogMessage = (message: string) => `[Web Socket]: ${message}`;
