import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { withFirebase } from "../Firebase";
import { AuthUserContext, withAuthorization } from "../Session";
import { Container } from "react-bootstrap";
import * as ROUTES from "../constants/routes";
import { Card, Col, Row, Button } from "react-bootstrap";

const CourseScreen = () => <CourseScreenBase/>;

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

    this.setState({
      unsubscribeCourse:
        this.props.firebase.course(courseName)
            .onSnapshot((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                this.setState({courseCode: doc.get("Code")});
              });
            })
    });

    this.setState({
      unsubscribeAssignments:
        this.props.firebase.assignments(courseName)
            .onSnapshot((querySnapshot) => {
              let assignmentList = [];
              querySnapshot.forEach((doc) => {
                assignmentList.push(doc.data());
              });

              this.setState({assignments: assignmentList});
            })
    });
  }

  componentWillUnmount() {
    this.state.unsubscribeCourse();
    this.state.unsubscribeAssignments();
  }

  render() {
    return (
      <AuthUserContext.Consumer>
        {(authUserData) => (
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
                      <Card style={{ width: "18rem", margin: "1rem" }} className="coursePageCard">
                        <Card.Header className="bg-secondary">
                          <Card.Title className="coursePageCardTitle">
                          </Card.Title>
                        </Card.Header>
                        <Card.Body >

                          <Card.Text>{assignment["Name"]}</Card.Text>
                          <Button
                            className="course-button bg-secondary"
                            variant="primary"
                          >
                            More Details
                          </Button>

                        </Card.Body>
                      </Card>
                    </Row>
                  ))}
                  <Row >
                    <Card style={{ width: "100%", margin: "1rem" }} className="buildAssignmentCard">
                      <Card.Header className="bg-secondary">
                        <Card.Title className="coursePageCardTitle">
                        </Card.Title>
                      </Card.Header>
                      <Card.Body>

                        <Card.Text>Build A New Assignment</Card.Text>

                        <Button
                          className="course-button bg-secondary"
                          variant="primary"
                          >
                            <Link to={ROUTES.BUILD_SCREEN + `/${this.state.courseName.replace(/\s+/g, '_')}`} className="build-link">
                              Start Building!
                            </Link>
                        </Button>

                      </Card.Body>
                    </Card>
                  </Row>
                </Container> 
              </Card.Body>
            </Card>
          </Container>
        )}
      </AuthUserContext.Consumer>
    );
  }
};

const CourseScreenBase = withRouter(withFirebase(CourseBase));

const condition = (authUserData) => !!authUserData;

export default withAuthorization(condition)(CourseScreen);

export { CourseScreenBase };
