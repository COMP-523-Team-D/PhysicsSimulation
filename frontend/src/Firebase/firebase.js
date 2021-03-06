/**
 * This module contains the logic for connecting the application
 * to Firebase services. All other application components communicate
 * with Firebase through this module.
 * 
 * Date: 05/12/2021
 * @author Ross Rucho
 */

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

    /*
     * Firebase Authentication
     * & Firebase Firestore
     */
    this.auth = firebase.auth();

    this.db = firebase.firestore();
  }

  /* AUTHORIZATION API */

  // Communicates with Firebase to create a new user
  // with the given email and password.
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  // Communicates with Firebase to sign-in as the user
  // associated with the given email and password.
  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  // Communicates with Firebase to sign-out the current user.
  doSignOut = () => this.auth.signOut();

  /* FIRESTORE API */

  /////////////////////////////////////////////////////////
  // Extra
  /////////////////////////////////////////////////////////

  // Returns a timestamp from the firebase server
  getTimestamp = () => firebase.firestore.Timestamp.now();

  // Converts a Firebase timestamp object to a date
  getDate = (timestamp) => timestamp.toDate();

  /////////////////////////////////////////////////////////
  // User Collection API
  /////////////////////////////////////////////////////////

  // Returns a reference to the user document specified by uid
  user = (uid) => this.db.collection("Users").doc(uid);

  // Returns a reference to all documents associated with instructors
  instructors = () =>
    this.db.collection("Users").where("isInstructor", "==", true);

  // Communicates with Firebase to create a new document in the users collection
  doCreateNewUserDocument = (uid) => this.db.collection("Users").doc(uid);

  // Communicates with Firebase to retrieve the user document specified by the
  // given user ID
  getAuthorizedUserData = (uid) => this.db.collection("Users").doc(uid).get();

  /////////////////////////////////////////////////////////
  // Course Collection API
  /////////////////////////////////////////////////////////

  // Return a reference to the course specified by courseName
  // Implicitly assumes that there will never be two courses with the same name
  course = (courseName) =>
    this.db.collection("Courses").where("Name", "==", courseName);

  // Return a reference to the courses collection
  courses = () => this.db.collection("Courses");

  /////////////////////////////////////////////////////////
  // Assignment Collection API
  /////////////////////////////////////////////////////////

  // Return a reference to the assignment specified by assignmentName
  assignment = (assignmentName) =>
    this.db.collection("Assignments").where("Name", "==", assignmentName);

  // Return a reference to all the assignments associated with a course
  // specified by course name
  // Implicitly assumes that there will never be two courses with the same name
  assignments = (courseName) =>
    this.db.collection("Assignments").where("Course Name", "==", courseName);

  // Create a new assignment for a course
  doCreateNewAssignment = () => this.db.collection("Assignments").doc();

  /////////////////////////////////////////////////////////
  // Simulation Collection API
  /////////////////////////////////////////////////////////

  // Returns a reference to the simulation specified by simulationName
  // Implicitly assumes that there will never be two simulations with the same name
  simulation = (simulationName) =>
    this.db.collection("Simulations").where("Name", "==", simulationName);

  // Returns a reference to the simulations collection
  simulations = () => this.db.collection("Simulations");

  /////////////////////////////////////////////////////////
  // Submissions Collection API
  /////////////////////////////////////////////////////////

  // Create a new submission for a problem
  doCreateNewSubmission = () => this.db.collection("Submissions").doc();

  // Returns a reference to all the submissions for an assignment
  // associated with an assignment name
  // Implicitly assumes that there will never be two courses with the same name
  allSubmissions = (courseName, assignmentName) =>
    this.db
      .collection("Submissions")
      .where("Assignment Name", "==", assignmentName)
      .where("Course Name", "==", courseName);

  // Returns a reference to all the submissions for an assignment
  // associated with a user specified by user ID and assignment name
  // Implicitly assumes that there will never be two courses with the same name
  studentSubmissions = (courseName, assignmentName, studentID) =>
    this.db
      .collection("Submissions")
      .where("Student ID", "==", studentID)
      .where("Assignment Name", "==", assignmentName)
      .where("Course Name", "==", courseName);
}

export default Firebase;
