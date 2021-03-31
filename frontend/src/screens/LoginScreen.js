import "../App.css";
import {useState} from "react";
import { Button, Card, Col, Container, Row, Form } from "react-bootstrap";

const LoginScreen = ({ db, auth }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in
          //let user = userCredential.user;
        })
        .catch((error) => {
          console.log(error.code);
          console.log(error.message);
        });
  }

  /*
  const logout = () => {
    auth.signOut().then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }
  */

  return (
    <Container>
      <Row className="m-4"> </Row>
      <Row className="mt-5">
        <Col md={4}>
          <Card className="landingPageCard text-weight-bold">
            <Card.Header className="bg-secondary">
              <Card.Title className="landingPageCardTitle">
                <span>
                  <i className="fas fa-calendar-alt fa-1.7x mr-2"></i>{" "}
                </span>
                Existing User Login
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={(e) => login(e)}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Please enter your email address:</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" onChange={e => setEmail(e.target.value)}/>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Please enter your password:</Form.Label>
                  <Form.Control type="password" placeholder="Enter password" onChange={p => setPassword(p.target.value)}/>
                </Form.Group>

                <Button variant="primary" type="submit">
                  Login!
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="m-4"></Row>
    </Container>
  );
};

export default LoginScreen;
