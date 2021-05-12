/**
 * This React Component contains the logic and rendered content
 * for the /course/:courseName/assignment/:assignmentName/students
 * route within the application
 * 
 * Date: 05/12/2021
 * @author Ross Rucho
 */

import React, { Component } from "react";
import { withRouter, Link } from 'react-router-dom';
import { withFirebase } from "../Firebase";
import { AuthUserContext, withAuthorization } from "../Session";
import * as ROUTES from "../constants/routes";
import { Container, Card, Row, Button } from "react-bootstrap";

const StudentsScreen = () => (
  <AuthUserContext.Consumer>
    {authUserData => <StudentsScreenBase authUserData={authUserData}/>}
  </AuthUserContext.Consumer>
);

const INITIAL_STATE = {
  courseName: "",
  assignmentName: "",
  submissions: [],
  students: {}
};

class StudentsBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.state.unsubscribeSubmissions = null;
  }

  componentDidMount() {
    this.setState({courseName: this.props.location.state.assignment["Course Name"]});
    this.setState({assignmentName: this.props.location.state.assignment["Name"]});

    // Saves the callback function returned by the Firestore database access
    this.setState({
      unsubscribeSubmissions:
        // Connects to the Firestore database using locally defined
        // API calls from Firebase/firebase.js
        this.props.firebase.allSubmissions(this.props.location.state.assignment["Course Name"],
                                        this.props.location.state.assignment["Name"])
            .onSnapshot((querySnapshot) => {
              const newSubmissions = [];
              const newStudents = {};
              querySnapshot.forEach((doc) => {
                newSubmissions.push(doc.data());
                const studentName = doc.data()["Student Name"];
                const studentID = doc.data()["Student ID"];
                if( !(studentName in newStudents) ) {
                  newStudents[studentName] = studentID;
                }
              });

              this.setState({submissions: newSubmissions});
              this.setState({students: newStudents});
            })
    });

  }
  
  componentWillUnmount() {
    // Calls the stored callback functions to close the database connection
    this.state.unsubscribeSubmissions();
  }


  render() {
    const {
      courseName,
      assignmentName,
      students
    } = this.state;

    return (
      <Container className="profile-container">
        <Card style={{ width: "100%", margin: "auto" }}>
          <Card.Header className="bg-secondary">
            <Card.Title className="profile-title">
              {assignmentName} -- Student Submissions
            </Card.Title>
          </Card.Header>
          <Card.Body>
            {Object.keys(students).map((student, index) => (
              <Row key={index}>
                <Card style={{ width: "18rem", margin: "1rem" }} className="coursePageCard">
                  <Card.Header className="bg-secondary">
                    <Card.Title className="coursePageCardTitle">
                      {student}
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
                                  ROUTES.STUDENTS_SCREEN + `/${student.replace(/\s+/g, '_')}` +
                                  ROUTES.STUDENT_SUBMISSIONS_SCREEN,
                        state: {
                          assignment: this.props.location.state.assignment,
                          studentName: student,
                          studentID: students[student]
                        }
                      }} className="build-link">
                          See Submissions!
                      </Link>
                    </Button>
                  </Card.Body>
                </Card>
              </Row>
            ))}
          </Card.Body>
        </Card>
      </Container>
    );
  }
};

const StudentsScreenBase = withRouter(withFirebase(StudentsBase));

// Defines a condition for ensuring that only authenticated users can
// navigate to this screen
const condition = (authUserData) => !!authUserData;

export default withAuthorization(condition)(StudentsScreen);

export { StudentsScreenBase };
