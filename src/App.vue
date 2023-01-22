<template>
  <app-header />
  <app-auth />
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import AppAuth from "./components/AppAuth.vue";
export default {
  components: { AppHeader, AppAuth },
  name: "APP",
};
</script>

<style lang="scss" scoped></style>
