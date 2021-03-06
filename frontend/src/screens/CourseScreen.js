/**
 * This React Component contains the logic and rendered content
 * for the /course/:courseName routes within the application.
 * 
 * Date: 05/12/2021
 * @author Ross Rucho
 * @author Gabe Foster
 * @author Molly Crown
 */

import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { withFirebase } from "../Firebase";
import { AuthUserContext, withAuthorization } from "../Session";
import { Container } from "react-bootstrap";
import * as ROUTES from "../constants/routes";
import { Card, Row, Col, Button } from "react-bootstrap";

const CourseScreen = () => (
  <AuthUserContext.Consumer>
  {authUserData => <CourseScreenBase authUserData={authUserData}/>}
  </AuthUserContext.Consumer>
);

const INITIAL_STATE = {
  courseName: "",
  courseCode: "",
  assignments: []
};

class CourseBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.state.unsubscribeCourse = null;
    this.state.unsubscribeAssignments = null;
  }

  componentDidMount() {
    const courseName = this.props.match.params.courseName.replace(/_+/g, ' ');
    this.setState({courseName: courseName});

    // Saves the callback function returned by the Firestore database access
    this.setState({
      unsubscribeCourse:
        // Connects to the Firestore database using locally defined
        // API calls from Firebase/firebase.js
        this.props.firebase.course(courseName)
            .onSnapshot((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                this.setState({courseCode: doc.get("Code")});
              });
            })
    });

    // Saves the callback function returned by the Firestore database access
    this.setState({
      unsubscribeAssignments:
        // Connects to the Firestore database using locally defined
        // API calls from Firebase/firebase.js
        this.props.firebase.assignments(courseName)
            .onSnapshot((querySnapshot) => {
              let assignmentList = [];
              querySnapshot.forEach((doc) => {
                assignmentList.push(doc.data());
              });

              this.setState({assignments: assignmentList.reverse()});
            })
    });
  }

  componentWillUnmount() {
    // Calls the stored callback functions to close the database connection
    this.state.unsubscribeCourse();
    this.state.unsubscribeAssignments();
  }

  render() {
    return (
          <Container className="profile-container">
            <Card style={{ width: "100%", margin: "auto" }}>
              <Card.Header className="bg-secondary">
                <Card.Title className="profile-title">
                  {this.state.courseCode}: {this.state.courseName} -- Course Outline
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Container fluid="md" className="class-container">
                  {this.state.assignments.map((assignment, index) => (
                    <Row key={index}>
                      <Col>
                        <Card style={{ width: "18rem", margin: "1rem" }} className="coursePageCard">
                          <Card.Header className="bg-secondary">
                            <Card.Title className="coursePageCardTitle">
                              {assignment["Name"]}
                            </Card.Title>
                          </Card.Header>
                          <Card.Body >
                            <Button
                              className="course-button bg-secondary"
                              variant="primary"
                            >
                              <Link to={{
                                pathname: ROUTES.COURSE_SCREEN + `/${this.state.courseName.replace(/\s+/g, '_')}` +
                                          ROUTES.ASSIGNMENT_SCREEN + `/${assignment["Name"].replace(/\s+/g, '_')}`,
                                state: {assignment: this.state.assignments[index]}
                              }} className="assignment-link">
                                  Visit Assignment
                              </Link>
                            </Button>

                          </Card.Body>
                        </Card>
                      </Col>
                      {this.props.authUserData["isInstructor"] &&
                        <Col>
                          <Card style={{ width: "18rem", margin: "1rem" }} className="coursePageCard">
                            <Card.Header className="bg-secondary">
                              <Card.Title className="coursePageCardTitle">
                                Student Submissions
                              </Card.Title>
                            </Card.Header>
                            <Card.Body >
                              <Button
                                className="course-button bg-secondary"
                                variant="primary"
                              >
                                <Link to={{
                                  pathname: ROUTES.COURSE_SCREEN + `/${this.state.courseName.replace(/\s+/g, '_')}` +
                                            ROUTES.ASSIGNMENT_SCREEN + `/${assignment["Name"].replace(/\s+/g, '_')}` +
                                            ROUTES.STUDENTS_SCREEN,
                                  state: {assignment: this.state.assignments[index]}    
                                }} className="assignment-link">
                                    View {assignment["Name"]} Submissions
                                </Link>
                              </Button>

                            </Card.Body>
                          </Card>
                        </Col>
                      }
                    </Row>
                  ))}
                  {this.props.authUserData["isInstructor"] &&
                    <Row >
                      <Card className="buildAssignmentCard full-width text-center">
                        <Card.Header className="bg-secondary">
                          <Card.Title className="coursePageCardTitle ">
                            Build A New Assignment
                          </Card.Title>
                        </Card.Header>
                        <Card.Body>
                          <Button
                            className="course-button bg-secondary"
                            variant="primary"
                            >
                              <Link to={{
                                pathname: ROUTES.BUILD_SCREEN + `/${this.state.courseName.replace(/\s+/g, '_')}`,
                                state: {assignmentIndex: this.state.assignments.length}
                              }} className="build-link">
                                Start Building!
                              </Link>
                          </Button>

                        </Card.Body>
                      </Card>
                    </Row>
                  }
                </Container> 
              </Card.Body>
            </Card>
          </Container>
    );
  }
};

const CourseScreenBase = withRouter(withFirebase(CourseBase));

// Defines a condition for ensuring that only authenticated users can
// navigate to this screen
const condition = (authUserData) => !!authUserData;

export default withAuthorization(condition)(CourseScreen);

export { CourseScreenBase };
