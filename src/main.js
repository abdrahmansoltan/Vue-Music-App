import { createPinia } from "pinia";
import { createApp } from "vue";
import { firebaseApp } from "./includes/firebase";
import veeValidatePlugin from "./includes/validation";

import App from "./App.vue";
import Icon from "./directives/icon";
import router from "./router";

import "./assets/base.css";
import "./assets/main.css";

let app;
// initialize the app after firebase use cached data if any to authenticate
firebaseApp.auth().onAuthStateChanged(() => {
  // check if app is already initialized
  if (!app) {
    app = createApp(App);

    app.use(createPinia());
    app.use(router);
    app.use(veeValidatePlugin);
    app.directive("icon", Icon);

    app.mount("#app");
  }
});
