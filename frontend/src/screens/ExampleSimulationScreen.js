import { Card, Col, Container, Row, Button } from "react-bootstrap";
import { useState } from "react";
import QandA from "../components/QandA";

const ExampleSimulationScreen = ({ data, assignment }) => {
  const { typeEnum, firstName, lastName, courses } = data;
  const { name, questions } = assignment;
  const [qIndex, setqIndex] = useState(1);

  return (
    <Container className="simulation-container">
      <Row>
        <Col
          sm={8}
          className="d-flex align-content-center justify-content-center"
        >
          <Container>
            <Row className="mt-4 pt-3">
              <Col className="d-flex justify-content-center">
                <iframe
                  src="https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_en.html"
                  className="phet-sim"
                  scrolling="no"
                  allowFullScreen
                  title="Projectile Motion"
                ></iframe>
              </Col>
            </Row>
            <Row className="d-flex justify-content-center mt-5 graph-container">
              <Col className="graph">
                <Card className="d-flex graph-card">
                  <Card.Body>
                    <Card.Title>A Graph Title</Card.Title>
                    <Container className="d-flex justify-content-center align-content-center">
                      <i className="fas fa-chart-area fa-8x"></i>
                    </Container>
                    <Card.Text>This is where a graph could go</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col className="graph">
                <Card className="d-flex graph-card">
                  <Card.Body>
                    <Card.Title>A Graph Title</Card.Title>
                    <Container className="d-flex justify-content-center align-content-center">
                      <i className="fas fa-chart-area fa-8x"></i>
                    </Container>
                    <Card.Text>This is where a graph could go</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col className="graph">
                <Card className="d-flex graph-card">
                  <Card.Body>
                    <Card.Title>A Graph Title</Card.Title>
                    <Container className="d-flex justify-content-center align-content-center">
                      <i className="fas fa-chart-area fa-8x"></i>
                    </Container>
                    <Card.Text>This is where a graph could go</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </Col>
        <Col
          sm={4}
          className="d-flex mt-5 align-content-center text-center questions-card-col"
        >
          <Card className="d-flex align-self-center questions-card">
            <Card.Header>
              <Container className="d-flex align-content-center">
                <span className="mr-auto">
                  <button
                    type="button"
                    className={
                      "btn btn-outline scroll-btn" +
                      (qIndex == 1 ? " disabled" : " not-disabled")
                    }
                    onClick={() => {
                      qIndex - 1 > 0 && setqIndex((prev) => prev - 1);
                    }}
                  >
                    <i className="fas fa-angle-left"></i>
                  </button>
                </span>
                <span className="align-self-center">
                  Question {qIndex} of {questions.length}
                </span>
                <span className="ml-auto">
                  <button
                    type="button"
                    className={
                      "btn btn-outline scroll-btn" +
                      (qIndex == questions.length
                        ? " disabled"
                        : " not-disabled")
                    }
                    onClick={() => {
                      qIndex + 1 < questions.length + 1 &&
                        setqIndex((prev) => prev + 1);
                    }}
                  >
                    <i className="fas fa-angle-right"></i>
                  </button>
                </span>
              </Container>
            </Card.Header>
            <Card.Body className="questions-card-body">
              <Card.Title className="card-title my-4">
                Answer These Questions
              </Card.Title>
              <Row className="d-flex justify-content-center p-2 my-4">
                <QandA />
              </Row>
              <Row className="d-flex justify-content-center">
                <h2 className="question-sub-header">PUT TEXT HERE</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Adipisci commodi delectus deleniti dolor dolorem est facilis
                  hic impedit, in laboriosam magnam nisi nulla possimus, quaerat
                  quibusdam rem saepe tenetur velit?
                </p>
              </Row>
              <Row className="d-flex justify-content-center">
                <h2 className="question-sub-header">PUT TEXT HERE</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Adipisci commodi delectus deleniti dolor dolorem est facilis
                  hic impedit, in laboriosam magnam nisi nulla possimus, quaerat
                  quibusdam rem saepe tenetur velit?
                </p>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ExampleSimulationScreen;
