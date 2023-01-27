<template>
  <main>
    <!-- Main Content -->
    <section class="container mx-auto mt-6">
      <div class="md:grid md:grid-cols-3 md:gap-4">
        <div class="col-span-1">
          <app-upload
            @addSong="addSong"
            @updateUnsavedFlag="updateUnsavedFlag"
          />
        </div>

        <div class="col-span-2">
          <div
            class="bg-white rounded border border-gray-200 relative flex flex-col"
          >
            <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
              <span class="card-title">{{ $t("manage.my_songs") }}</span>
              <i
                class="fa fa-compact-disc float-right text-green-400 text-2xl"
              ></i>
            </div>
            <!-- Loading State -->
            <div class="p-6 flex justify-center" v-if="isLoadingSongs">
              <i class="fas fa-spinner fa-spin text-5xl text-gray-500"></i>
            </div>
            <div class="p-6" v-if="!isLoadingSongs && songs.length > 0">
              <!-- Composition Items -->
              <composition-item
                v-for="(song, i) in songs"
                :key="song.docID"
                :song="song"
                :updateSong="updateSong"
                :index="i"
                :removeSong="removeSong"
                @updateUnsavedFlag="updateUnsavedFlag"
              />
            </div>
            <div
              class="p-6 text-gray-500"
              v-if="!isLoadingSongs && songs.length === 0"
            >
              Currently, You Don't have any songs
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import CompositionItem from "../components/CompositionItem.vue";
import AppUpload from "../components/Upload.vue";
import { firebaseApp, songsCollection } from "../includes/firebase";
export default {
  components: { AppUpload, CompositionItem },
  name: "Manage",
  data() {
    return {
      songs: [],
      unsavedFlag: false,
      isLoadingSongs: false,
    };
  },
  async created() {
    // Querying the Database
    this.isLoadingSongs = true;
    const snapshot = await songsCollection
      .where("uid", "==", firebaseApp.auth().currentUser.uid)
      .get();

    snapshot.forEach(this.addSong);
    this.isLoadingSongs = false;
  },
  methods: {
    updateSong(songIndex, values) {
      this.songs[songIndex].modified_name = values.modified_name;
      this.songs[songIndex].genre = values.genre;
    },
    removeSong(i) {
      this.songs.splice(i, 1);
    },
    addSong(songDocument) {
      const song = {
        ...songDocument.data(),
        docID: songDocument.id,
      };

      this.songs.push(song);
    },
    updateUnsavedFlag(value) {
      console.log(value);
      this.unsavedFlag = value;
    },
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next();
    } else {
      // eslint-disable-next-line no-alert, no-restricted-globals
      const leave = confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      next(leave);
    }
  },
};
</script>
