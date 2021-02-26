//import { useDispatch, useSelector } from "react-redux";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "../App.css";

const Header = (props) => {
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/" className=" font-lg">
            <Navbar.Brand className="navBrand">Physics</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="">
            <Nav className="ml-auto innerNav">
              <LinkContainer to="/simulation">
                <Nav.Link>Simulation</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/">
                <Nav.Link>Click Me</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/">
                <Nav.Link>I'm a link!</Nav.Link>
              </LinkContainer>
              <NavDropdown title="Even More Links" id="username">
                <LinkContainer to="/">
                  <NavDropdown.Item>A Link</NavDropdown.Item>
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
