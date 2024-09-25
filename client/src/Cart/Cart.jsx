// src/Cart/Cart.jsx
import React, { useEffect } from 'react';
import { Offcanvas, Button } from 'react-bootstrap';
import CartItem from './CartItem';
import './Cart.css';
import { useSelector, useDispatch } from 'react-redux';
import { loadCart, updateQuantity, removeFromCart } from '../slices/cartSlice';

const Cart = ({ show, onHide }) => {
    const cartItems = useSelector(state => state.cart.items);
    const dispatch = useDispatch();

    useEffect(() => {
        // Load cart items from localStorage when component mounts
        dispatch(loadCart());
    }, [dispatch]);

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

    return (
        <Offcanvas show={show} onHide={onHide} placement="end">
            <Offcanvas.Header closeButton style={{ backgroundColor: '#FF5252', color: '#ffffff' }}>
                <Offcanvas.Title>My Orders</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <div className="cart-items-container">
                    {cartItems.map(item => (
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
                <Button variant="danger" className="w-100 mt-3">Checkout</Button>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default Cart;