import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./components.css";
import Login from "../users/Login";

const Sidebar = () => {
  let source;
  return (
    <Navbar bg="light" expand="lg" className="">
      <Container className="">
        <h1>Food delivery</h1>

        <Navbar.Brand href="/" className="mb-4"></Navbar.Brand>

        <Navbar.Toggle aria-controls="sidebar-nav" />
        <Navbar.Collapse id="sidebar-nav">
          <Nav className="">
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
        <Login />
      </Container>
    </Navbar>
  );
};

export default Sidebar;
