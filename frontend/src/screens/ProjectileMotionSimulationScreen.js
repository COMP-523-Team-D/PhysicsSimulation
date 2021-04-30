import { Card, Col, Container, Row } from "react-bootstrap";
import { useState, useEffect } from "react";
import QandA from "../components/QandA";
import SimulationContainerComponent from "../components/SimulationContainerComponent";
import GraphComponent from "../components/GraphComponent";

const ProjectileMotionSimulationScreen = ({ data, assignment }) => {
  const { questions } = assignment;
  const [qIndex, setqIndex] = useState(1);

  // Update this state (add 1) whenever we have new parameters for the simulation.
  // This will alert the iframe that it needs to refresh.
  const [reloadIframe, setReloadIframe] = useState(0);

  const { simulation } = assignment;
  const { simName, simSrcPath } = simulation;

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

  // Parse simulation data into the correct arrays
  const handleNewPoint = function (e) {
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

  // Dummy simulation parameters to fix
  const fixedVariables = {
    height: 5,
    velocity: 15,
    angle: 45,
  };
  // TODO : Replace with a real database query
  const getParameters = () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(fixedVariables), 1000);
    });
  };

  // Sets up the communication between the frontend and the simulation
  // when the screen is initially rendered.
  useEffect(() => {
    // Listen for information about cannon fires
    window.addEventListener("message", handleNewPoint);

    // Send fixed parameters to the simulation (if any),
    // and then alert the iframe that it needs to refresh.
    getParameters().then(function (params) {
      window.sessionStorage.setItem("fixedVariables", JSON.stringify(params));
      setReloadIframe(reloadIframe + 1);
    });

    return function cleanup() {
      window.removeEventListener("message", handleNewPoint);
    };
  }, []);

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
                  reloadFlag={reloadIframe}
                  simName={simName}
                  simSrcPath={simSrcPath}
                />
              </Col>
            </Row>
            <Row className="my-5 justify-content-center mt-5 graph-container d-md-flex d-none ">
              <Col className="graph my-5">
                <Card className="d-flex graph-card">
                  <Card.Header className="graph-card-header d-flex">
                    <Card.Title className="mr-auto card-title">
                      T vs Position X
                    </Card.Title>
                  </Card.Header>
                  <Card.Body className="graph-card-body">
                    <Container className="d-flex justify-content-center align-content-center">
                      <GraphComponent
                        className="bg-white"
                        xMin={0.0}
                        xMax={7}
                        yMin={0.0}
                        yMax={30}
                        ind={loading ? initialXAxis : t}
                        dep={!loading && px}
                      />
                    </Container>
                  </Card.Body>
                </Card>
              </Col>
              <Col className="graph my-5">
                <Card className="d-flex graph-card">
                  <Card.Header className="graph-card-header d-flex">
                    <Card.Title className="mr-auto card-title">
                      Time vs. PositionY
                    </Card.Title>
                  </Card.Header>
                  <Card.Body className="graph-card-body">
                    <Container className="d-flex justify-content-center align-content-center">
                      <GraphComponent
                        className="bg-white"
                        ind={!loading && t}
                        dep={!loading && py}
                      />
                    </Container>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row className="my-5 justify-content-center mt-5 graph-container d-md-flex d-none ">
              <Col className="graph my-5">
                <Card className="d-flex graph-card">
                  <Card.Header className="graph-card-header d-flex">
                    <Card.Title className="mr-auto card-title">
                      Time vs Velocity X
                    </Card.Title>
                  </Card.Header>
                  <Card.Body className="graph-card-body">
                    <Container className="d-flex justify-content-center align-content-center">
                      <GraphComponent
                        className="bg-white graphComponent"
                        ind={!loading && t}
                        dep={!loading && vx}
                      />
                    </Container>
                  </Card.Body>
                </Card>
              </Col>
              <Col className="graph my-5">
                <Card className="d-flex graph-card">
                  <Card.Header className="graph-card-header d-flex">
                    <Card.Title className="mr-auto card-title">
                      Time vs. Y Velocity
                    </Card.Title>
                  </Card.Header>
                  <Card.Body className="graph-card-body">
                    <Container className="d-flex justify-content-center align-content-center">
                      <GraphComponent
                        className="bg-white"
                        ind={!loading && t}
                        dep={!loading && vy}
                      />
                    </Container>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="my-5 d-md-none d-xs-flex flex-xs-row">
              <Col className="graph my-5">
                <Card className="d-flex graph-card">
                  <Card.Header className="graph-card-header d-flex">
                    <Card.Title className="mr-auto card-title">
                      Position vs Time
                    </Card.Title>
                  </Card.Header>
                  <Card.Body className="graph-card-body">
                    <Container className="d-flex justify-content-center align-content-center">
                      <GraphComponent
                        className="bg-white"
                        ind={!loading && t}
                        dep={!loading && py}
                      />
                    </Container>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row className="my-5 d-md-none d-xs-flex flex-xs-row">
              <Col className="graph my-5">
                <Card className="d-flex graph-card">
                  <Card.Header className="graph-card-header d-flex">
                    <Card.Title className="mr-auto card-title">
                      Time vs PositionY
                    </Card.Title>
                  </Card.Header>
                  <Card.Body className="graph-card-body">
                    <Container className="d-flex justify-content-center align-content-center">
                      <GraphComponent
                        className="bg-white"
                        ind={!loading && t}
                        dep={!loading && px}
                      />
                    </Container>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row className="my-5 d-md-none d-xs-flex flex-xs-row">
              <Col className="graph my-5">
                <Card className="d-flex graph-card">
                  <Card.Header className="graph-card-header d-flex">
                    <Card.Title className="mr-auto card-title">
                      Time vs PositionX
                    </Card.Title>
                  </Card.Header>
                  <Card.Body className="graph-card-body">
                    <Container className="d-flex justify-content-center align-content-center">
                      <GraphComponent
                        className="bg-white"
                        ind={!loading && t}
                        dep={!loading && px}
                      />
                    </Container>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row className="my-5 d-md-none d-xs-flex flex-xs-row">
              <Col className="graph my-5">
                <Card className="d-flex align-content-center graph-card">
                  <Card.Header className="graph-card-header d-flex">
                    <Card.Title className="mr-auto card-title">
                      Time vs Y Velocity
                    </Card.Title>
                  </Card.Header>
                  <Card.Body className="graph-card-body">
                    <Container className="d-flex justify-content-center align-content-center">
                      <GraphComponent
                        className="bg-white"
                        ind={!loading && t}
                        dep={!loading && px}
                      />
                    </Container>
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
                      (qIndex === 1 ? " disabled" : " not-disabled")
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
                      (qIndex === questions.length
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
                      (qIndex === 1 ? " disabled" : " not-disabled")
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
                      (qIndex === questions.length
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

export default ProjectileMotionSimulationScreen;
