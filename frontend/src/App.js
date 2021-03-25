import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import HomeScreen from "./screens/HomeScreen";
import ExampleSimulationScreen from "./screens/ExampleSimulationScreen";
import ExampleBuildScreen from "./screens/ExampleBuildScreen";
import HomeScreenB from "./screens/HomeScreenB";
import InstructorProfile from "./screens/InstructorProfile";

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

const dummyAssignment = {
  id: 0,
  name: "Projectile Motion",
  questions: ["q1", "q2", "q3"],
};

const supportedSimulations = [
  {
    Name: "Projectile Motion",
    Source:
      "https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_en.html",
    Variables: ["Initial Speed", "Cannon Angle", "Cannon Height"],
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

const App = () => {
  return (
    <Router>
      <Header data={dummyUserInfo} />
      <Container className="routes py-2 d-flex justify-content-center">
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
        <Route
          exact
          path="/"
          component={() => (
            <HomeScreen data={dummyUserInfo} className="exampleHomeScreen" />
          )}
        />
      </Container>
    </Router>
  );
};

export default App;
