<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">{{ $t("manage.upload") }}</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dragover = false"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>{{ $t("manage.drop_file") }}</h5>
      </div>
      <input
        type="file"
        class="mt-3 file:py-1 file:px-1.5 file:rounded file:text-white file:bg-green-600 file:border-0 cursor-pointer file:cursor-pointer"
        title="Choose a video please"
        multiple
        @change="upload($event)"
      />

      <hr class="my-6" />
      <!-- Progress Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.text_class">
          <i :class="[upload.icon, 'mr-1']"></i>
          {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: upload.current_progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { firebaseApp, songsCollection, storage } from "../includes/firebase";
export default {
  name: "Upload",
  emits: ["add-song", "update-unsaved-flag"],
  data() {
    return {
      is_dragover: false,
      uploads: [],
    };
  },
  methods: {
    upload($event) {
      this.$emit("update-unsaved-flag", true);

      this.is_dragover = false;

      const files = $event.dataTransfer
        ? [...$event.dataTransfer.files]
        : [...$event.target.files]; // specify it's from input-upload or drag&drop-upload, then convert it to an Array to loop on it

      files.forEach((file) => {
        const supportedFormats = ["audio/mpeg", "audio/webm"];
        if (!supportedFormats.includes(file.type)) {
          return;
        }
        // prevent uploading when user is offline (PWA)
        if (!navigator.onLine) {
          this.uploads.push({
            task: {},
            current_progress: 100,
            name: file.name,
            variant: "bg-red-400",
            icon: "fas fa-times",
            text_class: "text-red-400",
          });
          return;
        }

        // References (objects that point to a location in the app)
        const storageRef = storage.ref(); // "music-app-374e3.appspot.com", -> bucket where data is stored
        const songsRef = storageRef.child(`songs/${file.name}`); // music-app-374e3.appspot.com/songs/example.mp3
        const task = songsRef.put(file); // initialize the uploading process

        const uploadIndex =
          this.uploads.push({
            task,
            current_progress: 0,
            name: file.name,
            variant: "bg-blue-400", // progress bar color
            icon: "fas fa-spinner fa-spin",
            text_class: "",
          }) - 1;

        // track upload progress
        task.on(
          "state_changed",
          (snapshot) => {
            // Snapshot -> object that is a copy of a location in the app (Read-only & Immutable)
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.uploads[uploadIndex].current_progress = progress; // update the progress for the progress bar styles
          },
          (error) => {
            // error callback
            this.$emit("update-unsaved-flag", false);
            this.uploads[uploadIndex].variant = "bg-red-400";
            this.uploads[uploadIndex].icon = "fas fa-times";
            this.uploads[uploadIndex].text_class = "text-red-400";
            console.log(error);
          },
          async () => {
            console.log(task.snapshot);
            // success callback
            const song = {
              // "snapshot" object hold reference to the current state of the upload
              uid: firebaseApp.auth().currentUser.uid,
              display_name: firebaseApp.auth().currentUser.displayName,
              original_name: task.snapshot.ref.name,
              modified_name: task.snapshot.ref.name,
              genre: "",
              comment_count: 0,
            };

            song.url = await task.snapshot.ref.getDownloadURL();
            const songRef = await songsCollection.add(song); // create random ID for the song in the songs collection
            const songSnapshot = await songRef.get();

            this.$emit("add-song", songSnapshot);
            this.$emit("update-unsaved-flag", false);

            this.uploads[uploadIndex].variant = "bg-green-400";
            this.uploads[uploadIndex].icon = "fas fa-check";
            this.uploads[uploadIndex].text_class = "text-green-400";
          }
        );
      });
    },
  },
  beforeUnmount() {
    // cancel ongoing tasks when going to another tab/route/component
    this.uploads.forEach((upload) => {
      upload.task.cancel();
    });
  },
};
</script>
