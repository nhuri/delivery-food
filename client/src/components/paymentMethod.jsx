// PaymentMethod.js
import React, { useState, useEffect } from 'react';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useCreatePaymentIntentMutation } from '../slices/PaymentSlice';
import { resetPayment } from '../slices/PaymentSlice';
import { useDispatch, useSelector } from 'react-redux';

const PaymentMethod = ({ amount, onPaymentSuccess }) => {
    const dispatch = useDispatch();
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
            onPaymentSuccess(); // Call the success callback
        }
    }, [success, dispatch, onPaymentSuccess]);

    const handleFinishShopping = async () => {
        setPaymentMessage('');
        setPaymentError('');
        
        // Call the mutation to create a payment intent
        const response = await createPaymentIntent(amount * 100); // Ensure amount is in cents
        
        if (response.data?.clientSecret) {
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
            } else {
                setPaymentMessage('Payment status: ' + paymentIntent.status);
                setPaymentError('');
            }
        } else {
            setPaymentError('Failed to create payment intent.');
        }
    };

    return (
        <>
            {paymentMessage && <Alert variant="success">{paymentMessage}</Alert>}
            {paymentError && <Alert variant="danger">{paymentError}</Alert>}
            <CardElement />
            <Button
                disabled={!stripe || paymentLoading}
                onClick={handleFinishShopping}
            >
                {paymentLoading ? <Spinner animation="border" size="sm" /> : 'Finish Shopping & Pay'}
            </Button>
        </>
    );
};

export default PaymentMethod;
