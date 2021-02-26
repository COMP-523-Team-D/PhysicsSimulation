import { Card, Col, Container, Row } from "react-bootstrap";

const ExampleSimulation = () => {
  return (
    <Container className="simulation-container">
      <Row className="mt-4 pt-3">
        <Col sm={8}>
          <iframe
            src="https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_en.html"
            width="550"
            height="350"
            scrolling="no"
            allowFullScreen
            title="Projectile Motion"
          ></iframe>
        </Col>
        <Col
          sm={4}
          className="d-flex justify-content-center align-content-center text-center"
        >
          <div>
            <Row className="d-flex justify-content-center">
              <h3>These could be questions</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Adipisci commodi delectus deleniti dolor dolorem est facilis hic
                impedit, in laboriosam magnam nisi nulla possimus, quaerat
                quibusdam rem saepe tenetur velit?
              </p>
            </Row>
            <Row className="d-flex justify-content-center">
              <h3>PUT TEXT HERE</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Adipisci commodi delectus deleniti dolor dolorem est facilis hic
                impedit, in laboriosam magnam nisi nulla possimus, quaerat
                quibusdam rem saepe tenetur velit?
              </p>
            </Row>
          </div>
        </Col>
      </Row>
      <Row className="d-flex justify-content-center mt-5">
        <Col sm={3} className="graph m-3">
          <Card>
            <Card.Img></Card.Img>
            <Card.Body>
              <Card.Title>A Graph Title</Card.Title>
              <Card.Text>This is where a graph could go</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={3} className="graph m-3">
          <Card>
            <Card.Img></Card.Img>
            <Card.Body>
              <Card.Title>A Graph Title</Card.Title>
              <Card.Text>This is where a graph could go</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={3} className="graph m-3">
          <Card>
            <Card.Img></Card.Img>
            <Card.Body>
              <Card.Title>A Graph Title</Card.Title>
              <Card.Text>This is where a graph could go</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ExampleSimulation;
