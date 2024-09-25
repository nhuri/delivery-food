// Sidebar.jsx

import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Badge } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./components.css";
import Login from "../users/Login";
import foodDeliveryLogo from "../assets/food-delivery-logo.svg";
import { IoCart } from "react-icons/io5"; // Uncomment this line
import { useSelector, useDispatch } from "react-redux";
import Cart from "../Cart/Cart";

const Sidebar = () => {
  const location = useLocation();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();
  const [showCart, setShowCart] = useState(false); // Add this state

  // Add this function to handle cart icon click
  const handleCartClick = () => {
    setShowCart(true);
  };

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
            <Nav.Link as={Link} to="/Profile" active={location.pathname === "/Profile"}>Profile</Nav.Link>
            <Nav.Link as={Link} to="/Contact" active={location.pathname === "/Contact"}>Contact</Nav.Link>
          </Nav>
          <div className="d-flex align-items-center">
            {/* Add the cart icon */}
            <IoCart
              size={24}
              className="me-3 cursor-pointer"
              onClick={handleCartClick}
              style={{ color: "#ffffff", cursor: "pointer" }}
            />
            <Login />
          </div>
        </Navbar.Collapse>
      </Container>
      {/* Add the Cart component */}
      <Cart show={showCart} onHide={() => setShowCart(false)} />
    </Navbar>
  );
};

export default Sidebar;