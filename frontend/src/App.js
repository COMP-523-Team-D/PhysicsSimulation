import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import HomeScreen from "./screens/HomeScreen";
import ExampleSimulationScreen from "./screens/ExampleSimulationScreen";
import ExampleBuildScreen from "./screens/ExampleBuildScreen";
import InstructorProfile from "./screens/InstructorProfile";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

var firebaseConfig = {
  apiKey: "AIzaSyA1gu3Z0AhuGUQXFMOl9C69-V-eCcwD3hI",
  //authDomain: "unc-physics-simulation.firebaseapp.com",
  //databaseURL: "https://unc-physics-simulation-default-rtdb.firebaseio.com",
  databaseURL: "https://localhost:8080",
  projectId: "unc-physics-simulation",
  //storageBucket: "unc-physics-simulation.appspot.com",
  //messagingSenderId: "188932414514",
  //appId: "1:188932414514:web:c7df0cb566929883fc302b",
  //measurementId: "G-Z97JLPVR8C",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();

/*
 * Firebase Authentication
 * & Firebase Firestore
 */
const auth = firebase.auth();
auth.useEmulator("http://localhost:9099"); // Initialize to use the emulators

const db = firebase.firestore();
db.useEmulator("localhost", 8080); // Initialize to use the emulators

// main container component

// example dummy data
// added so we could see how things could be rendered based on user details

const dummyUserInfo = {
  id: 1,
  typeEnum: "STUDENT",
  firstName: "John",
  lastName: "Doe",
  courses: ["Physics 100", "Another Class"],
};

const supportedSimulations = [
  {
    //renamed variables to make less ambiguous
    //left old names until I can hunt them all down and change them

    simName: "Projectile Motion",
    simSrcPath: "../../phetsims/projectile-motion/projectile-motion_en.html",
    Name: "Projectile Motion",
    Source:
      "https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_en.html",
    Variables: ["Initial Speed", "Cannon Angle", "Cannon Height"],
    simVariables: ["Initial Speed", "Cannon Angle", "Cannon Height"],
  },
  {
    Name: "Forces and Motion",
    Source:
      "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_en.html",
    Variables: ["Initial Speed", "Cannon Angle", "Cannon Height"],
  },

  {
    Name: "Friction",
    Source:
      "https://phet.colorado.edu/sims/html/friction/latest/friction_en.html",
    Variables: ["Initial Speed", "Cannon Angle", "Cannon Height"],
  },

  {
    Name: "Hooke's Law",
    Source:
      "https://phet.colorado.edu/sims/html/hookes-law/latest/hookes-law_en.html",
    Variables: ["Initial Speed", "Cannon Angle", "Cannon Height"],
  },
];

const dummyAssignment = {
  id: 0,
  name: "Projectile Motion",
  questions: ["q1", "q2", "q3"],
  simulation: supportedSimulations[0],
};

/*
auth.onAuthStateChanged( (user) => {
  if (user) {
    props = <Router>
              <Header data={dummyUserInfo} />
              <Container className="routes py-2 d-flex justify-content-center">
                <Route
                  exact
                  path="/"
                  component={() => (
                    <HomeScreen data={dummyUserInfo} className="HomeScreen" />
                  )}
                />
                <Route
                  exact
                  path="/Login"
                  component={() => (
                    <LoginScreen data={dummyUserInfo} className="LoginScreen" />
                  )}
                />
                <Route
                  exact
                  path="/Register"
                  component={() => (
                    <RegisterScreen data={dummyUserInfo} className="RegisterScreen" />
                  )}
                />
                <Route
                  path="/simulation"
                  component={() => (
                    <ExampleSimulationScreen
                      data={dummyUserInfo}
                      assignment={dummyAssignment}
                    />
                  )}
                />
                <Route
                  path="/InstructorProfile"
                  component={() => (
                    <InstructorProfile
                      data={dummyUserInfo}
                    />
                  )}
                />
                <Route
                  path="/build"
                  component={() => (
                    <ExampleBuildScreen
                      data={dummyUserInfo}
                      supportedSimulations={supportedSimulations}
                    />
                  )}
                />
              </Container>
            </Router>
  }else {
    props = <Router>
              <Header data={dummyUserInfo} />
              <Container className="routes py-2 d-flex justify-content-center">
                <Route
                  exact
                  path="/"
                  component={() => (
                    <HomeScreen data={dummyUserInfo} className="HomeScreen" />
                  )}
                />
                <Route
                  exact
                  path="/Login"
                  component={() => (
                    <LoginScreen data={dummyUserInfo} className="LoginScreen" />
                  )}
                />
                <Route
                  exact
                  path="/Register"
                  component={() => (
                    <RegisterScreen data={dummyUserInfo} className="RegisterScreen" />
                  )}
                />
                <Route
                  path="/simulation"
                  component={() => (
                    <ExampleSimulationScreen
                      data={dummyUserInfo}
                      assignment={dummyAssignment}
                    />
                  )}
                />
              </Container>
            </Router>
    
  }
});
*/

const App = () => {
  return (
    <Router>
      <Header db={db} auth={auth} />
      <Container className="routes py-2 d-flex justify-content-center">
        <Route
          exact
          path="/"
          component={() => (
            <HomeScreen
              db={db}
              auth={auth}
              simulations={supportedSimulations}
              className="HomeScreen"
            />
          )}
        />
        <Route
          exact
          path="/Login"
          component={() => (
            <LoginScreen db={db} auth={auth} className="LoginScreen" />
          )}
        />
        <Route
          exact
          path="/Register"
          component={() => (
            <RegisterScreen db={db} auth={auth} className="RegisterScreen" />
          )}
        />
        <Route
          path="/simulation"
          component={() => (
            <ExampleSimulationScreen
              data={dummyUserInfo}
              assignment={dummyAssignment}
            />
          )}
        />
        <Route
          path="/InstructorProfile"
          component={() => <InstructorProfile data={dummyUserInfo} />}
        />
        <Route
          path="/b"
          component={() => <HomeScreenB data={dummyUserInfo} />}
        />
        <Route
          path="/build"
          component={() => (
            <ExampleBuildScreen
              data={dummyUserInfo}
              supportedSimulations={supportedSimulations}
            />
          )}
        />
      </Container>
    </Router>
  );
};

export default App;
