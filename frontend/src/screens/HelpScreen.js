import { Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import GraphComponent from "../components/GraphComponent";
import { useState } from "react";

import registerStudentImg from "../images/student-register-1.png";
import createAssignmentImg1 from "../images/create-assignment-1.png";
import createAssignmentImg2 from "../images/create-assignment-2.png";

const HelpScreen = (props) => {
  const [graphAnswers, getGraphAnswers] = useState({});

  return (
    <div as={Col} className="help-screen-col mb-5">
      <section id="help-section-1" as={Col} className="help-section-1 mb-5">
        <h2 className="m-0">Registering A New User</h2>
        <br />
        <Row className="m-4 d-flex justify-content-around align-items-center">
          <Col className="mr-auto" sm={5}>
            <img
              src={registerStudentImg}
              className="help-screen-img"
              alt="a picture"
            />
          </Col>
          <Col className="ml-auto" sm={5}>
            <Row className="my-3">
              <h3 className="h4">Student</h3>
              <p>
                In order to register yourself as a new student, navigate to the
                register page using the tab in the menu bar. You will then be
                prompted for your name, email address, and a password. Next,
                select your instructor from the list below and the course you
                are registering.
              </p>
              <small>
                Note: If you don't see your instructor or your class, contact
                your instructor.
              </small>
            </Row>
            <Row>
              <h3 className="h4">Instructor</h3>
              <p>
                To register yourself as a new instructor, follow the same steps
                as above but do <strong>not</strong> select an instructor from
                the list. After you have created the user contact your
                administrator who will then give you access to all the extra
                privalges you'll need as an instructor{" "}
              </p>
            </Row>
          </Col>
        </Row>
        <br />
        <Row className="d-flex justify-content-center">
          <small>
            Not ready to register? Feel free to{" "}
            <strong>
              <Link to="/">check out</Link>
            </strong>{" "}
            the sandbox environment on the homescreen under 'Explore
            Simulations'
          </small>
        </Row>
        <br />
      </section>

      <br />

      <section id="help-section-2" as={Col} className="help-col">
        <h2 className="m-0">Graphing a Prediction</h2>
        <br />
        <Row className="m-4 d-flex justify-content-around align-items-center">
          <p>
            As part of an assignment you may be asked to plot points on a graph.
            This is a little confusing at first but not too bad once you've done
            it a couple of times.
          </p>
          <Col className="mr-1" sm={5}>
            <p>
              In order to a graph a single point all you need to do is click the
              point you'd like to graph.
            </p>
            <p>
              In order to graph a straight line, click two points, with distinct
              x-values, that the line will run through.
            </p>
            <p>To graph a parabola, select three points on the curve.</p>
            <p>
              Feel free to play around with the one here until you get the hang
              of it.
            </p>
          </Col>
          <Col className="ml-1" sm={5}>
            <GraphComponent
              ind={null}
              dep={null}
              xMin={0}
              xMax={25}
              yMin={0}
              yMax={25}
              name="Practice Graph"
              handleAnswers={getGraphAnswers}
              answersToSet={[]}
            />
          </Col>
        </Row>
      </section>

      <br />

      <section id="help-section-3" as={Col} className="mb-5">
        <h2 className="m-0">Creating An Assignment</h2>
        <br />
        <Row className="m-4 d-flex justify-content-around align-items-center">
          <Col className="mr-auto" sm={4} lg={5}>
            <img
              src={createAssignmentImg1}
              className="help-screen-img"
              alt="a picture"
            />
          </Col>
          <Col className="ml-auto" sm={4} lg={5}>
            <Row className="my-3">
              <p>
                After you are logged in and looking at your class home page, you
                should see any assignments you've already created above, and a
                button to create a new assignment below.
              </p>
            </Row>
            <Row>
              <p>
                At this point you should see a form with the Course Name and
                Assignment Name already filled out. After you've set the release
                date and due date select how many problems you would like this
                assignment to have. Navigate to the next page using the arrows
                at the top.
              </p>
              <small>
                Note: you should <strong>not</strong> submit using the create
                assignment button until you have finished creating your
                assignment.
              </small>
            </Row>
          </Col>
        </Row>

        <Row className="m-4 d-flex justify-content-around align-items-center">
          <Col className="mr-1 my-4" sm={5}>
            <p>
              On the pages that follow you will be prompted to fill out a form
              for each question you wish to include as part of this assingment.
            </p>
            <p>
              You will need to select which simulation the problem will be
              dealing with, what parameters to fix, how many sub-questions you'd
              like to include, the text for those questions, how many graphs
              you'd like the students to do, and which variables you'd like the
              students to graph.
            </p>
            <p>
              After you've filled out the info you'd like to include for this
              assignment you will need to navigate back to the first screen,
              confirming you have added everything the way you want it along the
              way, and click on the 'Create Assignment' button. The assignment
              should now show up under its respective class.
            </p>
          </Col>
          <Col className="ml-1 my-4" sm={5}>
            <img
              src={createAssignmentImg2}
              className="help-screen-img"
              alt="a picture"
            />
          </Col>
        </Row>
      </section>
    </div>
  );
};

export default HelpScreen;
