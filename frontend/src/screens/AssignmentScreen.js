import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from "../Firebase";
import { AuthUserContext, withAuthorization } from "../Session";
import { Container } from "react-bootstrap";
import { Card, Col, Row, Button } from "react-bootstrap";

const AssignmentScreen = () => <AssignmentScreenBase/>;

const INITIAL_STATE = {
  assignmentName: "",
  problems: []
};

class AssignmentBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.state.unsubscribeAssignment = null;
  }

  componentDidMount() {
    const assignmentName = this.props.match.params.assignmentName.replace(/_+/g, ' ');
    this.setState({assignmentName: assignmentName});
  }

  componentWillUnmount() {
    //this.state.unsubscribeAssignment();
  }

  render() {
    return (
      <AuthUserContext.Consumer>
        {(authUserData) => (
          <Container className="profile-container">
            <Card style={{ width: "100%", margin: "auto" }}>
              <Card.Header className="bg-secondary">
                <Card.Title className="profile-title">
                  {this.state.assignmentName}: Assignments
                </Card.Title>
              </Card.Header>
              <Card.Body>
                  <Row>
                    <Container fluid="md" className="class-container">
                      {this.state.problems.map((problem, index) => (
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

const AssignmentScreenBase = withRouter(withFirebase(AssignmentBase));

const condition = (authUserData) => !!authUserData;

export default withAuthorization(condition)(AssignmentScreen);

export { AssignmentScreenBase };
