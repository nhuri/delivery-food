import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./components.css";
import Login from "../users/Login";
import foodDeliveryLogo from "../assets/food-delivery-logo.svg";
import { IoCart } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import Cart from "../Cart/Cart";

const Sidebar = () => {
  const location = useLocation();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const cartItems = useSelector((state) => state.cart.items); // חיבור לסטייט של העגלה
  const dispatch = useDispatch();
  const [showCart, setShowCart] = useState(false);

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
            <Nav.Link
              as={Link}
              to="/Home"
              active={location.pathname === "/Home"}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/Profile"
              active={location.pathname === "/Profile"}
            >
              Profile
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/Contact"
              active={location.pathname === "/Contact"}
            >
              Contact
            </Nav.Link>
          </Nav>
          <div className="d-flex align-items-center">
            <div className="position-relative me-3">
              {cartItems.length > 0 && (
                <span className="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger">
                  {cartItems.length}
                </span>
              )}
              <IoCart
                size={24}
                className="cursor-pointer"
                onClick={handleCartClick}
                style={{ color: "#ffffff", cursor: "pointer" }}
              />
            </div>
            <Login />
          </div>
        </Navbar.Collapse>
      </Container>
      <Cart show={showCart} onHide={() => setShowCart(false)} />
    </Navbar>
  );
};

export default Sidebar;
