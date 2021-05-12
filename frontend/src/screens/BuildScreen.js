/**
 * This React Component contains the logic and rendered content
 * for the /build/:courseName route within the application.
 * 
 * Date: 05/12/2021
 * @author Ross Rucho
 * @author Gabe Foster
 * @author Molly Crown
 */

import React, { Component } from "react";
import DatePicker from "react-datepicker";
import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../constants/routes";
import { AuthUserContext, withAuthorization } from "../Session";
import { Button, Card, Col, Container, Row, Form } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import Assignment from "../components/Assignment";
import Problem from "../components/Problem";

const BuildScreen = () => (
  <AuthUserContext.Consumer>
    {(authUserData) => <BuildForm authUserData={authUserData} />}
  </AuthUserContext.Consumer>
);

const INITIAL_STATE = {
  index: 0,
  assignment: new Assignment(),
  PROBLEMS_MAX_NUM: 20,
  QUESTIONS_MAX_NUM: 5,
  GRAPHS_MAX_NUM: 6,
  SIMULATIONS: [],
  GRAPH_OPTIONS: [
    "X-Position vs Time",
    "Y-Position vs Time",
    "X-Velocity vs Time",
    "Y-Velocity vs Time",
    "X-Acceleration vs Time",
    "Y-Acceleration vs Time",
  ],
};

class BuildFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.onForwardClick = this.onForwardClick.bind(this);
    this.onBackwardClick = this.onBackwardClick.bind(this);

    this.state.unsubscribeSimulations = null;
  }

  componentDidMount() {
    // Course Name
    this.state.assignment.courseName = this.props.match.params.courseName.replace(/_+/g, " ");

    // Instructor Name
    this.state.assignment.creator = `${this.props.authUserData["First Name"]} ${this.props.authUserData["Last Name"]}`;

    // Assignment Number
    this.state.assignment.assignmentNumber =
      this.props.location.state.assignmentIndex + 1;

    // Assignment Name
    this.state.assignment.assignmentName = `Assignment ${
      this.props.location.state.assignmentIndex + 1
    }`;

    // Initialize simulation window listener
    window.addEventListener("message", this.updateParameters, false);

    // Saves the callback function returned by the Firestore database access
    this.setState({
      unsubscribeSimulations:
        // Connects to the Firestore database using locally defined
        // API calls from Firebase/firebase.js
        this.props.firebase.simulations()
          .onSnapshot((querySnapshot) => {
          let simulationsList = [];
          querySnapshot.forEach((doc) => {
            // Build screen only supports the Projectile Motion simulation
            if (doc.data()["Name"] === "Projectile Motion") {
              simulationsList.push(doc.data());
            }
          });

          this.setState({ SIMULATIONS: simulationsList });
        }),
    });
  }

  componentWillUnmount() {
    // Removes any recorded state to ensure that the page is blank on refresh
    this.state.assignment.problems.length = 0;
    this.setState({ ...INITIAL_STATE });
    window.removeEventListener("message", this.updateParameters);

    // Calls the stored callback functions to close the database connection
    this.state.unsubscribeSimulations();
  }

  /*
   * Beginning of onChange & onSubmit Functions
   */

  // Isolates the logic for the forward click arrow
  onForwardClick() {
    this.setState({
      index:
        this.state.index < this.state.assignment.problems.length
          ? this.state.index + 1
          : this.state.index,
    });
  }

  // Isolates the logic for the backward click arrow
  onBackwardClick() {
    this.setState({
      index: this.state.index > 0 ? this.state.index - 1 : this.state.index,
    });
  }

  // Isolates the logic for the release date input structure
  // Ensures that the release date must be earlier than the close date
  onReleaseDateChange = (date) => {
    if (
      JSON.stringify(date) <= JSON.stringify(this.state.assignment.closeDate)
    ) {
      this.state.assignment.releaseDate = date;
      this.forceUpdate();
    }
  };

  // Isolates the logic for the close date input structure
  // Ensures that the close date must be later than the release date
  onCloseDateChange = (date) => {
    if (
      JSON.stringify(this.state.assignment.releaseDate) <= JSON.stringify(date)
    ) {
      this.state.assignment.closeDate = date;
      this.forceUpdate();
    }
  };

  // Isolates the logic for user provided problem number input field
  onProblemNumberChange = (event) => {
    let newProblemsArray = [];
    for (let i = 0; i < event.target.value; i++) {
      if (i < this.state.assignment.problems.length) {
        newProblemsArray.push(this.state.assignment.problems[i]);
      } else {
        newProblemsArray.push(new Problem(i + 1));
      }
    }

    this.state.assignment.problems = newProblemsArray;
    this.forceUpdate();
  };

  // Isolates the logic for the user provided question number input field
  onQuestionNumberChange = (event) => {
    const currentProblem = this.state.assignment.problems[this.state.index - 1];

    let newQuestionsArray = [];
    for (let i = 0; i < event.target.value; i++) {
      if (i < currentProblem.questions.length) {
        newQuestionsArray.push(currentProblem.questions[i]);
      } else {
        newQuestionsArray.push("");
      }
    }

    currentProblem.questions = newQuestionsArray;
    this.forceUpdate();
  };

  // Isolates the logic for the user provided graph number input field
  onGraphNumberChange = (event) => {
    const currentProblem = this.state.assignment.problems[this.state.index - 1];

    let newGraphsArray = [];
    for (let i = 0; i < event.target.value; i++) {
      if (i < currentProblem.graphs.length) {
        newGraphsArray.push(currentProblem.graphs[i]);
      } else {
        newGraphsArray.push({
          title: "",
          yAxis: "",
          xAxis: "time",
          xMax: NaN,
          xMin: NaN,
          yMax: NaN,
          yMin: NaN,
        });
      }
    }

    currentProblem.graphs = newGraphsArray;
    this.forceUpdate();
  };

  // Isolates the logic for updating the user provided question content input fields
  onQuestionChange = (event) => {
    const currentProblem = this.state.assignment.problems[this.state.index - 1];
    currentProblem.questions[event.target.name] = event.target.value;
    this.forceUpdate();
  };

  // Isolates the logic for updating the user provided graph content input fields
  onGraphChange = (event) => {
    const currentGraph = this.state.assignment.problems[this.state.index - 1]
      .graphs[parseInt(event.target.name)];
    currentGraph["title"] = event.target.value;
    switch (event.target.value) {
      case "X-Position vs Time":
        currentGraph["yAxis"] = "x-position";
        break;

      case "Y-Position vs Time":
        currentGraph["yAxis"] = "y-position";
        break;

      case "X-Velocity vs Time":
        currentGraph["yAxis"] = "x-velocity";
        break;

      case "Y-Velocity vs Time":
        currentGraph["yAxis"] = "y-velocity";
        break;

      case "X-Acceleration vs Time":
        currentGraph["yAxis"] = "x-acceleration";
        break;

      case "Y-Acceleration vs Time":
        currentGraph["yAxis"] = "y-acceleration";
        break;

      default:
        currentGraph["yAxis"] = "";
    }
    this.forceUpdate();
  };

  // Isolates the logic for the user provided simulation input field
  onSimulationChange = (event) => {
    const currentProblem = this.state.assignment.problems[this.state.index - 1];
    if (event.target.value !== "") {
      currentProblem.simulation = this.state.SIMULATIONS.find(
        (simulation) => simulation["Name"] === event.target.value
      );
      this.state.SIMULATIONS.find(
        (simulation) => simulation["Name"] === event.target.value
      )["Parameters"].forEach((parameter) => {
        currentProblem.parameters[parameter] = NaN;
        currentProblem.parameters[`${parameter}Fixed`] = false;
      });
    } else {
      currentProblem.simulation = {
        Name: "",
        Source: "",
        Parameters: [],
      };
      currentProblem.parameters = {};
    }

    this.forceUpdate();
  };

  // Isolates the logic for the user provided fixed parameters check boxes
  onParameterFixChange = (event) => {
    const currentProblem = this.state.assignment.problems[this.state.index - 1];
    currentProblem.parameters[`${event.target.name}Fixed`] = !currentProblem.parameters[`${event.target.name}Fixed`];
    this.forceUpdate();
  };

  // Communicates with the PhET simulation to acquire the simulation's current parameters
  onParameterValueChange = (event) => {
    document.getElementById("Simulation Frame").contentWindow.postMessage("Request Parameters", "*");
  };

  // Isolates the logic for updating the simulation parameter configuration data
  // after receiving the simulation's current parameters from the PhET simulation
  updateParameters = (event) => {
    if (event.data["check"] && event.data["check"] === "Parameters Requested") {
      const currentProblem = this.state.assignment.problems[this.state.index - 1];

      currentProblem.simulation["Parameters"].forEach((parameter) => {
        if (currentProblem.parameters[`${parameter}Fixed`]) {
          currentProblem.parameters[parameter] = event.data[parameter];
        }else {
          currentProblem.parameters[parameter] = NaN;
        }
      });
    }
    this.forceUpdate();
  };

  /*
   * Helper functions to compute maximum and minimum
   * values to set the scale for each type of graph
   * within Projectile Motion. Each equation was
   * derived from the structure of the projectile
   * motion simulation.
   */
  computeMaxTime = (angle, speed, height, gravity) => {
    return Math.ceil(
      (1 / gravity) *
        (Math.sin(Math.PI * (angle / 180)) * speed +
          Math.sqrt(
            Math.pow(Math.sin(Math.PI * (angle / 180)) * speed, 2) +
              4 * gravity * height
          ))
    );
  };
  computeMaxXposition = (angle, speed, height, gravity) => {
    return Math.ceil(
      Math.cos(Math.PI * (angle / 180)) *
        speed *
        this.computeMaxTime(angle, speed, height, gravity)
    );
  };
  computeMaxYposition = (angle, speed, height, gravity) => {
    return Math.sin(Math.PI * (angle / 180)) > 0
      ? Math.ceil(
          height +
            Math.pow(Math.sin(Math.PI * (angle / 180)) * speed, 2) /
              (2 * gravity)
        )
      : height;
  };
  computeXvelocity = (angle, speed) => {
    return Math.ceil(Math.cos(Math.PI * (angle / 180)) * speed);
  };
  computeMaxYvelocity = (angle, speed) => {
    return Math.sin(Math.PI * (angle / 180)) > 0
      ? Math.ceil(Math.sin(Math.PI * (angle / 180)) * speed)
      : 0;
  };
  computeMinYvelocity = (angle, speed, height, gravity) => {
    return -Math.ceil(
      Math.sqrt(
        Math.pow(Math.sin(Math.PI * (angle / 180)) * speed, 2) +
          4 * gravity * height
      )
    );
  };

  /*
   * Helper function to set the scale for each type of graph
   * within Projectile Motion. All values or computations performed
   * here were derived from the structure of the projectile motion
   * simulation.
   * Speed is in m/s
   * Height is in m
   * Angle is in degrees
   */
  updateProjectileMotionAxes = (problem) => {
    const MAX_SPEED = 30;
    const MAX_HEIGHT = 15;
    const gravity = 9.807;
    const angle = problem.parameters.angleFixed ? problem.parameters.angle : 90;
    const speed = problem.parameters.velocityFixed
      ? problem.parameters.velocity
      : MAX_SPEED;
    const height = problem.parameters.heightFixed
      ? problem.parameters.height
      : MAX_HEIGHT;

    problem.graphs.forEach((graph) => {
      switch (graph.title) {
        case "X-Position vs Time":
          // Special angle derived from kinematics equations to maximize the x-position
          const anglePosition = problem.parameters.angleFixed
            ? problem.parameters.angle
            : 45;

          graph.xMin = 0;
          graph.xMax = this.computeMaxTime(angle, speed, height, gravity);
          graph.yMin = 0;
          graph.yMax = this.computeMaxXposition(
            anglePosition,
            speed,
            height,
            gravity
          );

          break;

        case "Y-Position vs Time":
          graph.xMin = 0;
          graph.xMax = this.computeMaxTime(angle, speed, height, gravity);
          graph.yMin = 0;
          graph.yMax = this.computeMaxYposition(angle, speed, height, gravity);

          break;

        case "X-Velocity vs Time":
          // Special angle derived from kinematics equations to maximize the x-velocity
          const angleVelocity = problem.parameters.angleFixed
            ? problem.parameters.angle
            : 0;
          const xVelocity = this.computeXvelocity(
            angleVelocity,
            speed,
            height,
            gravity
          );

          graph.xMin = 0;
          graph.xMax = this.computeMaxTime(angle, speed, height, gravity);
          graph.yMin = 0;
          graph.yMax = xVelocity + 5; // 5 added for a buffer on the top of the graph

          break;

        case "Y-Velocity vs Time":
          graph.xMin = 0;
          graph.xMax = this.computeMaxTime(angle, speed, height, gravity);
          graph.yMin = this.computeMinYvelocity(angle, speed, height, gravity);
          graph.yMax = this.computeMaxYvelocity(angle, speed);

          break;

        case "X-Acceleration vs Time":
          graph.xMin = 0;
          graph.xMax = this.computeMaxTime(angle, speed, height, gravity);
          graph.yMin = -15; // - 15 for a buffer around 0
          graph.yMax = 15; // 15 for a buffer around 0

          break;

        case "Y-Acceleration vs Time":
          graph.xMin = 0;
          graph.xMax = this.computeMaxTime(angle, speed, height, gravity);
          graph.yMin = -15; // - 15 for a buffer around -9.807
          graph.yMax = 15; // 15 for a buffer around the incorrect answer of 9.807

          break;

        default:
          break;
      }
    });
  };

  onSubmit = (event) => {
    event.preventDefault();

    /*
     * Calculate the x-axis and y-axis scale for each graph
     * in each problem based on the chosen simulation and the
     * fixed parameters.
     * Only Projectile Motion is supported at this time.
     */
    this.state.assignment.problems.forEach((problem) => {
      switch (problem.simulation["Name"]) {
        case "Projectile Motion":
          this.updateProjectileMotionAxes(problem);
          break;

        default:
          break;
      }
    });

    const course = this.state.assignment.courseName;
    const finishedAssignment = this.state.assignment.convert();
    finishedAssignment["Created"] = this.props.firebase.getTimestamp();

    // Connects to the Firestore database using locally defined
    // API calls from Firebase/firebase.js
    this.props.firebase
      .doCreateNewAssignment()
      .set(finishedAssignment)
      .then(() => {
        this.props.history.push(
          ROUTES.COURSE_SCREEN + `/${course.replace(/\s+/g, "_")}`
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /*
   * Beginning of Conditional Rendering Logic!
   */

  // Conditionally renders the correct parameter label
  selectLabel(label) {
    switch (label) {
      case "height":
        return "Cannon Height";

      case "angle":
        return "Cannon Angle";

      case "velocity":
        return "Initial Speed";

      default:
        return "";
    }
  }

  // Conditionally renders the correct header
  selectHeader(index) {
    switch (index) {
      case 0:
        return "Assignment Details";

      default:
        return `Problem ${index}`;
    }
  }

  // Conditionally renders the correct simulation and parameters associated
  // with the given problem index.
  conditionallyRenderSimulation(index) {
    if (
      index > 0 &&
      this.state.assignment.problems[index - 1].simulation["Name"] !== ""
    ) {
      return (
        <Container className="d-flex justify-content-center">
          <Col>
            <Row className="d-flex justify-content-center">
              <h3>Configure the Simulation to Fix Parameters</h3>
            </Row>
            <Row className="my-4">
              <Container className="d-flex justify-content-center">
                <iframe
                  id="Simulation Frame"
                  src={
                    this.state.assignment.problems[index - 1].simulation[
                      "Source"
                    ]
                  }
                  className="phet-sim-preview align-self-center"
                  scrolling="no"
                  allowFullScreen
                  title={
                    this.state.assignment.problems[index - 1].simulation["Name"]
                  }
                ></iframe>
                <Form.Group as={Col}>
                  <Form.Label>Choose the Parameters to Fix</Form.Label>
                  {this.state.assignment.problems[index - 1].simulation[
                    "Parameters"
                  ].map((parameter, localIndex) => (
                    <div key={localIndex} className="mb-3">
                      <Form.Check
                        name={parameter}
                        checked={
                          this.state.assignment.problems[index - 1].parameters[
                            `${parameter}Fixed`
                          ]
                        }
                        type={"checkbox"} 
                        label={`${this.selectLabel(parameter)}: ${
                          ( !!(this.state.assignment.problems[index - 1].parameters[parameter]) ? this.state.assignment.problems[index - 1].parameters[parameter] : "")
                        }`}
                        onChange={this.onParameterFixChange}
                      />
                    </div>
                  ))}
                </Form.Group>
              </Container>
            </Row>
            <Row className="d-flex justify-content-center">
              <Button
                className="bg-secondary"
                variant="primary"
                onClick={this.onParameterValueChange}
              >
                Save Parameter Choices
              </Button>
            </Row>
          </Col>
        </Container>
      );
    } else {
      return (
        <Container className="d-flex justify-content-center">
          <h2 className="display-4 text-center phet-sim-preview-alt my-5">
            Select a Simulation To Preview
          </h2>
        </Container>
      );
    }
  }

  // Conditionally renders the assignment details view of the build screen
  // or the correct problem content as specified by the given index
  conditionallyRenderPage(index) {
    if (index === 0) {
      return (
        <Col className="mx-3 d-flex flex-column justify-content-center">
          <Form.Group controlId="formGridCourseName">
            <Form.Label className="p-1">Course Name</Form.Label>
            <Form.Control
              readOnly
              type="text"
              placeholder={this.state.assignment.courseName}
            />
          </Form.Group>
          <Form.Group controlId="formGridAssignmentName">
            <Form.Label className="p-1">Assignment Name</Form.Label>
            <Form.Control
              readOnly
              type="text"
              placeholder={this.state.assignment.assignmentName}
            />
          </Form.Group>
          <Row className=" d-flex justify-content-center justify-content-lg-around">
            <Form.Group
              className="d-flex flex-column mx-2"
              controlId="formGridReleaseDate"
            >
              <Form.Label>Assignment Release Date</Form.Label>
              <DatePicker
                popperPlacement="end"
                selected={this.state.assignment.releaseDate}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                onChange={this.onReleaseDateChange}
              />
            </Form.Group>
            <Form.Group
              className="d-flex flex-column mx-2"
              controlId="formGridCloseDate"
            >
              <Form.Label>Assignment Close Date</Form.Label>
              <DatePicker
                className="build-date-picker"
                popperPlacement="end"
                selected={this.state.assignment.closeDate}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                onChange={this.onCloseDateChange}
              />
            </Form.Group>
          </Row>

          <br/>

          <Row className="mx-3 d-flex justify-content-center">
            <h4>
              Use the arrow buttons in the "Assignment Details" header to customize problems!
            </h4>
          </Row>
          <Form.Group controlId="formGridProblemNumber">
            <Form.Label>Number of Problems in Assignment</Form.Label>
            <Form.Control
              name="problemNumber"
              as="select"
              value={this.state.assignment.problems.length}
              onChange={this.onProblemNumberChange}
            >
              <option key={0}>0</option>
              {Array.from(
                { length: this.state.PROBLEMS_MAX_NUM },
                (_, localIndex) => localIndex + 1
              ).map((localIndex) => (
                <option key={localIndex}>{localIndex}</option>
              ))}
            </Form.Control>
          </Form.Group>
          
          <br/>

          <Row className="mx-3 d-flex justify-content-center">
            <h6>
              At least one problem must contain content before the assignment can be submitted.
            </h6>
          </Row>

          <Button 
            disabled={ 
              this.state.assignment.problems.length === 0
              || !(
                this.state.assignment.problems[0].simulation.Name !== ""
                ||this.state.assignment.problems[0].graphs === []
                || this.state.assignment.problems[0].questions === []
              )
            }
            className="mt-3 bg-secondary"
            variant="primary"
            type="submit"
            
          >
            Create Assignment!
          </Button>

          

        </Col>
      );
    } else {
      return (
        <Container className="d-flex align-contents-center build-sim-card-1">
          <Col>
            <Row className="my-4">
              <Col>
                <Form.Group className="sim-box-select" controlId="simSelect">
                  <Form.Control
                    as="select"
                    value={
                      this.state.assignment.problems[index - 1].simulation[
                        "Name"
                      ]
                    }
                    onChange={this.onSimulationChange}
                  >
                    <option key="empty" value=""></option>
                    {this.state.SIMULATIONS.map((sim, localIndex) => (
                      <option key={localIndex} value={sim.Name}>
                        {sim.Name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row className="d-flex align-self-end mt-4">
              {this.conditionallyRenderSimulation(index)}
            </Row>
            <Row className="my-4">
              <Col>
                <Form.Group controlId="formGridQuestionNumber">
                  <Form.Label>Number of Questions in Problem</Form.Label>
                  <Form.Control
                    as="select"
                    value={
                      this.state.assignment.problems[index - 1].questions.length
                    }
                    onChange={this.onQuestionNumberChange}
                  >
                    <option key={0}>0</option>
                    {Array.from(
                      { length: this.state.QUESTIONS_MAX_NUM },
                      (_, localIndex) => localIndex + 1
                    ).map((localIndex) => (
                      <option key={localIndex}>{localIndex}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row className="my-4">
              <Col>
                {this.state.assignment.problems[index - 1].questions.map(
                  (question, localIndex) => (
                    <Form.Group
                      key={localIndex}
                      controlId="FormGridControlTextArea"
                    >
                      <Form.Label>Question {localIndex + 1}</Form.Label>
                      <Form.Control
                        name={localIndex}
                        as="textarea"
                        rows={3}
                        value={question}
                        onChange={this.onQuestionChange}
                      />
                    </Form.Group>
                  )
                )}
              </Col>
            </Row>
            <Row className="my-4">
              <Col>
                <Form.Group controlId="formGridGraphNumber">
                  <Form.Label>Number of Graphs in Problem</Form.Label>
                  <Form.Control
                    as="select"
                    value={
                      this.state.assignment.problems[index - 1].graphs.length
                    }
                    onChange={this.onGraphNumberChange}
                  >
                    <option key={0}>0</option>
                    {Array.from(
                      { length: this.state.GRAPHS_MAX_NUM },
                      (_, localIndex) => localIndex + 1
                    ).map((localIndex) => (
                      <option key={localIndex}>{localIndex}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row className="my-4">
              <Col>
                {this.state.assignment.problems[index - 1].graphs.map(
                  (graph, localIndex) => (
                    <Form.Group
                      key={localIndex}
                      controlId="FormGridGraphOptions"
                    >
                      <Form.Label>
                        Graph {localIndex + 1}: Select Content
                      </Form.Label>
                      <Form.Control
                        name={localIndex}
                        as="select"
                        value={graph["title"]}
                        onChange={this.onGraphChange}
                      >
                        <option key=""></option>
                        {this.state.GRAPH_OPTIONS.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  )
                )}
              </Col>
            </Row>
          </Col>
        </Container>
      );
    }
  }

  render() {
    const { index } = this.state;

    return (
      <Container className="build-container mb-4">
        <Card className="d-flex align-self-center build-card mx-auto">
          <Card.Header>
            <Container className="d-flex align-content-center">
              <span className="mr-auto">
                <button
                  type="button"
                  className="btn btn-outline scroll-btn"
                  onClick={this.onBackwardClick}
                >
                  <i className="fas fa-angle-left"></i>
                </button>
              </span>
              <Card.Title className="mt-1 d-flex justify-self-center align-self-center text-center">
                {this.selectHeader(index)}
              </Card.Title>
              <span className="ml-auto">
                <button
                  type="button"
                  className="btn btn-outline scroll-btn"
                  onClick={this.onForwardClick}
                >
                  <i className="fas fa-angle-right"></i>
                </button>
              </span>
            </Container>
          </Card.Header>
          <Card.Body className="build-card-body">
            <Form onSubmit={this.onSubmit}>
              {this.conditionallyRenderPage(index)}
            </Form>
          </Card.Body>
        </Card>
      </Container>
    );
  }
}

const BuildForm = withRouter(withFirebase(BuildFormBase));

// Defines a condition for ensuring that only authenticated users can
// navigate to this screen
const condition = (authUserData) => !!authUserData;

export default withAuthorization(condition)(BuildScreen);

export { BuildForm };
