import "../App.css";
import { useState } from "react";
import { Button, Card, Col, Container, Row, Form } from "react-bootstrap";

const RegisterScreen = ({ db, auth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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

  console.log(teachers);
  console.log(classes);

  const register = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        db.collection("Users").add({
          UID: user.uid,
          "First Name": firstName,
          "Last Name": lastName,
          isInstructor: false,
          Instructors: instructors,
          Students: [],
          Courses: courses,
        });
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
      });
  };

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
              <Form onSubmit={(e) => register(e)}>
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="first name"
                      placeholder="Enter first name"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="last name"
                      placeholder="Enter last name"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      onChange={(p) => setPassword(p.target.value)}
                    />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId="formGridInstructors">
                    <Form.Label>Select Your Instructors</Form.Label>
                    <Form.Control as="select" multiple>
                      {teachers.map((teacher, i) => {
                        <option key={i} value={teacher}>
                          {teacher}
                        </option>;
                      })}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridCourses">
                    <Form.Label>Select Your Courses</Form.Label>
                    <Form.Control as="select" multiple>
                      {classes.map((cls, i) => {
                        <option key={i} value={cls}>
                          {cls}
                        </option>;
                      })}
                    </Form.Control>
                  </Form.Group>
                </Form.Row>

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
