// src/Cart/Cart.jsx
import React, { useEffect, useState } from 'react';
import { Offcanvas, Button, Spinner, Alert } from 'react-bootstrap';
import CartItem from './CartItem';
import './Cart.css';
import { useSelector, useDispatch } from 'react-redux';
import { loadCart, updateQuantity, removeFromCart , clearCart } from '../slices/cartSlice';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { loadStripe } from '@stripe/stripe-js';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useCreatePaymentIntentMutation } from '../slices/PaymentSlice';
import { resetPayment } from '../slices/PaymentSlice';
import { useFinalizeOrderMutation, useCreateOrderMutation } from '../slices/orderSlice'
import { setCurrentOrderId } from '../slices/orderSlice';
import { useGetMenuItemByIdQuery } from '../slices/menuApiSlice'

// Initialize Stripe with your Publishable Key
const stripePromise = loadStripe('pk_test_51Q2Y68P3lcjRg4V1DWJ4ZZdytJ0fYJCHyCNLBWe5pcJRuVdszxE63atjAWMGVsNeMENx8pt669AFSbEAwlzYsi5X00rZCa4etH');

const Cart = ({ show, onHide }) => {
    const cartItems = useSelector(state => state.cart.items);
    const dispatch = useDispatch();
    const { success, clientSecret } = useSelector((state) => state.payment);
    const stripe = useStripe();
    const elements = useElements();
    const [createOrder] = useCreateOrderMutation();
    const userInfo = useSelector((state) => state.auth.userInfo);
    const [paymentMessage, setPaymentMessage] = useState('');
    const [paymentError, setPaymentError] = useState('');
    const [createPaymentIntent, { isLoading: paymentLoading }] = useCreatePaymentIntentMutation();
    const [finalizeOrder] = useFinalizeOrderMutation();
    const currentOrderId = useSelector(state => state.order.currentOrderId);

    // Use the hook for each item in the cart
    //   const menuItemQueries = cartItems.map(item => useGetMenuItemByIdQuery(item.id));
    const fetchMenuItems = () => {
        const newItems = []
        for (const cartItem of cartItems) {
            newItems.push(cartItem)
        }
        return newItems;
    }
    useEffect(() => {
        // Load cart items from localStorage when component mounts
        dispatch(loadCart());
    }, [dispatch]);
    useEffect(() => {
        if (success) {
            dispatch(resetPayment());
            setPaymentMessage('Payment Successful! Thank you for your order.');
            setPaymentError('');
        }
    }, [success, dispatch]);

    const handleIncrease = (itemId, itemExtras, itemIngredients) => {
        const item = cartItems.find(item =>
            item.id === itemId &&
            JSON.stringify(item.extras) === JSON.stringify(itemExtras) &&
            JSON.stringify(item.ingredients) === JSON.stringify(itemIngredients)
        );
        if (item) {
            dispatch(updateQuantity({ id: itemId, quantity: item.quantity + 1, extras: itemExtras, ingredients: itemIngredients }));
        }
    };

    const handleDecrease = (itemId, itemExtras, itemIngredients) => {
        const item = cartItems.find(item =>
            item.id === itemId &&
            JSON.stringify(item.extras) === JSON.stringify(itemExtras) &&
            JSON.stringify(item.ingredients) === JSON.stringify(itemIngredients)
        );
        if (item && item.quantity > 1) {
            dispatch(updateQuantity({ id: itemId, quantity: item.quantity - 1, extras: itemExtras, ingredients: itemIngredients }));
        } else if (item && item.quantity === 1) {
            dispatch(removeFromCart({ id: itemId, extras: itemExtras, ingredients: itemIngredients }));
        }
    };

    const handleRemove = (itemId, itemExtras, itemIngredients) => {
        dispatch(removeFromCart({ id: itemId, extras: itemExtras, ingredients: itemIngredients }));
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
                const user_phone = userInfo?.phoneNumber
                const newItems = fetchMenuItems();

                try {
                    const newOrder = await createOrder({
                        customer: userInfo?.id,
                        restaurant: cartItems[0]?.res_id,
                        deliveryTime: new Date(),
                        communication: String(user_phone),
                        items: newItems,
                        totalAmount: calculateTotal().toFixed(2),
                    }).unwrap();
                    console.log("Created new order:", newOrder);
                    let orderId = newOrder.order?._id;
                    console.log("Extracted orderId:", orderId);
                    dispatch(setCurrentOrderId(orderId));
                    // order created
                    console.log("newOrder");
                    console.log(newOrder);
                    console.log("Attempting to finalize order with ID:", orderId);
                    const orderResponse = await finalizeOrder(orderId).unwrap();
                    if (orderResponse.status === 'success') {
                        setPaymentMessage('Payment Successful! Thank you for your order.');
                        setPaymentError('');

                        // Clear the cart
                        dispatch(clearCart());
                        onHide();
                    } else {
                        throw new Error('Failed to finalize order');
                    }
                } catch (error) {
                    setPaymentError('Error finalizing order: ' + error.message);
                }
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
                    {cartItems?.map(item => (
                        <CartItem
                            key={`${item.id}-${JSON.stringify(item.extras)}-${JSON.stringify(item.ingredients)}`}
                            item={item}
                            onIncrease={handleIncrease}
                            onDecrease={handleDecrease}
                            onRemove={handleRemove}
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