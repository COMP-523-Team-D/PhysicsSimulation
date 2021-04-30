import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { withFirebase } from "../Firebase";
import { Card, Col, Container, Row } from "react-bootstrap";
import { AuthUserContext, withAuthorization } from "../Session";
import * as ROUTES from "../constants/routes";
import "../App.css";

const HomeScreen = () => (
  <AuthUserContext.Consumer>
    {authUserData => <HomeScreenBase authUserData={authUserData}/>}
  </AuthUserContext.Consumer>
);

const INITIAL_STATE = {
  SIMULATIONS: []
};

class HomeBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.state.unsubscribeSimulations = null;
  }

  componentDidMount() {
    this.setState({
      unsubscribeSimulations:
        this.props.firebase.simulations()
            .onSnapshot((querySnapshot) => {
              let simulationsList = [];
              querySnapshot.forEach((doc) => {
                simulationsList.push(doc.get("Name"));
              });

              this.setState({SIMULATIONS: simulationsList});
            })
    });
  }

  componentWillUnmount() {
    this.state.unsubscribeSimulations();
  }

  render() {
    return (
          <Container>
            <Row className="m-4"> </Row>
            <Row className="my-5 d-block d-md-flex justify-content-center">
              <Col>
                <Card className="homePageCard">
                  <Card.Header className="bg-secondary">
                    <Card.Title className="homePageCardTitle">
                      <span>
                        <i className="fas fa-chart-bar fa-1.5x mr-2"></i>{" "}
                      </span>
                      Explore Simulations
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <ul className="simulationList list-unstyled">
                      {this.state.SIMULATIONS.map((simName) => (
                        <li key={simName}>
                          <Link to={ROUTES.SANDBOX_SCREEN + `/${simName.replace(/\s+/g, '_')}`} className="simulation-link">
                            {simName}
                            <br/>
                            <br/>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="homePageCard">
                  <Card.Header className="bg-secondary">
                    <Card.Title className="homePageCardTitle">
                      <span>
                        <i className="fas fa-calendar-alt fa-1.7x mr-2"></i>{" "}
                      </span>
                        My Courses
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    {this.props.authUserData["Courses"] != null
                      ?
                        (<Container fluid="md" className="class-container">
                          {this.props.authUserData["Courses"].map((course, index) => (
                            <Link to={ROUTES.COURSE_SCREEN + `/${course.replace(/\s+/g, '_')}`} key={index} className="course-link">   
                              {course}
                              <br/>
                              <br/>
                            </Link>
                          ))}
                        </Container>)
                      : (<p>You don't have any courses.</p>)
                    }
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="homePageCard">
                  <Card.Header className="bg-secondary">
                    <Card.Title className="homePageCardTitle">
                      <span>
                        <i className="fas fa-user fa-1.5x mr-2"></i>{" "}
                      </span>
                      <Link to={ROUTES.PROFILE_SCREEN + `/${this.props.authUserData["First Name"]}_${this.props.authUserData["Last Name"]}`} className="profile-link">
                        My Profile
                      </Link>
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    {/*authUserData["Courses"] != null
                      ?
                        (<Container fluid="md" className="class-container">
                          {authUserData["Courses"].map((course) => (
                            <p>{course}</p>
                          ))}
                        </Container>)
                      : (<p>You don't have any courses.</p>)
                    */}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row className="m-4"></Row>
          </Container>
    );
  }
};

const HomeScreenBase = withFirebase(HomeBase);

const condition = (authUserData) => !!authUserData;

export default withAuthorization(condition)(HomeScreen);

export { HomeScreenBase };
