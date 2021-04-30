import React, { Component } from "react";
import { withRouter, Link } from 'react-router-dom';
import { withFirebase } from "../Firebase";
import { AuthUserContext, withAuthorization } from "../Session";
import * as ROUTES from "../constants/routes";
import { Container, Card, Col, Row, Button } from "react-bootstrap";

const ProfileScreen = () => (
  <AuthUserContext.Consumer>
    {authUserData => <ProfileScreenBase authUserData={authUserData}/>}
  </AuthUserContext.Consumer>
);

const INITIAL_STATE ={
  firstName: "",
  lastName: "",
  isInstructor: false,
  courses: [],
  instructors: [],
  created: new Date()
};

class ProfileBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.state.unsubscribeAssignments = null;
  }

  componentDidMount() {
    this.setState({ firstName: this.props.authUserData["First Name"] });
    this.setState({ lastName: this.props.authUserData["Last Name"] });
    this.setState({ isInstructor: this.props.authUserData["isInstructor"] });
    this.setState({ courses: this.props.authUserData["Courses"] });
    this.setState({ created: this.props.firebase.getDate(this.props.authUserData["Created"]) });
    this.props.authUserData["Instructors"] &&
      this.setState({ instructors: this.props.authUserData["Instructors"] });

    this.setState({
      unsubscribeAssignments: {}
        //this.props.firebase.submissions(this.props.authUserData["UID"])
    });

  }

  componentWillUnmount() {

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
      <Container className="profile-container">
        <Card style={{ width: "100%", margin: "auto" }}>
          <Card.Header className="bg-secondary">
            <Card.Title className="profile-title">
              User Information
            </Card.Title>
          </Card.Header>
          <Card.Body>
                    <Card.Text>
                      {`Name: ${firstName} ${lastName}`}
                    </Card.Text>
                    <Card.Text>
                        {"Courses:"}
                    </Card.Text>
                    <Row>
                      <Col >
                        {courses.map((course, index) => (
                          <Card.Text className="d-flex justify-content-center" key={index}>
                            {course}
                          </Card.Text>
                        ))}
                      </Col>
                    </Row>
                    <Card.Text>
                      {`Is Instructor: ${isInstructor}`}
                    </Card.Text>
                    <Card.Text>
                      {`Profile Created: ${created}`}
                    </Card.Text>
            <Row>
              <Col className="d-flex justify-content-center">
                <Container fluid="md" className="class-container">
                  {courses.map((course, index) => (
                          <Card style={{ width: "18rem", margin: "1rem" }} >
                            <Card.Header className="bg-secondary">
                              <Card.Title>{course}</Card.Title>
                            </Card.Header>
                            <Card.Body>
                              <Card.Text key={index}>Course Information</Card.Text>
                              <Button
                                className="course-button bg-secondary"
                                variant="primary"
                                key={course}
                              >
                                Course Assignments
                              </Button>
                            </Card.Body>
                          </Card>
                  ))}
                </Container>
              </Col>
              <Col className="d-flex justify-content-center">
                <Container fluid="md" className="grade-container">
                  {courses.map((course, index) => (
                        <Col>
                          <Card style={{ width: "18rem", margin: "1rem" }} key={index}>
                            <Card.Header className="bg-secondary">
                              <Card.Title>{course}</Card.Title>
                            </Card.Header>
                            <Card.Body>
                              <Card.Text key={index}>Grade Information</Card.Text>
                              <Button
                                className="course-button bg-secondary"
                                variant="primary"
                                key={course}
                              >
                                More Details
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                  ))}
                </Container>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    );
  }
};

const ProfileScreenBase = withRouter(withFirebase(ProfileBase));

const condition = (authUserData) => !!authUserData;

export default withAuthorization(condition)(ProfileScreen);

export { ProfileScreenBase };
