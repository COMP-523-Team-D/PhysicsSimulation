/**
 * This React Component contains the logic and rendered content
 * for all of the routes contained within the application
 * 
 * Date: 05/12/2021
 * @author Gabe Foster
 * @author Ross Rucho
 */

import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import LandingScreen from "./screens/LandingScreen";
import SandboxScreen from "./screens/SandboxScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import StudentsScreen from "./screens/StudentsScreen";
import StudentSubmissionsScreen from "./screens/StudentSubmissionsScreen";
import BuildScreen from "./screens/BuildScreen";
import CourseScreen from "./screens/CourseScreen";
import AssignmentScreen from "./screens/AssignmentScreen";
import ProblemScreen from "./screens/ProblemScreen";
import SubmissionScreen from "./screens/SubmissionScreen";
import Navigation from "./components/Navigation";
import * as ROUTES from "./constants/routes";
import { withAuthentication } from "./Session";
import "./App.css";
import HelpScreen from "./screens/HelpScreen";

const App = () => {
  return (
    <Router>
      <Navigation />
      <Container className="routes py-2 d-flex justify-content-center">
        <Route
          exact
          path={ROUTES.LANDING_SCREEN}
          component={() => <LandingScreen className="LandingScreen" />}
        />
        <Route
          path={ROUTES.REGISTER_SCREEN}
          component={() => <RegisterScreen className="RegisterScreen" />}
        />
        <Route
          path={ROUTES.LOGIN_SCREEN}
          component={() => <LoginScreen className="LoginScreen" />}
        />
        <Route
          path={ROUTES.HOME_SCREEN}
          component={() => <HomeScreen className="HomeScreen" />}
        />
        <Route
          path={ROUTES.BUILD_SCREEN + "/:courseName?"}
          component={() => <BuildScreen className="BuildScreen" />}
        />
        <Route
          path={ROUTES.SANDBOX_SCREEN + "/:simulationName"}
          component={() => <SandboxScreen className="SandboxScreen" />}
        />
        <Route
          exact
          path={ROUTES.COURSE_SCREEN + "/:courseName?"}
          component={() => <CourseScreen className="CourseScreen" />}
        />
        <Route
          exact
          path={
            ROUTES.COURSE_SCREEN +
            "/:courseName" +
            ROUTES.ASSIGNMENT_SCREEN +
            "/:assignmentName"
          }
          component={() => <AssignmentScreen className="AssignmentScreen" />}
        />
        <Route
          exact
          path={
            ROUTES.COURSE_SCREEN +
            "/:courseName" +
            ROUTES.ASSIGNMENT_SCREEN +
            "/:assignmentName" +
            ROUTES.PROBLEM_SCREEN +
            "/:problemName"
          }
          component={() => <ProblemScreen className="ProblemScreen" />}
        />
        <Route
          exact
          path={
            ROUTES.COURSE_SCREEN +
            "/:courseName" +
            ROUTES.ASSIGNMENT_SCREEN +
            "/:assignmentName" +
            ROUTES.SUBMISSION_SCREEN +
            "/:submissionName"
          }
          component={() => <SubmissionScreen className="SubmissionScreen" />}
        />
        <Route
          exact
          path={
            ROUTES.COURSE_SCREEN +
            "/:courseName" +
            ROUTES.ASSIGNMENT_SCREEN +
            "/:assignmentName" +
            ROUTES.STUDENTS_SCREEN +
            "/:studentName" +
            ROUTES.STUDENT_SUBMISSIONS_SCREEN +
            ROUTES.SUBMISSION_SCREEN +
            "/:submissionName"
          }
          component={() => <SubmissionScreen className="StudentScreen" />}
        />
        <Route
          exact
          path={
            ROUTES.COURSE_SCREEN +
            "/:courseName" +
            ROUTES.ASSIGNMENT_SCREEN +
            "/:assignmentName" +
            ROUTES.STUDENTS_SCREEN
          }
          component={() => <StudentsScreen className="StudentsScreen" />}
        />
        <Route
          exact
          path={
            ROUTES.COURSE_SCREEN +
            "/:courseName" +
            ROUTES.ASSIGNMENT_SCREEN +
            "/:assignmentName" +
            ROUTES.STUDENTS_SCREEN +
            "/:studentName" +
            ROUTES.STUDENT_SUBMISSIONS_SCREEN
          }
          component={() => (
            <StudentSubmissionsScreen className="StudentSubmissionsScreen" />
          )}
        />
        <Route
          exact
          path={ROUTES.HELP_SCREEN}
          component={() => <HelpScreen />}
        />
      </Container>
    </Router>
  );
};

export default withAuthentication(App);
