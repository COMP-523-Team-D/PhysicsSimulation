import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import LandingScreen from "./screens/LandingScreen";
import SandboxScreen from "./screens/SandboxScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import GradeScreen from "./screens/GradeScreen";
import BuildScreen from "./screens/BuildScreen";
import CourseScreen from "./screens/CourseScreen";
import AssignmentScreen from "./screens/AssignmentScreen";
import ProblemScreen from "./screens/ProblemScreen";
import Navigation from "./components/Navigation";
import * as ROUTES from "./constants/routes";
import { withAuthentication } from "./Session";
import "./App.css";

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
          path={ROUTES.GRADE_SCREEN + "/:userName"}
          component={() => <GradeScreen className="GradeScreen"/>}
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
      </Container>
    </Router>
  );
};

export default withAuthentication(App);
