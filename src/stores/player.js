import helper from "@/includes/helper";
import { Howl } from "howler";
import { defineStore } from "pinia";

export const usePlayerStore = defineStore("player", {
  state: () => ({
    current_song: {},
    sound: {},
    seek: "00:00",
    duration: "00:00",
    playerProgress: "0%",
  }),
  actions: {
    async newSong(song) {
      // prevent multiple audio files play at the same time
      if (this.sound instanceof Howl) {
        this.sound.unload();
      }

      this.current_song = song;

      this.sound = new Howl({
        src: [song.url],
        html5: true,
      });

      this.sound.play();

      this.sound.on("play", () => {
        requestAnimationFrame(this.progress);
      });
    },
    async toggleAudio() {
      if (!this.sound.playing) {
        return;
      }

      if (this.sound.playing()) {
        this.sound.pause();
      } else {
        this.sound.play();
      }
    },
    progress() {
      this.seek = helper.formatTime(this.sound.seek());
      this.duration = helper.formatTime(this.sound.duration());

      this.playerProgress = `${
        (this.sound.seek() / this.sound.duration()) * 100
      }%`;

      if (this.sound.playing()) {
        requestAnimationFrame(this.progress);
      }
    },
    updateSeek(event) {
      // Update status of the player-timeline-progress based on the player progress timeline selected by user
      if (!this.sound.playing) {
        return;
      }

      const { x, width } = event.currentTarget.getBoundingClientRect();
      // Ex: if Document = 2000, Timeline = 1000 --> clientX = 1000, Distance = 500
      const clickX = event.clientX - x;
      const percentage = clickX / width;
      const seconds = this.sound.duration() * percentage;

      this.sound.seek(seconds);
      this.sound.once("seek", this.progress); // pause the audio then change the current timeline then play again
    },
  },
  getters: {
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }

      return false;
    },
  },
});
