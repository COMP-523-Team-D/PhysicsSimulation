/**
 * This React Component contains the logic and rendered content
 * for the /course/:courseName/assignment/:assignmentName/submission/:submissionName
 * route or the /course/:courseName/assignment/:assignmentName/students/:studentName
 * /student_submissions/submission/:submissionName route within the application.
 * 
 * Date: 05/12/2021
 * @author Ross Rucho
 */

import { useState, useEffect } from "react";
import { Card, Col, Container, Row, Button, Form } from "react-bootstrap";
import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";
import GraphComponent from "../components/GraphComponent";

const SubmissionScreen = (props) => {
  const [simulation, setSimulation] = useState({});
  const [simulationSourceOffset, setSimulationSourceOffset] = useState("");
  const [graphs, setGraphs] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [graphAnswers, setGraphAnswers] = useState({});

  // Update this state (add 1) whenever we have new parameters for the simulation.
  // This will alert the iframe that it needs to refresh.
  const [reloadIframe, setReloadIframe] = useState(0);

  const [loading, setLoading] = useState(true);
  const [initialXAxis, setInitialXAxis] = useState();
  function setUpXAxis() {
    let arr = [0];
    let num = 0.2;
    for (let i = 0; i <= 20; i++) {
      arr.push(num.toFixed(2));
      num += 0.2;
    }
    setInitialXAxis(arr);
  }

  useEffect(() => {
    setUpXAxis();
  }, []);

  const [t, setT] = useState([]);
  const [px, setPx] = useState([]);
  const [py, setPy] = useState([]);
  const [vx, setVx] = useState([]);
  const [vy, setVy] = useState([]);
  const [ax, setAx] = useState([]);
  const [ay, setAy] = useState([]);

  // function for handling data points from projectile motion simulation
  const handleNewPoint = function (e) {
    // Parse simulation data into the correct arrays
    if (e.data.t) {
      setT(e.data.t.map((d) => d.toFixed(2)));
      setPx(e.data.px.map((d) => d.toFixed(2)));
      setPy(e.data.py.map((d) => d.toFixed(2)));
      setVx(e.data.vx.map((d) => d.toFixed(2)));
      setVy(e.data.vy.map((d) => d.toFixed(2)));
      setAx(e.data.ax.map((d) => d.toFixed(2)));
      setAy(e.data.ay.map((d) => d.toFixed(2)));
      setLoading(false);
    }
  };

  // Sets up the communication between the frontend and the simulation
  // when the screen is initially rendered.
  useEffect(() => {
    setSimulation(props.location.state.problem["Simulation"]);
    setSimulationSourceOffset(props.location.state.simulationSourceOffset);
    setGraphs(props.location.state.problem["Graphs"]);
    setQuestions(props.location.state.problem["Questions"]);
    setAnswers(props.location.state.submission["Question Answers"]);
    setGraphAnswers(props.location.state.submission["Graph Answers"]);
    

    const fixedVariables = {
      height: props.location.state.problem.Parameters["height"],
      velocity: props.location.state.problem.Parameters["velocity"],
      angle: props.location.state.problem.Parameters["angle"],
      target: 120,
      gravity: NaN,
    };

    // Listen for information about cannon fires
    window.addEventListener("message", handleNewPoint);

    // Send fixed parameters to the simulation (if any),
    // and then alert the iframe that it needs to refresh.
    window.sessionStorage.setItem('fixedVariables', JSON.stringify(fixedVariables));
    setReloadIframe(reloadIframe + 1);

    return function cleanup() {
      window.sessionStorage.clear();
      window.removeEventListener("message", handleNewPoint);
    };
  }, []);

  return (
    <Container className="simulation-container">
      <Row className="d-md-flex justify-content-center">
        <Col sm={12} md={8} className="d-flex d-md-block align-content-center justify-content-center">
          {!!simulation["Name"] &&
            <iframe
              key={reloadIframe}
              className="phet-sim"
              src={simulationSourceOffset + simulation["Source"]}
              scrolling="no"
              allowFullScreen
              title={simulation["Name"]}
            ></iframe>
          }
        </Col>
        <Col className="d-none d-md-block align-content-center text-center questions-card-col">
          <Card className="d-flex align-self-center questions-card">
            <Card.Header>
              Answer These Questions
            </Card.Header>
            <Card.Body className="questions-card-body">
              {questions.map((question, localIndex) => (
                <Form.Group key={localIndex}>
                  <Form.Label>
                    Question {localIndex+1} of {questions.length}: {question}
                  </Form.Label>
                  <Form.Control
                    readOnly
                    as="textarea"
                    rows={3}
                    value={answers[localIndex]}
                  >
                  </Form.Control>
                </Form.Group>
              ))}
              <Button
                className="bg-secondary"
                variant="primary"
                type="submit"
              >
              Submit
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="my-5 justify-content-center mt-5 graph-container d-md-flex d-none ">
        <Col>
          {graphs.filter( graph => graph.yAxis==="x-position").map((graph) => (
            <Card key={graph.title} className="d-flex graph-card">
              <Card.Header className="graph-card-header d-flex">
                <Card.Title className="mr-auto">
                  {graph.title}
                </Card.Title>
                <span className="ml-auto justify-self-end tool-bag">
                  <i className="fas fa-tools fa-1.5x"></i>
                </span>
              </Card.Header>
              <Card.Body className="graph-card-body">
                <Container className="d-flex justify-content-center align-content-center">
                  <GraphComponent
                    className="bg-white"
                    ind={loading ? initialXAxis : t}
                    dep={!loading && px}
                    xMin={graph.xMin}
                    xMax={graph.xMax}
                    yMin={graph.yMin}
                    yMax={graph.yMax}
                    name={graph.title}
                    handleAnswers={() => {}}
                    answersToSet={graphAnswers[graph.title]}
                  />
                </Container>
              </Card.Body>
            </Card>
          ))}
        </Col>
        <Col>
          {graphs.filter( graph => graph.yAxis==="x-velocity").map((graph) => (
              <Card key={graph.title} className="d-flex graph-card">
                <Card.Header className="graph-card-header d-flex">
                  <Card.Title className="mr-auto">
                    {graph.title}
                  </Card.Title>
                  <span className="ml-auto justify-self-end tool-bag">
                    <i className="fas fa-tools fa-1.5x"></i>
                  </span>
                </Card.Header>
                <Card.Body className="graph-card-body">
                  <Container className="d-flex justify-content-center align-content-center">
                    <GraphComponent
                      className="bg-white"
                      ind={loading ? initialXAxis : t}
                      dep={!loading && vx}
                      xMin={graph.xMin}
                      xMax={graph.xMax}
                      yMin={graph.yMin}
                      yMax={graph.yMax}
                      name={graph.title}
                      handleAnswers={() => {}}
                      answersToSet={graphAnswers[graph.title]}
                    />
                  </Container>
                </Card.Body>
              </Card>
            ))} 
        </Col>
        <Col>
          {graphs.filter( graph => graph.yAxis==="x-acceleration").map((graph) => (
              <Card key={graph.title} className="d-flex graph-card">
                <Card.Header className="graph-card-header d-flex">
                  <Card.Title className="mr-auto">
                    {graph.title}
                  </Card.Title>
                  <span className="ml-auto justify-self-end tool-bag">
                    <i className="fas fa-tools fa-1.5x"></i>
                  </span>
                </Card.Header>
                <Card.Body className="graph-card-body">
                  <Container className="d-flex justify-content-center align-content-center">
                    <GraphComponent
                      className="bg-white"
                      ind={loading ? initialXAxis : t}
                      dep={!loading && ax}
                      xMin={graph.xMin}
                      xMax={graph.xMax}
                      yMin={graph.yMin}
                      yMax={graph.yMax}
                      name={graph.title}
                      handleAnswers={() => {}}
                      answersToSet={graphAnswers[graph.title]}
                    />
                  </Container>
                </Card.Body>
              </Card>
            ))}    
        </Col>
      </Row>
      <Row>
        <Col>
          {graphs.filter( graph => graph.yAxis==="y-position").map((graph) => (
          <Card key={graph.title} className="d-flex graph-card">
            <Card.Header className="graph-card-header d-flex">
              <Card.Title className="mr-auto">
                {graph.title}
              </Card.Title>
              <span className="ml-auto justify-self-end tool-bag">
                <i className="fas fa-tools fa-1.5x"></i>
              </span>
            </Card.Header>
            <Card.Body className="graph-card-body">
              <Container className="d-flex justify-content-center align-content-center">
                <GraphComponent
                  className="bg-white"
                  ind={loading ? initialXAxis : t}
                  dep={!loading && py}
                  xMin={graph.xMin}
                  xMax={graph.xMax}
                  yMin={graph.yMin}
                  yMax={graph.yMax}
                  name={graph.title}
                  handleAnswers={() => {}}
                  answersToSet={graphAnswers[graph.title]}
                />
              </Container>
            </Card.Body>
          </Card>
          ))}
        </Col>
        <Col>
          {graphs.filter( graph => graph.yAxis==="y-velocity").map((graph) => (
            <Card key={graph.title} className="d-flex graph-card">
              <Card.Header className="graph-card-header d-flex">
                <Card.Title className="mr-auto">
                  {graph.title}
                </Card.Title>
                <span className="ml-auto justify-self-end tool-bag">
                  <i className="fas fa-tools fa-1.5x"></i>
                </span>
              </Card.Header>
              <Card.Body className="graph-card-body">
                <Container className="d-flex justify-content-center align-content-center">
                  <GraphComponent
                    className="bg-white"
                    ind={loading ? initialXAxis : t}
                    dep={!loading && vy}
                    xMin={graph.xMin}
                    xMax={graph.xMax}
                    yMin={graph.yMin}
                    yMax={graph.yMax}
                    name={graph.title}
                    handleAnswers={() => {}}
                    answersToSet={graphAnswers[graph.title]}
                  />
                </Container>
              </Card.Body>
            </Card>
          ))}
        </Col>
        <Col>
          {graphs.filter( graph => graph.yAxis==="y-acceleration").map((graph) => (
            <Card key={graph.title} className="d-flex graph-card">
              <Card.Header className="graph-card-header d-flex">
                <Card.Title className="mr-auto">
                  {graph.title}
                </Card.Title>
                <span className="ml-auto justify-self-end tool-bag">
                  <i className="fas fa-tools fa-1.5x"></i>
                </span>
              </Card.Header>
              <Card.Body className="graph-card-body">
                <Container className="d-flex justify-content-center align-content-center">
                  <GraphComponent
                    className="bg-white"
                    ind={loading ? initialXAxis : t}
                    dep={!loading && ay}
                    xMin={graph.xMin}
                    xMax={graph.xMax}
                    yMin={graph.yMin}
                    yMax={graph.yMax}
                    name={graph.title}
                    handleAnswers={() => {}}
                    answersToSet={graphAnswers[graph.title]}
                  />
                </Container>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

// Defines a condition for ensuring that only authenticated users can
// navigate to this screen
const condition = (authUserData) => !!authUserData;

export default withFirebase(withAuthorization(condition)(SubmissionScreen));





