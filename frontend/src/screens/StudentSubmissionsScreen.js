/**
 * This React Component contains the logic and rendered content
 * for the /course/:courseName/assignment/:assignmentName/students/:studentName
 * /student_submissions route within the application.
 * 
 * Date: 05/12/2021
 * @author Ross Rucho
 */

import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { withFirebase } from "../Firebase";
import { AuthUserContext, withAuthorization } from "../Session";
import * as ROUTES from "../constants/routes";
import { Container, Card, Row, Col, Button } from "react-bootstrap";

const StudentSubmissionsScreen = () => (
  <AuthUserContext.Consumer>
    {authUserData => <StudentSubmissionsScreenBase authUserData={authUserData}/>}
  </AuthUserContext.Consumer>
);

const INITIAL_STATE = {
  courseName: "",
  assignmentName: "",
  studentName: "",
  problems: [],
  submissions: []
};

class StudentSubmissionsBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.state.unsubscribeSubmissions = null;
  }

  componentDidMount() {
    this.setState({courseName: this.props.location.state.assignment["Course Name"]});
    this.setState({assignmentName: this.props.location.state.assignment["Name"]});
    this.setState({problems: this.props.location.state.assignment["Problems"]});
    this.setState({studentName: this.props.location.state.studentName});

    // Saves the callback function returned by the Firestore database access
    this.setState({
      unsubscribeSubmissions:
        // Connects to the Firestore database using locally defined
        // API calls from Firebase/firebase.js
        this.props.firebase.studentSubmissions(this.props.location.state.assignment["Course Name"],
                                        this.props.location.state.assignment["Name"],
                                        this.props.location.state.studentID)
            .onSnapshot((querySnapshot) => {
              const newSubmissions = [];
              querySnapshot.forEach((doc) => {
                newSubmissions.push(doc.data());
              });

              this.setState({submissions: newSubmissions});
            })
    });

    // Allow the cannon to fire
    window.sessionStorage.setItem("submitted", "true");

  }

  componentWillUnmount() {
    // Calls the stored callback functions to close the database connection
    this.state.unsubscribeSubmissions();
  }


  render() {
    const {
      courseName,
      assignmentName,
      studentName,
      problems,
      submissions,
    } = this.state;

    return (
      <Container className="profile-container">
        <Card style={{ width: "100%", margin: "auto" }}>
          <Card.Header className="bg-secondary">
            <Card.Title className="profile-title">
              {assignmentName} -- Problems
            </Card.Title>
          </Card.Header>
          <Card.Body>
            {problems.map((problem, index) => (
              <Row key={index}>
                <Col>
                  <Card style={{ width: "18rem", margin: "1rem" }} className="coursePageCard">
                    <Card.Header className="bg-secondary">
                      <Card.Title className="coursePageCardTitle">
                        {problem["Name"]}
                      </Card.Title>
                    </Card.Header>
                  </Card>
                </Col>
                <Col>
                  {submissions.filter((submission) => submission["Problem Name"]===problem["Name"]).map((submission, localIndex) => (
                    <Row key={localIndex}>
                      <Card style={{ width: "18rem", margin: "1rem" }} className="coursePageCard">
                        <Card.Header className="bg-secondary">
                          <Card.Title className="coursePageCardTitle">
                            {submission["Name"]}
                          </Card.Title>
                        </Card.Header>
                        <Card.Body >
                          <Button
                            className="course-button bg-secondary"
                            variant="primary"
                          >
                            <Link to={{
                              pathname: ROUTES.COURSE_SCREEN + `/${courseName.replace(/\s+/g, '_')}` +
                                        ROUTES.ASSIGNMENT_SCREEN + `/${assignmentName.replace(/\s+/g, '_')}` +
                                        ROUTES.STUDENTS_SCREEN + `/${studentName.replace(/\s+/g, '_')}` +
                                        ROUTES.STUDENT_SUBMISSIONS_SCREEN +
                                        ROUTES.SUBMISSION_SCREEN + `/${submission["Name"].replace(/\s+/g, '_')}`,
                              state: {
                                problem: problem,
                                simulationSourceOffset: "../../../../../../../",
                                submission: submission
                              }
                            }} className="build-link">
                                Visit Submission
                            </Link>
                          </Button>

                        </Card.Body>
                      </Card>
                    </Row>
                  ))}
                </Col>
              </Row>
            ))}
          </Card.Body>
        </Card>
      </Container>
    );
  }
};

const StudentSubmissionsScreenBase = withRouter(withFirebase(StudentSubmissionsBase));

// Defines a condition for ensuring that only authenticated users can
// navigate to this screen
const condition = (authUserData) => !!authUserData;

export default withAuthorization(condition)(StudentSubmissionsScreen);

export { StudentSubmissionsScreenBase };
