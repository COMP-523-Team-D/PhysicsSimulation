import { Card, Col, Container, Row } from "react-bootstrap";

const ExampleBuild = () => {
  return (
    <Container className="simulation-container">
      <Row className="mt-4 pt-3">
        <Col sm={8}></Col>
        <Col></Col>
      </Row>
      <Row className="d-flex justify-content-center mt-5">
        <Col sm={3} className="graph m-3"></Col>
        <Col sm={3} className="graph m-3"></Col>
        <Col sm={3} className="graph m-3"></Col>
      </Row>
    </Container>
  );
};

export default ExampleBuild;
