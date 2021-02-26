import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import HomeScreen from "./screens/HomeScreen";
import ExampleSimulation from "./components/exampleSimulation";

const App = () => {
  return (
    <Router>
      <Header />
      <Container className="routes py-2 d-flex justify-content-center">
        <Route path="/simulation" component={ExampleSimulation} />
        <Route exact path="/" component={HomeScreen} />
      </Container>
    </Router>
  );
};

export default App;
