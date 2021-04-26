import React, { Component } from "react";
import DatePicker from 'react-datepicker';
import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";
import { AuthUserContext, withAuthorization } from "../Session";
import { Button, Card, Col, Container, Row, Form } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";

const BuildScreen = () => <BuildForm/>;

const INITIAL_STATE = {
  index: 0,
  courseName: "",
  assignmentName: "",
  openDate: new Date(),
  closeDate: new Date(),
  problems: [],
  selectedSimulation: null,
  SIMULATIONS: []
};

class BuildFormBase extends Component{
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.onForwardClick = this.onForwardClick.bind(this);
    this.onBackwardClick = this.onBackwardClick.bind(this);

    this.state.unsubscribeSimulations = null;
  }

  componentDidMount() {
    // Course Name
    this.setState({courseName: this.props.match.params.courseName.replace(/_+/g, ' ') });

    // Simulation database access
    this.setState({
      unsubscribeSimulations:
        this.props.firebase.simulations()
            .onSnapshot((querySnapshot) => {
              let simulationsList = [];
              querySnapshot.forEach((doc) => {
                simulationsList.push(doc.data());
              });

              this.setState({SIMULATIONS: simulationsList});
            })
    });
  }

  componentWillUnmount() {
    this.state.unsubscribeSimulations();
  }

  onForwardClick() {
    this.setState({
      index: (this.state.index <= 2) ? this.state.index + 1 : this.state.index
    });
  }

  onBackwardClick() {
    this.setState({
      index: (this.state.index >= 1) ? this.state.index - 1 : this.state.index
    });
  }

  onAssignmentChange = event => {
    this.setState({[event.target.name]: event.target.value});
  }

  onOpenDateChange = date => {
      this.setState({openDate: date});
  }

  onCloseDateChange = date => {
    this.setState({closeDate: date});
  }

  onSubmit = event => {

    event.preventDefault();
  }

  onSimulationChange = event => {
    this.setState({
      selectedSimulation:
        this.state.SIMULATIONS.find((simulation) => simulation["Name"] === event.target.value)
    });
  }

  selectHeader(index) {
    switch(index) {
      case 0:
        return `${this.state.courseName}: Assignment Details`;
        break;

      case 1:
        return "Choose Your Simulation";
        break;

      case 2:
        return "Select and Set Initial Variables";
        break;

      default:
        return "";
    }
  }

  render() {
    const {
      index,
      assignmentName,
      openDate,
      closeDate
    } = this.state;

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
            {/* Page 0: Assignment Details */}
            <Container
              className={
                index === 0
                  ? "d-flex align-contents-center build-sim-card-1"
                  : "build-sim-card-1 d-none"
              }
            >
              <Form>
                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridFirstName">
                      <Form.Label>Assignment Name</Form.Label>
                      <Form.Control
                        name="assignmentName"
                        value={assignmentName}
                        type="text"
                        placeholder="Assignment 1"
                        onChange={this.onAssignmentChange}
                      />
                    </Form.Group>
                  </Form.Row>

                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridOpenDate">
                      <Form.Label>Assignment Open Date</Form.Label>
                      <DatePicker
                        selected={openDate}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={30}
                        timeCaption="Time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        onChange={this.onOpenDateChange}
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridCloseDate">
                      <Form.Label>Assignment Close Date</Form.Label>
                      <DatePicker
                        selected={closeDate}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={30}
                        timeCaption="Time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        onChange={this.onCloseDateChange}
                      />
                    </Form.Group>
                  </Form.Row>

                  <Button
                    className="register-button bg-secondary"
                    variant="primary"
                    type="submit"
                  >
                   Create Assignment!
                  </Button>

                </Form>
            </Container>
            {/* Page 1: Select Simulation */}
            <Container
              className={
                index === 1
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
                  <Col className="d-flex justify-content-center">
                    {(this.state.selectedSimulation && (
                      <iframe
                        src={this.state.selectedSimulation["Source"]}
                        className="phet-sim-preview align-self-center"
                        scrolling="no"
                        allowFullScreen
                        title={this.state.selectedSimulation["Name"]}
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
                index === 2
                  ? "d-flex align-contents-center build-sim-card-1"
                  : "build-sim-card-1 d-none"
              }
            >
              <Col className="my-2 ">
                <Row className="my-5">
                  <Col>
                    {/*selectedSim[0]?.Variables.map((v) => (
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
                    ))*/}
                  </Col>
                </Row>
              </Col>
            </Container>
          </Card.Body>
        </Card>
      </Container>
    );
  }
};

const BuildForm = withRouter(withFirebase(BuildFormBase));

const condition = (authUserData) => !!authUserData;

export default withAuthorization(condition)(BuildScreen);

export { BuildForm };
