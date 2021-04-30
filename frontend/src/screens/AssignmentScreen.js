import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { withFirebase } from "../Firebase";
import { AuthUserContext, withAuthorization } from "../Session";
import { Container } from "react-bootstrap";
import * as ROUTES from "../constants/routes";
import { Card, Row, Button } from "react-bootstrap";

const AssignmentScreen = () => (
  <AuthUserContext.Consumer>
    {authUserData => <AssignmentScreenBase authUserData={authUserData}/>}
  </AuthUserContext.Consumer>
);

class AssignmentBase extends Component {
  render() {
    const {
      assignment
    } = this.props.location.state;

    return (
          <Container className="profile-container">
            <Card style={{ width: "100%", margin: "auto" }}>
              <Card.Header className="bg-secondary">
                <Card.Title className="profile-title">
                  {assignment["Name"]} -- Problems
                </Card.Title>
              </Card.Header>
              <Card.Body>
                {assignment["Problems"].map((problem, index) => (
                    <Row key={index}>
                      <Card style={{ width: "18rem", margin: "1rem" }} className="coursePageCard">
                        <Card.Header className="bg-secondary">
                          <Card.Title className="coursePageCardTitle">
                            {problem["Name"]}
                          </Card.Title>
                        </Card.Header>
                        <Card.Body >
                          <Button
                            className="course-button bg-secondary"
                            variant="primary"
                          >
                            <Link to={{
                              pathname: ROUTES.COURSE_SCREEN + `/${assignment["Course Name"].replace(/\s+/g, '_')}` +
                                        ROUTES.ASSIGNMENT_SCREEN + `/${assignment["Name"].replace(/\s+/g, '_')}` +
                                        ROUTES.PROBLEM_SCREEN + `/${problem["Name"].replace(/\s+/g, '_')}`,
                              state: {problem: problem}
                            }} className="build-link">
                                Visit Problem
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

const AssignmentScreenBase = withRouter(withFirebase(AssignmentBase));

const condition = (authUserData) => !!authUserData;

export default withAuthorization(condition)(AssignmentScreen);

export { AssignmentScreenBase };
