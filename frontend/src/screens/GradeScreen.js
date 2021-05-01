import React, { Component } from "react";
import { withRouter, Link } from 'react-router-dom';
import { withFirebase } from "../Firebase";
import { AuthUserContext, withAuthorization } from "../Session";
import * as ROUTES from "../constants/routes";
import { Container, Card, Col, Row, Button } from "react-bootstrap";

const GradeScreen = () => (
  <AuthUserContext.Consumer>
    {authUserData => <GradeScreenBase authUserData={authUserData}/>}
  </AuthUserContext.Consumer>
);

const INITIAL_STATE ={
  firstName: "",
  lastName: "",
};

class GradeBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    this.setState({ firstName: this.props.authUserData["First Name"] });
    this.setState({ lastName: this.props.authUserData["Last Name"] });
  }


  render() {
    const{
      firstName,
      lastName,
    } = this.state;

    return (
      <Container className="profile-container">
        <Card style={{ width: "100%", margin: "auto" }}>
          <Card.Header className="bg-secondary">
            <Card.Title className="profile-title">
            {firstName} {lastName}'s Grades
            </Card.Title>
          </Card.Header>
          <Card.Body>
            {/* Future work for displaying student grades. */}
            <Card.Text className="d-flex justify-content-center">
              Student Grades will go here.
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    );
  }
};

const GradeScreenBase = withRouter(withFirebase(GradeBase));

const condition = (authUserData) => !!authUserData;

export default withAuthorization(condition)(GradeScreen);

export { GradeScreenBase };
