import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import { AuthUserContext, withAuthorization } from '../Session';
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Card, Image, Col, Row, Form, Button, ObjectRow } from "react-bootstrap";

const ProfileScreen = () => {
    return (
      <AuthUserContext.Consumer>
        { authUserData => ( 
          <Container className="profile-container">
              <Card style={{ width: '100%', margin: 'auto' }}>
              <Card.Header className="bg-secondary"><Card.Title className="profile-title">{authUserData['First Name']}'s Profile</Card.Title></Card.Header>
              <Card.Body>
              <Card.Text>
                  <p>Courses: </p>
              <Row>
              <Container fluid="md" className="class-container">
                  {authUserData['Courses'].map((course, index) => (
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
              <p>Grades: </p>
              <Row>
                    <Container fluid="md" className="grade-container">
                  {authUserData['Courses'].map((course, index) => (
                      <Col>
                      <Card style={{ width: '18rem', margin: '1rem' }}>
                      <Card.Header className="bg-secondary"><Card.Title>{course}</Card.Title></Card.Header>
                      <Card.Body>
                        <Card.Text>
                          Grade Information
                        </Card.Text>
                        <Button classname="course-button" variant="primary">More Details</Button>
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
        )}
      </AuthUserContext.Consumer>
  );
};

const condition = authUserData => !!authUserData;

export default withAuthorization(condition)(ProfileScreen);
