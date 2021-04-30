/**
 * This React Component contains the logic and rendered content
 * for the /sandbox/:simulationName routes within the application.
 * 
 * Date: 05/12/2021
 * @author Ross Rucho
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { Container, Col, Row} from "react-bootstrap";
import "../App.css";

// Top-level JSX component
const SandboxScreen = () => <FreeSimulation />;

const INITIAL_STATE = {
  simName: "",
  simSource: ""
};

// React Component containing logic and rendered content
class FreeSimulationBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.state.unsubscribeSimulation = null;
  }

  componentDidMount() {
    // Retrieves the name of the simulation from the route's pathname
    const simulationName = this.props.match.params.simulationName.replace(/_+/g, ' ');
    
    // Saves the callback function returned by the Firestore database access
    this.setState({
      unsubscribeSimulation:
        // Connects to the Firestore database using locally defined
        // API calls from Firebase/firebase.js
        this.props.firebase.simulation(simulationName)
            .onSnapshot((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                this.setState({simName: doc.get("Name")});
                this.setState({simSource: doc.get("Source")});
              });
            })
    });
  }

  componentWillUnmount() {
    // Calls the stored callback function to close the database connection
    this.state.unsubscribeSimulation();
  }

  render() {
    return (
      <Container className="simulation-container">
        <Row className="d-md-flex justify-content-center">
          <Col
            sm={12}
            md={8}
            className="d-flex d-md-block align-content-center justify-content-center"
          >
            <Container>
              <Row className="mt-4 pt-3">
                <Col className="d-flex justify-content-center">
                  <iframe
                    className="phet-sim"
                    src={this.state.simSource}
                    scrolling="no"
                    allowFullScreen
                    title={this.state.simName}
                  ></iframe>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }
}

// Intermediate JSX component declared with access to Router and Firebase state
const FreeSimulation = withRouter(withFirebase(FreeSimulationBase));

export default SandboxScreen;

export { FreeSimulation };
