import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "../App.css";
import "../App.js";

const Header = ({db, auth}) => {

  const data = {
    loggedIn: false,
    user: null,
  };
  
  /*
   * Set an authentication state observer to update screen data
   */
  auth.onAuthStateChanged((user) => {
    if (user) {
      data.loggedIn = true;
      
      db.collection("Users").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(doc.get("UID")==user.uid) {
              data.user = doc.data;
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

  return (
    <header>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        collapseOnSelect
        className="py-4 mb-3 navBarContainer"
      >
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="navBrand">
              {/*Render personalized welcome if user is logged in, otherwise generic message */}
              {data.loggedIn
                ? `Welcome Back ${data.user['First Name']}!`
                : "Welcome to UNC Physics Simulation!"}
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav" className="">
            <Nav className="ml-auto innerNav">
              <LinkContainer to="/Login">
                <Nav.Link>
                  {/*Display login state*/}
                  {data.loggedIn
                    ? 'Success!'
                    : 'Login'}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/Register">
                  <Nav.Link>Register</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
