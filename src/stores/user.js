import { defineStore } from "pinia";
import { firebaseApp, usersCollection } from "../includes/firebase";

export const useUserStore = defineStore("user", {
  state: () => ({
    userLoggedIn: false,
  }),
  actions: {
    async register(values) {
      /* ------------Auth------------ */
      let userCredential = await firebaseApp
        .auth()
        .createUserWithEmailAndPassword(values.email, values.password);
      /* ------------Database------------ */
      await usersCollection.doc(userCredential.user.uid).set({
        name: values.name,
        email: values.email,
        age: values.age,
        country: values.country,
      });
      // storing display name for user
      await userCredential.user.updateProfile({
        displayName: values.name,
      });

      this.userLoggedIn = true;
    },
    async authenticate(values) {
      /* ------------Auth------------ */
      await firebaseApp
        .auth()
        .signInWithEmailAndPassword(values.email, values.password);

      this.userLoggedIn = true;
    },
    async signOut() {
      await firebaseApp.auth().signOut();

      this.userLoggedIn = false;
    },
  },
});
