import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./components.css";
import Login from "../users/Login";
import foodDeliveryLogo from '../assets/food-delivery-logo.svg';

const Sidebar = () => {
  const location = useLocation();

  return (
    <Navbar expand="lg" className="sidebar-vibrant">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src={foodDeliveryLogo} 
            width="250"
            height="70"
            className="d-inline-block align-top me-2"
            alt="Food Delivery Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="sidebar-nav" />
        <Navbar.Collapse id="sidebar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/Home" active={location.pathname === "/Home"}>Home</Nav.Link>
            <Nav.Link as={Link} to="/Order" active={location.pathname === "/Order"}>Order</Nav.Link>
            <Nav.Link as={Link} to="/Review" active={location.pathname === "/Review"}>Review</Nav.Link>
            <Nav.Link as={Link} to="/Payment" active={location.pathname === "/Payment"}>Payment</Nav.Link>
            <Nav.Link as={Link} to="/Contact" active={location.pathname === "/Contact"}>Contact</Nav.Link>
          </Nav>
          <Login />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};



export default Sidebar;


