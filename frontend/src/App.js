import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import LandingScreen from "./screens/LandingScreen";
import SandboxScreen from "./screens/SandboxScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import BuildScreen from "./screens/BuildScreen";
import CourseScreen from "./screens/CourseScreen";
import AssignmentScreen from "./screens/AssignmentScreen";
import ProblemScreen from "./screens/ProblemScreen";
import Navigation from "./components/Navigation";
import * as ROUTES from "./constants/routes";
import { withAuthentication } from "./Session";
import "./App.css";
import ProjectileMotionSimulationScreen from "./screens/ProjectileMotionSimulationScreen";

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
  simulation: {
    simName: "Projectile Motion",
    simSrcPath: "../../phetsims/projectile-motion/projectile-motion_en.html",
    simVariables: ["Initial Speed", "Cannon Angle", "Cannon Height"],
  },
};

const App = () => {
  return (
    <Router>
      <Navigation />
      <Container className="routes py-2 d-flex justify-content-center">
        <Route
          exact
          path={ROUTES.LANDING_SCREEN}
          component={() => <LandingScreen className="LandingScreen"/>}
        />
        <Route
          path={ROUTES.REGISTER_SCREEN}
          component={() => <RegisterScreen className="RegisterScreen"/>}
        />
        <Route
          path={ROUTES.LOGIN_SCREEN}
          component={() => <LoginScreen className="LoginScreen"/>}
        />
        <Route
          path={ROUTES.HOME_SCREEN}
          component={() => <HomeScreen className="HomeScreen"/>}
        />
        <Route
          exact
          path={ROUTES.PROFILE_SCREEN + "/:userName"}
          component={() => <ProfileScreen className="ProfileScreen"/>}
        />
        <Route
          path={ROUTES.BUILD_SCREEN + "/:courseName?"}
          component={() => (<BuildScreen className="BuildScreen"/>)}
        />
        <Route
          path={ROUTES.SANDBOX_SCREEN + "/:simulationName"}
          component={() => <SandboxScreen className="SandboxScreen"/>}
        />
        <Route
          exact
          path={ROUTES.COURSE_SCREEN + "/:courseName?"}
          component={() => <CourseScreen className="CourseScreen"/>}
        />
        <Route
          exact
          path={ROUTES.COURSE_SCREEN + "/:courseName" + ROUTES.ASSIGNMENT_SCREEN + "/:assignmentName"}
          component={() => <AssignmentScreen className="AssignmentScreen"/>}
        />
        <Route
          exact
          path={ROUTES.COURSE_SCREEN + "/:courseName" + ROUTES.ASSIGNMENT_SCREEN + "/:assignmentName" + ROUTES.PROBLEM_SCREEN + "/:problemName"}
          component={() => (<ProblemScreen className="ProblemScreen"/>)}
        />
        <Route
            exact
            path={"/simulation"}
            component={() => (<ProjectileMotionSimulationScreen data={dummyUserInfo} assignment={dummyAssignment}/>)}
        />
      </Container>
    </Router>
  );
};

export default withAuthentication(App);
