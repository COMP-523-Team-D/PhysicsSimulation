// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";
 
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1gu3Z0AhuGUQXFMOl9C69-V-eCcwD3hI",
  //authDomain: "unc-physics-simulation.firebaseapp.com",
  //databaseURL: "https://unc-physics-simulation-default-rtdb.firebaseio.com",
  projectId: "unc-physics-simulation",
  //storageBucket: "unc-physics-simulation.appspot.com",
  //messagingSenderId: "188932414514",
  //appId: "1:188932414514:web:c7df0cb566929883fc302b",
  //measurementId: "G-Z97JLPVR8C"
};

class Firebase {

  constructor() {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    //firebase.analytics();

    /*
     * Firebase Authentication
     * & Firebase Firestore
     */
    this.auth = firebase.auth();
    this.auth.useEmulator("http://localhost:9099"); // Initialize to use the emulators

    this.db = firebase.firestore();
    this.db.useEmulator("localhost", 8080); // Initialize to use the emulators
  }

  /* AUTHORIZATION API */
  doCreateUserWithEmailAndPassword = (email, password) => 
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () =>
    this.auth.signOut();

  /*
   *  Not implemented
   *
  doPasswordReset = email =>
    this.auth.sendPasswordResetEmail(email);
 
  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);
  */

  /* FIRESTORE API */
  user = uid => this.db.collection("Users").doc(uid);

  instructors = () => this.db.collection("Users").where("isInstructor", "==", true);

  courses = () => this.db.collection("Courses");

  doCreateNewUserDocument = (uid, firstName, lastName, instructors, courses) =>
    this.db.collection("Users").doc(uid).set({
      "Created": firebase.firestore.Timestamp.now(),
      "First Name": firstName,
      "Last Name": lastName,
      isInstructor: false,
      Instructors: instructors,
      Courses: courses
    });

  getAuthorizedUserData = uid => 
    this.db.collection("Users").doc(uid).get();
  
}
 
export default Firebase;
