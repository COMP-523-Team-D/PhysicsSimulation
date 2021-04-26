import React from 'react';
import { AuthUserContext } from '../Session';
import LogoutButton from './LogoutComponent';
import * as ROUTES from '../constants/routes';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container } from "react-bootstrap";
import "../App.css";
 
const Navigation = () => (
    <AuthUserContext.Consumer>
      {authUserData => authUserData ? <NavigationAuth authUserData={authUserData}/> : <NavigationNonAuth />}
    </AuthUserContext.Consumer>
);

const NavigationAuth = ({authUserData}) => (
    <header>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        collapseOnSelect
        className="py-4 mb-3 navBarContainer"
      >
        <Container>
          <LinkContainer to={ROUTES.HOME_SCREEN}>
            <Navbar.Brand className="navBrand">
              {`Welcome Back ${authUserData['First Name']} ${authUserData['Last Name']}`}
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav" className="">
            <Nav className="ml-auto innerNav">

              <LogoutButton />

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
);

const NavigationNonAuth = () => (
  <header>
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      collapseOnSelect
      className="py-4 mb-3 navBarContainer"
    >
      <Container>
        <LinkContainer to={ROUTES.LANDING_SCREEN}>
          <Navbar.Brand className="navBrand">
            Welcome to UNC Physics Simulation!
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav" className="">
          <Nav className="ml-auto innerNav">

            <LinkContainer to={ROUTES.PROBLEM_SCREEN}>
              <Nav.Link>Problem</Nav.Link>
            </LinkContainer>

            <LinkContainer to={ROUTES.LOGIN_SCREEN}>
              <Nav.Link>Login</Nav.Link>
            </LinkContainer>
            <LinkContainer to={ROUTES.REGISTER_SCREEN}>
                <Nav.Link>Register</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  </header>
)
 
export default Navigation;