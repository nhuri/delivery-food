import React, { useEffect, useState } from 'react';
import { Offcanvas, Button, Spinner, Alert } from 'react-bootstrap';
import CartItem from './CartItem';
import './Cart.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { loadStripe } from '@stripe/stripe-js';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useCreatePaymentIntentMutation } from '../slices/PaymentSlice';
import { useDispatch, useSelector } from 'react-redux';
import { resetPayment } from '../slices/PaymentSlice';

// Initialize Stripe with your Publishable Key
const stripePromise = loadStripe('pk_test_51Q2Y68P3lcjRg4V1DWJ4ZZdytJ0fYJCHyCNLBWe5pcJRuVdszxE63atjAWMGVsNeMENx8pt669AFSbEAwlzYsi5X00rZCa4etH');

const Cart = ({ show, onHide }) => {
    const dispatch = useDispatch();
    const { success, clientSecret } = useSelector((state) => state.payment);
    const stripe = useStripe();
    const elements = useElements();

    const [cartItems, setCartItems] = useState([]);
    const [paymentMessage, setPaymentMessage] = useState('');
    const [paymentError, setPaymentError] = useState('');
    const [createPaymentIntent, { isLoading: paymentLoading }] = useCreatePaymentIntentMutation();

    useEffect(() => {
        // Load cart items from localStorage when component mounts
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(savedCart);
    }, []);

    useEffect(() => {
        if (success) {
            dispatch(resetPayment());
            setPaymentMessage('Payment Successful! Thank you for your order.');
            setPaymentError('');
        }
    }, [success, dispatch]);

    const saveCartToLocalStorage = (updatedCart) => {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleIncrease = (itemId, itemExtras, itemIngredients) => {
        const updatedCart = cartItems.map(item =>
            ((item.id === itemId) && (item.extras === itemExtras) &&
                (item.ingredients === itemIngredients)) ? { ...item, quantity: item.quantity + 1 }
                : item
        );
        setCartItems(updatedCart);
        saveCartToLocalStorage(updatedCart);
    };

    const handleDecrease = (itemId, itemExtras, itemIngredients) => {
        const updatedCart = cartItems.map(item =>
            ((item.id === itemId) && (item.extras === itemExtras) &&
                (item.ingredients === itemIngredients) && (item.quantity > 1)) ?
                { ...item, quantity: item.quantity - 1 } : item
        ).filter(item => item.quantity > 0);
        
        setCartItems(updatedCart);
        saveCartToLocalStorage(updatedCart);
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.totalPrice * item.quantity, 0);
    };

    const handleCheckout = async () => {
        const amount = calculateTotal() * 100; // Convert to cents
        setPaymentMessage('');
        setPaymentError('');

        // Create the payment intent
        const response = await createPaymentIntent(amount);

        if (response.data?.clientSecret) {
            // Confirm the payment
            const cardElement = elements.getElement(CardElement);
            const { error, paymentIntent } = await stripe.confirmCardPayment(response.data.clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (error) {
                setPaymentError(error.message);
                setPaymentMessage('');
            } else if (paymentIntent.status === 'succeeded') {
                setPaymentMessage('Payment Successful! Thank you for your order.');
                setPaymentError('');
                // Clear the cart or take any necessary actions after successful payment
            } else {
                setPaymentMessage('Payment status: ' + paymentIntent.status);
                setPaymentError('');
            }
        } else {
            setPaymentError('Failed to create payment intent.');
        }
    };

    return (
        <Offcanvas show={show} onHide={onHide} placement="end">
            <Offcanvas.Header closeButton style={{ backgroundColor: '#FF5252', color: '#ffffff' }}>
                <Offcanvas.Title>My Orders</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <div className="cart-items-container">
                    {cartItems.map(item => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onIncrease={handleIncrease}
                            onDecrease={handleDecrease}
                        />
                    ))}
                </div>
                <div className="cart-total mt-3">
                    <h5>Total: ${calculateTotal().toFixed(2)}</h5>
                </div>

                {/* CardElement for Stripe Payment */}
                <CardElement />

                {/* Payment Message or Error */}
                {paymentMessage && <Alert variant="success">{paymentMessage}</Alert>}
                {paymentError && <Alert variant="danger">{paymentError}</Alert>}

                <Button
                    variant="danger"
                    className="w-100 mt-3"
                    onClick={handleCheckout}
                    disabled={paymentLoading}
                >
                    {paymentLoading ? <Spinner animation="border" size="sm" /> : 'Checkout'}
                </Button>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default Cart;