import { Card, Col, Container, Row, Form } from "react-bootstrap";
import { useState } from "react";

const ExampleBuildScreen = ({ data, supportedSimulations }) => {
  const [index, setIndex] = useState(0);
  const [selectedSim, setSelectedSim] = useState(supportedSimulations[0]);

  return (
    <Container className="build-container mb-4">
      <Card className="d-flex align-self-center build-card mx-auto">
        <Card.Header>
          <Container className="d-flex align-content-center">
            <span className="mr-auto">
              <button
                type="button"
                className="btn btn-outline scroll-btn"
                onClick={() => {
                  index - 1 >= 0 && setIndex((prev) => prev - 1);
                }}
              >
                <i className="fas fa-angle-left"></i>
              </button>
            </span>
            <Card.Title className="mt-1 d-flex justify-self-center align-self-center text-center">
              {index === 0
                ? "Choose Your Simulation"
                : index === 1
                ? "Select and Set Initial Variables"
                : null}
            </Card.Title>
            <span className="ml-auto">
              <button
                type="button"
                className="btn btn-outline scroll-btn"
                onClick={() => index + 1 < 5 && setIndex((prev) => prev + 1)}
              >
                <i className="fas fa-angle-right"></i>
              </button>
            </span>
          </Container>
        </Card.Header>
        <Card.Body className="build-card-body">
          {/* Page 1: Select Simulation **/}
          <Container
            className={
              index === 0
                ? "d-flex align-contents-center build-sim-card-1"
                : "build-sim-card-1 d-none"
            }
          >
            <Col>
              <Row className="my-4">
                <Col>
                  <Form.Group className="sim-box-select" controlId="simSelect">
                    <Form.Control
                      as="select"
                      onChange={(e) => {
                        setSelectedSim(
                          supportedSimulations.filter(
                            (sim) => sim.Name === e.target.value
                          )
                        );
                      }}
                    >
                      <option value=""></option>
                      {supportedSimulations.map((sim) => (
                        <option key={sim.Name} value={sim.Name}>
                          {sim.Name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="d-flex align-self-end mt-4">
                <Col className="d-flex justify-content-center">
                  {(selectedSim[0] != null && (
                    <iframe
                      src={selectedSim[0]?.Source}
                      className="phet-sim-preview align-self-center"
                      scrolling="no"
                      allowFullScreen
                      title={selectedSim[0]?.Name}
                    ></iframe>
                  )) || (
                    <Container className="d-flex justify-content-center">
                      <h2 className="display-4 text-center phet-sim-preview-alt my-5">
                        Select a Simulation To Preview
                      </h2>
                    </Container>
                  )}
                </Col>
              </Row>
            </Col>
          </Container>

          {/* Page 2: Select and Set Variables **/}
          <Container
            className={
              index === 1
                ? "d-flex align-contents-center build-sim-card-1"
                : "build-sim-card-1 d-none"
            }
          >
            <span>PICK UP HERE GABE</span>
            <Col className="my-2 ">
              <Row className="my-5">
                <Col>
                  {selectedSim[0]?.Variables.map((v) => (
                    <Form.Group className="d-flex justify-contents-center">
                      <Col sm={4} className="d-block">
                        <Form.Label className="d-block var-label">
                          {v}
                        </Form.Label>
                      </Col>
                      <Col sm={10}>
                        <Form.Control className="var-input " as="input" />
                      </Col>
                    </Form.Group>
                  ))}
                </Col>
              </Row>
            </Col>
          </Container>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ExampleBuildScreen;
