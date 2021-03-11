import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import HomeScreen from "./screens/HomeScreen";
import ExampleSimulation from "./components/exampleSimulation";

const dummyUserInfo = {
  id: 1,
  typeEnum: "STUDENT",
  firstName: "John",
  lastName: "Doe",
  courses: ["Physics 100", "Another Class"],
};

const simulationData = {};
const App = () => {
  return (
    <Router>
      <Header />
      <Container className="routes py-2 d-flex justify-content-center">
        <Route path="/simulation" component={ExampleSimulation} />
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
