import { createPinia } from "pinia";
import { registerSW } from "virtual:pwa-register";
import { createApp } from "vue";
import { firebaseApp } from "./includes/firebase";
import i18n from "./includes/i18n";
import veeValidatePlugin from "./includes/validation";

import App from "./App.vue";
import Icon from "./directives/icon";
import router from "./router";

import "./assets/base.css";
import "./assets/main.css";

// Load and Register the PWA Service Worker
registerSW({ immediate: true });

let app;
// initialize the app after firebase use cached data if any to authenticate
firebaseApp.auth().onAuthStateChanged(() => {
  // check if app is already initialized
  if (!app) {
    app = createApp(App);

    app.use(createPinia());
    app.use(router);
    app.use(veeValidatePlugin);
    app.use(i18n);
    app.directive("icon", Icon);

    app.mount("#app");
  }
});
