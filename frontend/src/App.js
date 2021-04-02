import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import LandingScreen from "./screens/LandingScreen";
import HomeScreen from "./screens/HomeScreen";
import ExampleSimulationScreen from "./screens/ExampleSimulationScreen";
import ExampleBuildScreen from "./screens/ExampleBuildScreen";
import InstructorProfile from "./screens/InstructorProfile";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import Navigation from "./components/Navigation";
import * as ROUTES from "./constants/routes";
import { withAuthentication } from "./Session";
import "./App.css";

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

const App = () => {
  return (
    <Router>
      <Navigation />
      <Container className="routes py-2 d-flex justify-content-center">
        <Route exact path={ROUTES.LANDING_SCREEN} component={() => (<LandingScreen simulations={supportedSimulations} className="LandingScreen"/>)}/>
        <Route exact path={ROUTES.REGISTER_SCREEN} component={() => (<RegisterScreen className="RegisterScreen"/>)}/>
        <Route exact path={ROUTES.LOGIN_SCREEN} component={() => (<LoginScreen className="LoginScreen" />)} />
        <Route exact path={ROUTES.HOME_SCREEN} component={() => (<HomeScreen simulations={supportedSimulations} className="HomeScreen"/>)}/>
        <Route exact path={ROUTES.PROBLEM_SCREEN}component={() => (<ExampleSimulationScreen data={dummyUserInfo} assignment={dummyAssignment}/>)}/>
        <Route exact path={ROUTES.PROFILE_SCREEN} component={() => (<InstructorProfile data={dummyUserInfo} />)}/>
        <Route exact path={ROUTES.BUILD_SCREEN} component={() => (<ExampleBuildScreen data={dummyUserInfo} supportedSimulations={supportedSimulations}/>)}/>
      </Container>
    </Router>
  );
};

export default withAuthentication(App);

