import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Badge } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./components.css";
import Login from "../users/Login";
import foodDeliveryLogo from "../assets/food-delivery-logo.svg";
import { IoCart } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import Cart from "./Cart";
import { setCartItems } from "../slices/cartSlice";

const Sidebar = () => {
  const location = useLocation();
  const [showCart, setShowCart] = useState(false);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = cartItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      dispatch(setCartItems(JSON.parse(savedCart)));
    }
  }, [dispatch]);

  const handleCartClick = () => {
    if (userInfo) {
      setShowCart(true);
    } else {
      alert("Please log in or register to view your cart.");
    }
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
            <Nav.Link as={Link} to="/Review" active={location.pathname === "/Review"}>Review</Nav.Link>
            <Nav.Link as={Link} to="/Payment" active={location.pathname === "/Payment"}>Payment</Nav.Link>
            <Nav.Link as={Link} to="/Contact" active={location.pathname === "/Contact"}>Contact</Nav.Link>
          </Nav>

          <Nav.Link
            onClick={handleCartClick}
            className="ms-2 position-relative"
          >
            <IoCart size={24} />
            {totalQuantity > 0 && (
              <Badge
                bg="danger"
                pill
                className="position-absolute top-0 start-100 translate-middle"
              >
                {totalQuantity}
              </Badge>
            )}
          </Nav.Link>
          <Login />
        </Navbar.Collapse>
      </Container>
      <Cart show={showCart} onHide={() => setShowCart(false)} />
    </Navbar>
  );
};

export default Sidebar;
