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

  /////////////////////////////////////////////////////////
  // User Collection API
  /////////////////////////////////////////////////////////

  // Returns a reference to the user document specified by uid
  user = uid => this.db.collection("Users").doc(uid);

  // Returns a reference to all documents associated with instructors
  instructors = () => this.db.collection("Users").where("isInstructor", "==", true);

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

  /////////////////////////////////////////////////////////
  // Course Collection API
  /////////////////////////////////////////////////////////

  // Return a reference to the course specified by courseName
  // Implicitly assumes that there will never be two courses with the same name
  course = courseName =>
    this.db.collection("Courses").where("Name", "==", courseName);

  // Return a reference to the courses collection
  courses = () =>
    this.db.collection("Courses");

  // Create a new assignment for a course
  createAssignment() {};

  /////////////////////////////////////////////////////////
  // Simulation Collection API
  /////////////////////////////////////////////////////////

  // Returns a reference to the simulation specified by simulationName
  // Implicitly assumes that there will never be two simulations with the same name
  simulation = simulationName =>
    this.db.collection("Simulations").where("Name", "==", simulationName);

  // Returns a reference to the simulations collection
  simulations = () =>
    this.db.collection("Simulations");

  /////////////////////////////////////////////////////////
  // Grades Collection API
  /////////////////////////////////////////////////////////

  /*

  this.db.collection("").where("", "==", ).get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // Todo
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });

  */

  
  
}
 
export default Firebase;
