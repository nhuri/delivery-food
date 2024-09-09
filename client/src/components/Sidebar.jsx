import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./components.css";

const Sidebar = () => {
  let source;
  return (
    <Navbar bg="light" expand="lg" className="flex-column vh-100 p-3">
      <Container fluid className="d-flex flex-column align-items-start">
        <Navbar.Brand href="/" className="mb-4"></Navbar.Brand>

        <Navbar.Toggle aria-controls="sidebar-nav" />
        <Navbar.Collapse id="sidebar-nav">
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/Home">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/Order">
              Order
            </Nav.Link>
            <Nav.Link as={Link} to="/Review">
              Review
            </Nav.Link>
            <Nav.Link as={Link} to="/Payment">
              Payment
            </Nav.Link>
            <Nav.Link as={Link} to={"/LoginPage1"}>
              Login
            </Nav.Link>
            <Nav.Link as={Link} to="/Contact">
              Contact
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Sidebar;
