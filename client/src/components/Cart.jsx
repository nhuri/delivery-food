import React, { useEffect, useState } from 'react';
import { Offcanvas, Button, Spinner, Alert } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import CartItem from './CartItem';
import { useCreatePaymentIntentMutation } from '../slices/PaymentSlice';
import { resetPayment } from '../slices/PaymentSlice';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './Cart.css';

// Initialize Stripe with your Publishable Key
const stripePromise = loadStripe('pk_test_51Q2Y68P3lcjRg4V1DWJ4ZZdytJ0fYJCHyCNLBWe5pcJRuVdszxE63atjAWMGVsNeMENx8pt669AFSbEAwlzYsi5X00rZCa4etH');

const Cart = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.cart);
  const { clientSecret, success } = useSelector((state) => state.payment);
  const stripe = useStripe();
  const elements = useElements();

  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentError, setPaymentError] = useState('');

  const [createPaymentIntent, { isLoading: paymentLoading }] = useCreatePaymentIntentMutation();

  useEffect(() => {
    if (success) {
      dispatch(resetPayment());
      setPaymentMessage('Payment Successful! Thank you for your order.');
      setPaymentError('');
    }
  }, [success, dispatch]);

  const handleFinishShopping = async () => {
    const amount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setPaymentMessage('');
    setPaymentError('');

    // Create the payment intent
    const response = await createPaymentIntent(amount * 100); // Ensure amount is in cents

    if (response.data?.clientSecret) {
      // Confirm the payment
      const cardElement = elements.getElement(CardElement);
      const { error } = await stripe.confirmCardPayment(response.data.clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        setPaymentError(error.message);
        setPaymentMessage('');
      } else {
        setPaymentMessage('Payment Successful! Thank you for your order.');
        setPaymentError('');
        // Clear the cart or take any necessary actions after successful payment
      }
    } else {
      setPaymentError('Failed to create payment intent.');
    }
  };

  return (
    <Offcanvas show={show} onHide={onHide} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Your Cart</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : error ? (
          <p>Error loading cart: {error}</p>
        ) : (
          <>
            <TransitionGroup>
              {items.map((item) => (
                <CSSTransition key={item._id} timeout={500} classNames="item">
                  <CartItem item={item} />
                </CSSTransition>
              ))}
            </TransitionGroup>
            {items.length === 0 && <p>Your cart is empty.</p>}
            <CardElement />
            {paymentMessage && <Alert variant="success">{paymentMessage}</Alert>}
            {paymentError && <Alert variant="danger">{paymentError}</Alert>}
            <Button
              variant="primary"
              disabled={!stripe || paymentLoading}
              onClick={handleFinishShopping}
              className="mt-3 w-100"
            >
              {paymentLoading ? <Spinner animation="border" size="sm" /> : 'Finish Shopping & Pay'}
            </Button>
            <Button variant="secondary" onClick={onHide} className="mt-3 w-100 continue-shopping-btn">
              Continue Shopping
            </Button>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Cart;