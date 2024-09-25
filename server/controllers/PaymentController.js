// paymentController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Ensure your Stripe secret key is set in your environment variables

// Controller for creating a payment intent
exports.createPaymentIntent = async (req, res) => {
    const { amount } = req.body; // Amount should be in cents

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd', // Change as needed
            payment_method_types: ['card'],
        });
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Error creating payment intent' });
    }
};

// Controller for confirming the payment
exports.confirmPayment = async (req, res) => {
    const { paymentMethodId } = req.body; // Get the payment method ID from the request

    try {
        const paymentIntent = await stripe.paymentIntents.confirm(paymentMethodId);
        res.status(200).json(paymentIntent);
    } catch (error) {
        console.error('Error confirming payment:', error);
        res.status(500).json({ error: 'Error confirming payment' });
    }
};
