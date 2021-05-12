/**
 * This React Component contains the logic and rendered content
 * for the /home route within the application.
 * 
 * Date: 05/12/2021
 * @author Ross Rucho
 * @author Gabe Foster
 * @author Molly Crown
 */

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

const INITIAL_STATE ={
  firstName: "",
  lastName: "",
  isInstructor: false,
  courses: [],
  instructors: [],
  created: new Date(),
  SIMULATIONS: []
};

class HomeBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.state.unsubscribeSimulations = null;
  }

  componentDidMount() {
    this.setState({ firstName: this.props.authUserData["First Name"] });
    this.setState({ lastName: this.props.authUserData["Last Name"] });
    this.setState({ isInstructor: this.props.authUserData["isInstructor"] });
    this.setState({ courses: this.props.authUserData["Courses"] });
    this.setState({ created: this.props.firebase.getDate(this.props.authUserData["Created"]) });
    this.props.authUserData["Instructor"] &&
      this.setState({ instructors: this.props.authUserData["Instructors"] });

    // Saves the callback function returned by the Firestore database access
    this.setState({
      unsubscribeSimulations:
        // Connects to the Firestore database using locally defined
        // API calls from Firebase/firebase.js
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
    // Calls the stored callback functions to close the database connection
    this.state.unsubscribeSimulations();
  }

  // Isolates the logic for conditionally rendering instructor
  // information if it exists
  renderInstructors() {
    return(
    !this.props.authUserData.isInstructor &&
      <div>
        <Card.Text>
          Instructors:
        </Card.Text>
        {this.props.authUserData["Instructors"].map((instructor, index) => (
          <Card.Text className="d-flex justify-content-center" key={index}>
            {instructor}
          </Card.Text>
        ))}
      </div>
    );
  }

  render() {
    const{
      firstName,
      lastName,
      courses,
      created,
      isInstructor
    } = this.state;

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
                        My Profile
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Card.Text>
                      {`Name: ${firstName} ${lastName}`}
                    </Card.Text>

                    {this.renderInstructors()}                   

                    <Card.Text>
                        Courses:
                    </Card.Text>
                    {courses.map((course, index) => (
                      <Card.Text className="d-flex justify-content-center" key={index}>
                        {course}
                      </Card.Text>
                    ))}

                    <Card.Text>
                      {isInstructor ? "User Type: Instructor": "User Type: Student"}
                    </Card.Text>
                    <Card.Text>
                      {`Profile Created: ${created}`}
                    </Card.Text>
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

// Defines a condition for ensuring that only authenticated users can
// navigate to this screen
const condition = (authUserData) => !!authUserData;

export default withAuthorization(condition)(HomeScreen);

export { HomeScreenBase };
