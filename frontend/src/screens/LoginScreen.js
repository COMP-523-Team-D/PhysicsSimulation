import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { RegisterLink } from './RegisterScreen';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../constants/routes';
import { Button, Card, Col, Container, Row, Form } from "react-bootstrap";
import "../App.css";

const LoginScreen = () => (
    <LoginForm />
);

// const loggedin = false;
const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};
 
export class LoginFormBase extends Component {
  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;
 
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME_SCREEN);
      })
      .catch(error => {
        this.setState({ error });
      });
 
    event.preventDefault();
  };
 
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
 
  render() {
    const { email, password, error } = this.state;
 
    const isInvalid = password === '' || email === '';
 
    return (
      <Container>
        <Row className="m-4"> </Row>
        <Row className="mt-5">
          <Col className="d-flex justify-content-center">
            <Card className="authentication-card text-weight-bold">
              <Card.Header className="bg-secondary">
                <Card.Title className="landingPageCardTitle">
                  <span>
                    <i className="fas fa-calendar-alt fa-1.7x mr-2"></i>{" "}
                  </span>
                  Existing User Login
                </Card.Title>
              </Card.Header>
              <Card.Body>
                
                <Form onSubmit={this.onSubmit}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Please enter your email address:</Form.Label>
                    <Form.Control
                      name="email"
                      value={email}
                      type="email"
                      id="email"
                      placeholder="Enter email address"
                      onChange={this.onChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Please enter your password:</Form.Label>
                    <Form.Control
                      name="password"
                      value={password}
                      type="password"
                      id="password"
                      placeholder="Enter password"
                      onChange={this.onChange}
                    />
                  </Form.Group>

                  <Button disabled={isInvalid} id="submit" className="login-button bg-secondary" variant="primary" type="submit">
                    Login!
                  </Button>

                  <br/>

                  {error && <p>{error.message}</p>}
                </Form>

                <RegisterLink />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="m-4"></Row>
      </Container>
    );
  }
}
 
const LoginForm = withRouter(withFirebase(LoginFormBase));
 
export default LoginScreen;
 
export { LoginForm };