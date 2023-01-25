<template>
  <app-header />
  <router-view />
  <app-auth />
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import { mapWritableState } from "pinia";
import AppAuth from "./components/AppAuth.vue";
import { firebaseApp } from "./includes/firebase";
import { useUserStore } from "./stores/user";
export default {
  components: { AppHeader, AppAuth },
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

<style lang="scss" scoped></style>
