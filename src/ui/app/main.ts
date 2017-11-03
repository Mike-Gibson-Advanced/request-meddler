import Vue from "vue";
import Vuex from "vuex";
import { createRouter } from "./router";
import { getStore } from "./store";
import * as webSocket from "./webSocket";

import { NavbarComponent } from "./components/navbar";
import { QuestionListComponent } from "./components/questionList";

import "./sass/main.scss";

Vue.use(Vuex);

new Vue({
    store: getStore(),
    router: createRouter(),
    el: "#app-main",
    components: {
        navbar: NavbarComponent,
        questions: QuestionListComponent,
    },
    computed: {
        questions() {
            return this.$store.state.questions;
        },
    },
});

webSocket.connect();
