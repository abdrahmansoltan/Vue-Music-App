import { createPinia } from "pinia";
import { createApp } from "vue";
import veeValidatePlugin from "./includes/validation";

import App from "./App.vue";
import router from "./router";

import "./assets/base.css";
import "./assets/main.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(veeValidatePlugin);

app.mount("#app");
