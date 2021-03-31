// <div dangerouslySetInnerHTML={{__html:"<iframe src='../../phetsims/projectile-motion/projectile-motion_en.html' className='phet-sim' scrolling='no' allowFullScreen title='Projectile Motion'/>"}}/>

import { Card, Col, Container, Row, Button } from "react-bootstrap";
import { useState } from "react";
import QandA from "../components/QandA";
import SimulationContainerComponent from "../components/SimulationContainerComponent";

const ExampleSimulationScreen = ({ data, assignment }) => {
  const { typeEnum, firstName, lastName, courses } = data;
  const { name, questions } = assignment;
  const [qIndex, setqIndex] = useState(1);

  const { simulation } = assignment;
  const { simName, simSrcPath, simVariables } = simulation;

  return (
    <Container className="simulation-container">
      <Row className="d-md-flex justify-content-center">
        <Col
          sm={12}
          md={8}
          className="d-flex d-md-block align-content-center justify-content-center"
        >
          <Container>
            <Row className="mt-4 pt-3">
              <Col className="d-flex justify-content-center">
                <SimulationContainerComponent
                  simVariables={simVariables}
                  simName={simName}
                  simSrcPath={simSrcPath}
                />
              </Col>
            </Row>
            <Row className="justify-content-center mt-5 graph-container d-md-flex d-none ">
              <Col className="graph my-5">
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
              <Col className="graph my-5">
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
              <Col className="graph my-5">
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

            <Row className="mt-5 d-md-none d-xs-flex flex-xs-row">
              <Col className="graph my-5">
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
            <Row className="mt-5 d-md-none d-xs-flex flex-xs-row">
              <Col className="graph my-5">
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
            <Row className="mt-5 d-md-none d-xs-flex flex-xs-row">
              <Col className="graph my-5">
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
        <Col className="d-none d-md-flex mt-5 align-content-center text-center questions-card-col">
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
        <Row className="d-flex d-md-none my-5">
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
        </Row>
      </Row>
    </Container>
  );
};

export default ExampleSimulationScreen;
