import { Card, Col, Container, Row } from "react-bootstrap";
import QAndA from "../components/qAndA";
import { useState } from "react";

const ExampleBuildScreen = () => {
  const [header, setHeader] = useState(0);

  return (
    <Container className="build-container mb-4">
      <Card className="d-flex align-self-center build-card mx-auto">
        <Card.Header>
          <Container className="d-flex align-content-center">
            <span className="mr-auto">
              <button
                type="button"
                className="btn btn-outline scroll-btn"
                onClick={() => header - 1 >= 0 && setHeader((prev) => prev - 1)}
              >
                <i className="fas fa-angle-left"></i>
              </button>
            </span>
            <span className="align-self-center">
              {header === 0 ? "Select Your Simulation" : "Penis"}
            </span>
            <span className="ml-auto">
              <button
                type="button"
                className="btn btn-outline scroll-btn"
                onClick={() => header + 1 < 5 && setHeader((prev) => prev + 1)}
              >
                <i className="fas fa-angle-right"></i>
              </button>
            </span>
          </Container>
        </Card.Header>
        <Card.Body className="build-card-body">
          <Card.Title className="card-title my-4"></Card.Title>
          <Row className="d-flex justify-content-center p-2 mt-4">{/**/}</Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ExampleBuildScreen;
