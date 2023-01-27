<template>
  <section class="py-24 text-white text-center relative">
    <div
      class="absolute inset-0 w-full h-[87vh] introduction-bg bg-cover"
      style="background-image: url(assets/img/song-header.png)"
    ></div>
    <div class="container mx-auto p-40">
      <div class="text-white main-header-content">
        <h1 class="font-bold text-5xl mb-5">
          {{ $t("about.heading") }} <span class="text-green-400">Vue.js</span>
        </h1>
        <p class="w-full md:w-8/12 mx-auto mb-5">
          {{ $t("about.main-text") }}Vue.js, vite, pinia, vee-validate,
          Firebase, tailwindcss
        </p>
        <small
          >&copy; {{ $t("about.footer") }}
          <a
            target="_blank"
            href="https://www.abdelrahmansoltan.com/"
            class="text-yellow-400"
            >Abdelrahman Soltan</a
          ></small
        >
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "About",
};
</script>
