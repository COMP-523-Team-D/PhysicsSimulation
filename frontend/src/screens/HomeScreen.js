import "../App.css";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

const HomeScreen = ({ db, auth, simulations }) => {

  const data = {
    loggedIn: false,
    user: null,
    courses: null
  };
  
  /*
   * Set an authentication state observer to update screen data
   */
  /*
  auth.onAuthStateChanged((user) => {
    if (user) {
      data.loggedIn = true;
      
      db.collection("Users").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(doc.get("UID")==user.uid) {
              data.user = doc.data;
              data.courses = data.user.Courses.map((course) => {db.collection("Courses").doc(course)});
            }
          });
      });
  
      data.user || // Returns false if user data was not identified
      console.log("Error. Authenticated user is not an Instructor or a Student.");
  
    } else {
      data.loggedIn = false;
      data.user = null;
    }
  });
  */

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
                {simulations.map((sim) => {
                  <li key={sim.Name.toString()}>{sim.Name}</li>
                })}
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
              {data.loggedIn
               ? <ul className="courseList list-unstyled">
                   {data.courses.map((course) => {
                   <li key={course.Code}>{course.Name}</li>
                   })}
                 </ul>
               :"Login to see your courses!"}
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
            <Card.Body></Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="m-4"></Row>
    </Container>
  );
};

export default HomeScreen;
