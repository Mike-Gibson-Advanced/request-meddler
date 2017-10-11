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
