import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';
import * as ROUTES from '../constants/routes';
import { Button, Card, Col, Container, Row, Form } from "react-bootstrap";
import "../App.css";

const RegisterScreen = () => (
  <div>
    <FirebaseContext.Consumer>
      {firebase => <RegisterForm firebase={firebase} />}
    </FirebaseContext.Consumer>
  </div>
);
 
const INITIAL_STATE = {
  firstName: '',
  lastName: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class RegisterForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;
 
    this.props.firebase
      .doCreateUserWithEmailAndPassword()
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });
 
    event.preventDefault();
  }
 
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
 
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
      passwordOne === '' ||
      email === '' ||
      firstName === '' ||
      lastName === '';

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
                        name="first name"
                        value={firstName}
                        type="text"
                        placeholder="Enter first name"
                        onChange={this.onChange}
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridLastName">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        name="last name"
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
                        name="email address"
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
                        value={passwordTwo}
                        type="password"
                        placeholder="Confirm password"
                        onChange={this.onChange}
                      />
                    </Form.Group>
                  </Form.Row>

                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridInstructors">
                      <Form.Label>Select Your Instructors</Form.Label>
                      <Form.Control as="select" multiple>
                        {/*teachers.map((teacher, i) => {
                          <option key={i} value={teacher}>
                            {teacher}
                          </option>;
                        })*/}
                      </Form.Control>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridCourses">
                      <Form.Label>Select Your Courses</Form.Label>
                      <Form.Control as="select" multiple>
                          {/*classes.map((cls, i) => {
                              <option key={i} value={cls}>
                                {cls}
                              </option>;
                          })*/}
                      </Form.Control>
                    </Form.Group>
                  </Form.Row>

                  <Button disabled={isInvalid} variant="primary" type="submit">
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
 
const RegisterLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.REGISTER_SCREEN}>Sign Up</Link>
  </p>
);
 
export default RegisterScreen;
 
export { RegisterForm, RegisterLink };

/*
const RegisterScreen = ({ db, auth }) => {
  const [instructors, setInstructors] = useState("");
  const [courses, setCourses] = useState("");
  const teachers = [];
  const classes = [];

  db.collection("Users")
    .where("isInstructor", "==", true)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        teachers.push(`${doc.get("First Name")} ${doc.get("Last Name")}`);
      });
    })
    .catch((error) => {
      console.log("Error getting instructors: ", error);
    });

  db.collection("Courses")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        classes.push(doc.get("Name"));
      });
    })
    .catch((error) => {
      console.log("Error getting courses: ", error);
    });

};

*/