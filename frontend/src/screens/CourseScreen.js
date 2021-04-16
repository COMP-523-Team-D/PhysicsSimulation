import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from "../Firebase";
import { AuthUserContext, withAuthorization } from "../Session";
import { Container } from "react-bootstrap";
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
  }

  componentDidMount() {
    const courseName = this.props.match.params.courseName.replace(/_+/g, ' ');
    this.setState({courseName: courseName});

    this.setState({
      unsubscribeCourse:
        this.props.firebase.course(courseName)
            .onSnapshot((querySnapshot) => {
              let assignmentList = [];
              querySnapshot.forEach((doc) => {
                this.setState({courseCode: doc.get("Code")});
                assignmentList.push(doc.get("Assignments"));
              });

              this.setState({assignments: assignmentList});
            })
    });
  }

  componentWillUnmount() {
    this.state.unsubscribeCourse();
  }

  render() {
    return (
      <AuthUserContext.Consumer>
        {(authUserData) => (
          <Container className="profile-container">
            <Card style={{ width: "100%", margin: "auto" }}>
              <Card.Header className="bg-secondary">
                <Card.Title className="profile-title">
                  {this.state.courseName}: Assignments
                </Card.Title>
              </Card.Header>
              <Card.Body>
                  <Row>
                    <Container fluid="md" className="class-container">
                      {this.state.assignments.map((assignment, index) => (
                        <Col key={index}>
                          <Card style={{ width: "18rem", margin: "1rem" }} className="coursePageCard">
                            <Card.Header className="bg-secondary">
                              <Card.Title className="coursePageCardTitle">
                              </Card.Title>
                            </Card.Header>
                            <Card.Body >
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Container>
                  </Row>
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
