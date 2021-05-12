/**
 * This React Component contains the logic and rendered content
 * for the / route within the application.
 * 
 * Date: 05/12/2021
 * @author Ross Rucho
 * @author Gabe Foster
 * @author Molly Crown
 */

import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../constants/routes";
import { Card, Col, Container, Row } from "react-bootstrap";
import "../App.css";

const LandingScreen = () => <LandingScreenBase/>;

const INITIAL_STATE = {
  SIMULATIONS: []
};

class LandingBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.state.unsubscribeSimulations = null;
  }

  componentDidMount() {
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

  // renders the landing cards
  render() {
    return (
      <Container>
        <Row className="m-4"> </Row>
        <Row className="mt-5">
          <Col md={4}>
            <Card className="landingPageCard">
              <Card.Header className="bg-secondary">
                <Card.Title className="landingPageCardTitle">
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
          <Col md={4}>
            <Card className="landingPageCard text-weight-bold">
              <Card.Header className="bg-secondary">
                <Card.Title className="landingPageCardTitle">
                  <span>
                    <i className="fas fa-calendar-alt fa-1.7x mr-2"></i>{" "}
                  </span>
                  My Courses
                </Card.Title>
              </Card.Header>
              <Card.Body>Login to see your courses!</Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="landingPageCard">
              <Card.Header className="bg-secondary">
                <Card.Title className="landingPageCardTitle">
                  <span>
                    <i className="fas fa-user fa-1.5x mr-2"></i>{" "}
                  </span>
                  My Profile
                </Card.Title>
              </Card.Header>
              <Card.Body>Login to see your profile!</Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="m-4"></Row>
      </Container>
    );
  }
};

const LandingScreenBase = withFirebase(LandingBase);

export default LandingScreen;

export { LandingScreenBase };
