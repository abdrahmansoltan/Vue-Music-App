import firebase from "firebase/app";
import "firebase/auth"; // auth module
import "firebase/firestore"; // db package to store data in firestore-database
import "firebase/storage";

const firebaseConfig = {
  apiKey: `${import.meta.env.VITE_FIREBASE_KEY}`, // it's how we connect to firebase
  authDomain: "music-app-374e3.firebaseapp.com", // URL to send the auth information
  projectId: "music-app-374e3",
  storageBucket: "music-app-374e3.appspot.com", // bucket where data is stored
  appId: "1:273773730292:web:c9cdefe931e3c8cec6c1a1",
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Services
const db = firebaseApp.firestore();
const storage = firebase.storage();

// cache copy of the firebase-database in the browser for offline PWA use
db.enablePersistence().catch((error) => {
  console.log(`Firebase persistence error ${error.code}`);
});

// Bucket: physical location where data is stored
// Collection: objects in firestore (data you store in DB (User, Songs, etc..))
// Documents: objects in DB
const usersCollection = db.collection("users");
const songsCollection = db.collection("songs");
const commentsCollection = db.collection("comments");

export {
  firebaseApp,
  db,
  usersCollection,
  songsCollection,
  commentsCollection,
  storage,
};
