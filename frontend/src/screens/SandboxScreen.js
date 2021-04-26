import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { Container, Col, Row} from "react-bootstrap";
import "../App.css";

const SandboxScreen = () => <FreeSimulation />;

const INITIAL_STATE = {
  simName: "",
  simSource: ""
};

class FreeSimulationBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.state.unsubscribeSimulation = null;
  }

  componentDidMount() {
    const simulationName = this.props.match.params.simulationName.replace(/_+/g, ' ');
    
    this.setState({
      unsubscribeSimulation:
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

const FreeSimulation = withRouter(withFirebase(FreeSimulationBase));

export default SandboxScreen;

export { FreeSimulation };
