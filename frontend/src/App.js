import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import HomeScreen from "./screens/HomeScreen";
import ExampleSimulation from "./components/exampleSimulation";
import ExampleBuild from "./components/exampleBuild";

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
      <Container className="routes py-2 d-flex justify-content-center mb-5">
        <Route
          path="/simulation"
          component={() => (
            <ExampleSimulation
              data={dummyUserInfo}
              assignment={dummyAssignment}
            />
          )}
        />
        <Route
          path="/build"
          component={() => <ExampleBuild data={dummyUserInfo} />}
        />
        <Route
          exact
          path="/"
          component={() => <HomeScreen data={dummyUserInfo} />}
        />
      </Container>
    </Router>
  );
};

export default App;
