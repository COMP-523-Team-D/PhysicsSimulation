import "../App.css";
import {useState} from "react";
import { Button, Card, Col, Container, Row, Form } from "react-bootstrap";

const RegisterScreen = ({ db, auth }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = (e) => {
    e.preventDefault();
    console.log("Registering!");
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in 
          //var user = userCredential.user;
        })
        .catch((error) => {
          console.log(error.code);
          console.log(error.message);
        });
  }

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
                Register
              </Card.Title>
            </Card.Header>
            <Card.Body>

              <Form onSubmit={(e) => register(e)}>
                <Form.Label>New user registration</Form.Label>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Please provide an email address:</Form.Label>
                  <Form.Control type="email" placeholder="<onyen>@email.unc.edu" onChange={e => setEmail(e.target.value)}/>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Please provide a password:</Form.Label>
                  <Form.Control type="password" placeholder="Password" onChange={p => setPassword(p.target.value)}/>
                </Form.Group>

                <Button variant="primary" type="submit">
                  Register!
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

export default RegisterScreen;
