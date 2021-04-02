import { Link } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import "../App.css";

const LandingScreen = ({simulations}) => {
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
                  {simulations.map((sim) => (
                    <li key={sim.Name}>
                      <Link to={ROUTES.PROBLEM_SCREEN}>{sim.Name}</Link>
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
            <Card.Body>
                Login to see your courses!
            </Card.Body>
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
            <Card.Body>
                Login to see your profile!
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="m-4"></Row>
    </Container>
  );
};

export default LandingScreen;