<template>
  <app-header />

  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"></component>
    </transition>
  </router-view>

  <app-player />
  <app-auth />
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import AppPlayer from "@/components/Player.vue";
import { mapWritableState } from "pinia";
import AppAuth from "./components/AppAuth.vue";
import { firebaseApp } from "./includes/firebase";
import { useUserStore } from "./stores/user";
export default {
  components: { AppHeader, AppAuth, AppPlayer },
  name: "APP",
  computed: {
    ...mapWritableState(useUserStore, ["userLoggedIn"]),
  },
  created() {
    // Persisting the uer authentication from cached (in IndexedDB in LocalStorage) userData if any
    if (firebaseApp.auth().currentUser) {
      this.userLoggedIn = true;
    }
  },
};
</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.5s linear;
}

.fade-leave-to {
  transition: all 0s linear;
  opacity: 0;
}
</style>
