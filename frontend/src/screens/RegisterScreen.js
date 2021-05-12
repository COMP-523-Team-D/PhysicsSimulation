/**
 * This React Component contains the logic and rendered content
 * for the /register route within the application.
 * 
 * Date: 05/12/2021
 * @author Ross Rucho
 * @author Molly Crown
 */

import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../constants/routes";
import { Button, Card, Col, Container, Row, Form } from "react-bootstrap";
import "../App.css";

// Top-level JSX component
const RegisterScreen = () => <RegisterForm />;

const INITIAL_STATE = {
  firstName: "",
  lastName: "",
  instructors: [],
  courses: [],
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null,
};

// React Component containing logic and rendered content
export class RegisterFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    this.state.INSTRUCTORS = [];
    this.state.unsubscribeInstructors = null;
    this.state.COURSES = [];
    this.state.unsubscribeCourses = null;
  }

  onSubmit = (event) => {
    // Prevent the browser from refreshing
    event.preventDefault();
    
    const {
      firstName,
      lastName,
      instructors,
      courses,
      email,
      passwordOne,
    } = this.state;

    // Connects to the Firestore database using locally defined
    // API calls from Firebase/firebase.js
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then((authUser) => {
        // Create a document in the Users collection
        this.props.firebase.doCreateNewUserDocument(authUser.user.uid)
                  .set({
                    "Created": this.props.firebase.getTimestamp(),
                    "UID": authUser.user.uid,
                    "First Name": firstName,
                    "Last Name": lastName,
                    isInstructor: false,
                    Instructors: instructors,
                    Courses: courses
                  })
                  .catch((error) => {
                    this.setState({ error });
                  });
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME_SCREEN);
      })
      .catch((error) => {
        this.setState({ error });
      });
  };

  // Isolates the logic for updating the user provided input fields
  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // Isolates the logic for updating the user provided check box inputs
  onChangeArray = (event) => {
    const array = this.state[event.target.name];
    const eltIndex = array.indexOf(event.target.value);
    eltIndex >= 0 ? array.splice(eltIndex, 1) : array.push(event.target.value);
  };

  componentDidMount() {
    // Saves the callback function returned by the Firestore database access
    this.setState({
      unsubscribeInstructors:
        // Connects to the Firestore database using locally defined
        // API calls from Firebase/firebase.js
        this.props.firebase?.instructors()
            .onSnapshot((querySnapshot) => {
              let instructorsList = [];
              querySnapshot.forEach((doc) => {
                instructorsList.push(
                  `${doc.data()["First Name"]} ${doc.data()["Last Name"]}`
                );
              });

            this.setState({
              INSTRUCTORS: instructorsList,
            });
        })
    });
    
    // Saves the callback function returned by the Firestore database access
    this.setState({
      unsubscribeCourses:
        // Connects to the Firestore database using locally defined
        // API calls from Firebase/firebase.js
        this.props.firebase?.courses()
            .onSnapshot((querySnapshot) => {
              let coursesList = [];
              querySnapshot.forEach((doc) => {
                coursesList.push(doc.data().Name);
              });

              this.setState({
                COURSES: coursesList,
              });
            })
    });
  }

  componentWillUnmount() {
    // Calls the stored callback functions to close the database connection
    this.state.unsubscribeInstructors();
    this.state.unsubscribeCourses();
  }

  render() {
    const {
      firstName,
      lastName,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === "" ||
      email === "" ||
      firstName === "" ||
      lastName === "";

    return (
      <Container>
        <Row className="m-4"> </Row>
        <Row className="mt-5">
          <Col className="d-flex justify-content-center">
            <Card className="text-weight-bold register-card">
              <Card.Header className="bg-secondary">
                <Card.Title className="landingPageCardTitle">
                  <span>
                    <i className="fas fa-calendar-alt fa-1.7x mr-2"></i>{" "}
                  </span>
                  New Student Registration
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={this.onSubmit}>
                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridFirstName">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        name="firstName"
                        id='firstName'
                        value={firstName}
                        type="text"
                        placeholder="Enter first name"
                        onChange={this.onChange}
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridLastName">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        name="lastName"
                        id="lastName"
                        value={lastName}
                        type="text"
                        placeholder="Enter last name"
                        onChange={this.onChange}
                      />
                    </Form.Group>
                  </Form.Row>

                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridEmail">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        name="email"
                        id="email"
                        value={email}
                        type="email"
                        placeholder="Enter email address"
                        onChange={this.onChange}
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPasswordOne">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        name="passwordOne"
                        id="passwordOne"
                        value={passwordOne}
                        type="password"
                        placeholder="Enter password"
                        onChange={this.onChange}
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPasswordTwo">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        name="passwordTwo"
                        id="passwordTwo"
                        value={passwordTwo}
                        type="password"
                        placeholder="Confirm password"
                        onChange={this.onChange}
                      />
                    </Form.Group>
                  </Form.Row>

                  <Form.Row>
                    <Form.Group as={Col}>
                      <Form.Label>Select Your Instructors</Form.Label>
                      {this.state.INSTRUCTORS.map((instructor, i) => (
                        <div key={instructor} className="mb-3">
                          <Form.Check
                            name="instructors"
                            value={instructor}
                            type={"checkbox"}
                            label={instructor}
                            onChange={this.onChangeArray}
                          />
                        </div>
                      ))}
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>Select Your Courses</Form.Label>
                      {this.state.COURSES.map((course, i) => (
                        <div key={course} className="mb-3">
                          <Form.Check
                            name="courses"
                            value={course}
                            type={"checkbox"}
                            label={course}
                            onChange={this.onChangeArray}
                          />
                        </div>
                      ))}
                    </Form.Group>
                  </Form.Row>

                  <Button
                    disabled={isInvalid}
                    id="submit"
                    className="register-button bg-secondary"
                    variant="primary"
                    type="submit"
                  >
                    Register!
                  </Button>

                  {error && <p>{error.message}</p>}
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="m-4"></Row>
      </Container>
    );
  }
}

// JSX component exported to the Login screen directing
// unregistered users to the Register screen
const RegisterLink = () => (
  <p>
    Don't have an account?
    <br />
    <a
      className="btn register-button bg-secondary"
      href={ROUTES.REGISTER_SCREEN}
      role="button"
    >
      Register
    </a>
  </p>
);

// Intermediate JSX component declared with access to Router and Firebase state
const RegisterForm = withRouter(withFirebase(RegisterFormBase));

export default RegisterScreen;

export { RegisterForm, RegisterLink };
