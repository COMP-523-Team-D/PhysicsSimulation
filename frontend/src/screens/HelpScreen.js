/*
 * Screen with extra info on processes for registering,
 * graphing, and creating an assignment.
 *
 * @author Gabe Foster
 * Date: 5/12/21
 * */

import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import GraphComponent from "../components/GraphComponent";
import { useState } from "react";

import registerStudentImg from "../images/student-register-1.png";
import createAssignmentImg1 from "../images/create-assignment-1.png";
import createAssignmentImg2 from "../images/create-assignment-2.png";

const HelpScreen = (props) => {
  const [graphAnswers, getGraphAnswers] = useState({});

  return (
    <Col className="help-screen-col p-auto my-2">
      <section id="help-section-1" className="help-section-1">
        <h2 className="">Registering A New User</h2>
        <br />
        <Row className="">
          <Col xs={12} lg={8} className="d-flex align-items-center">
            <img
              src={registerStudentImg}
              id="help-screen-img-1"
              className="help-screen-img"
              alt="Registering a new user"
            />
          </Col>
          <Col xs={12} lg={4} className="">
            <Row className="">
              <h3 className="">Student</h3>
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
              <h3 className="">Instructor</h3>
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
          <small className="">
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

      <section id="help-section-2" className="help-col">
        <h2 className="">Graphing a Prediction</h2>
        <br />
        <div className="col-12 row-md">
          <Row>
            <p>
              As part of an assignment you may be asked to plot points on a
              graph. This is a little confusing at first but not too bad once
              you've done it a couple of times.
            </p>
          </Row>
          <Row>
            <Col className="col-12 col-md-6 ">
              <p>
                In order to a graph a single point all you need to do is click
                the point you'd like to graph.
              </p>
              <p>
                In order to graph a straight line, click two points, with
                distinct x-values, that the line will run through.
              </p>
              <p>To graph a parabola, select three points on the curve.</p>
              <p>
                Feel free to play around with the one here until you get the
                hang of it.
              </p>
            </Col>
            <Col className="col-12 col-md-6">
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
        </div>
      </section>

      <br />

      <section id="help-section-3" className="">
        <h2 className="">Creating An Assignment</h2>
        <br />
        <Row className="my-3">
          <Col className="d-flex align-items-center">
            <img
              src={createAssignmentImg1}
              className="help-screen-img"
              alt="Creating an assignment"
            />
          </Col>
          <Col className="align-self-center">
            <Row>
              <p>
                After you are logged in and looking at your class home page, you
                should see any assignments you've already created above, and a
                button to create a new assignment below.
              </p>
            </Row>
            <Row className="">
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

        <Row className="my-3">
          <Col className="align-self-center">
            <Row className="">
              <p>
                On the pages that follow you will be prompted to fill out a form
                for each question you wish to include as part of this
                assignment.
              </p>
            </Row>
            <Row>
              <p>
                You will need to select which simulation the problem will be
                dealing with, what parameters to fix, how many sub-questions
                you'd like to include, the text for those questions, how many
                graphs you'd like the students to do, and which variables you'd
                like the students to graph.
              </p>
            </Row>
            <Row>
              <p>
                After you've filled out the info you'd like to include for this
                assignment you will need to navigate back to the first screen,
                confirming you have added everything the way you want it along
                the way, and click on the 'Create Assignment' button. The
                assignment should now show up under its respective class.
              </p>
            </Row>
          </Col>
          <Col className="align-self-center">
            <img
              src={createAssignmentImg2}
              className="help-screen-img"
              alt="Continuing to create an assignment"
            />
          </Col>
        </Row>
      </section>
    </Col>
  );
};

export default HelpScreen;
