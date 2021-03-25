import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "../App.css";

const Header = ({ data }) => {
  const { id, typeEnum, firstName, lastName, courses } = data;

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
              {/**render welcome message if user is logged in, otherwise generic text */}
              {firstName != null
                ? `Welcome Back ${firstName}`
                : "UNC Physics Simulator"}
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav" className="">
            <Nav className="ml-auto innerNav">
              <LinkContainer to="/simulation">
                <Nav.Link>Simulation</Nav.Link>
              </LinkContainer>
              {typeEnum === "INSTRUCTOR" && (
                <LinkContainer to="/build">
                  <Nav.Link>Build New Simulation</Nav.Link>
                </LinkContainer>
              )}
              <LinkContainer to="/InstructorProfile">
                <Nav.Link>Profile</Nav.Link>
              </LinkContainer>
              <NavDropdown title="Even More Links" id="username">
                <LinkContainer to="/">
                  <NavDropdown.Item>Click</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Item>A Link</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
