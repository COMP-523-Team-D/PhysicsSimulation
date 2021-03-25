import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Card, Image, Col, Row, Form, Button, ObjectRow } from "react-bootstrap";

const InstructorProfile = ({ data }) => {
    const { id, typeEnum, firstName, lastName, courses } = data;
    // const { numCourses } = courses.length()
    return (
        <Container className="profile-container">
            <Card style={{ width: '100%', margin: 'auto' }}>
            <Card.Header className="bg-secondary"><Card.Title className="profile-title">{firstName}'s Profile</Card.Title></Card.Header>
            <Card.Body>
            <Card.Text>
                <p>ID: {id}</p>
                <p>Email address: Placeholder@email</p>
                <p>Courses taught: </p>
            <Row>
            <Container fluid="md" className="class-container">
                {courses.map((course, index) => (
                    <Col>
                    <Card style={{ width: '18rem', margin: '1rem' }}>
                    <Card.Header className="bg-secondary"><Card.Title>{course}</Card.Title></Card.Header>
                    <Card.Body>
                      <Card.Text>
                        Course Information
                      </Card.Text>
                      <Button classname="course-button" variant="primary">Course Assignments</Button>
                    </Card.Body>
                  </Card>
                  </Col>
                ))}
            </Container>
            </Row>
            </Card.Text>
            </Card.Body>
            </Card>
        </Container>
  );
};

export default InstructorProfile;
