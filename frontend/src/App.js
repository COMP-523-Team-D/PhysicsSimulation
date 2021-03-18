import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import HomeScreen from "./screens/HomeScreen";
import ExampleSimulationScreen from "./screens/exampleSimulationScreen";
import ExampleBuildScreen from "./screens/exampleBuildScreen";
import HomeScreenB from "./screens/HomeScreenB";

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

const simulationData = {};
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
          path="/b"
          component={() => <HomeScreenB data={dummyUserInfo} />}
        />
        <Route
          path="/build"
          component={() => <ExampleBuildScreen data={dummyUserInfo} />}
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
