import React from 'react';
import { Offcanvas, Button, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import CartItem from './CartItem';
import './Cart.css';

const Cart = ({ show, onHide }) => {
  const { items, loading, error } = useSelector((state) => state.cart);

  if (loading) {
    return (
      <Offcanvas show={show} onHide={onHide} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Your Cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Offcanvas.Body>
      </Offcanvas>
    );
  }

  if (error) {
    return (
      <Offcanvas show={show} onHide={onHide} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Your Cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <p>Error loading cart: {error}</p>
        </Offcanvas.Body>
      </Offcanvas>
    );
  }

  return (
    <Offcanvas show={show} onHide={onHide} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Your Cart</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <TransitionGroup>
          {items.map((item) => (
            <CSSTransition key={item._id} timeout={500} classNames="item">
              <CartItem item={item} />
            </CSSTransition>
          ))}
        </TransitionGroup>
        {items.length === 0 && <p>Your cart is empty.</p>}
        <Button variant="secondary" onClick={onHide} className="mt-3 w-100 continue-shopping-btn">
          Continue Shopping
        </Button>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Cart;
/*
With this configuration, you can now use the cart state and dispatch cart actions
 throughout your application.
 
 For example, you can access the cart items in any component like this:
javascript

*/