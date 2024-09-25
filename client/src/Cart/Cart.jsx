// src/Cart/Cart.jsx

import React, { useEffect, useState } from 'react';
import { Offcanvas, Button } from 'react-bootstrap';
import CartItem from './CartItem';
import './Cart.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';


const Cart = ({ show, onHide }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // Load cart items from localStorage when component mounts
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(savedCart);
    }, []);

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

    // const handleRemove =  (itemId,  itemExtras, itemIngredients) => {

    //     const updatedCart = cartItems.filter(item => ((item.id !== itemId) && 
    //     (item.extras !== itemExtras) &&
    //     (item.ingredients !== itemIngredients)));
    //     setCartItems(updatedCart);
    //     saveCartToLocalStorage(updatedCart);
    // };

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
                            key={item.id}
                            item={item}
                            onIncrease={handleIncrease}
                            onDecrease={handleDecrease}
                            // onRemove={handleRemove}
                        />
                    )
                    )}
                    {/* <TransitionGroup>
                        {cartItems.map((item) => (
                            <CSSTransition key={item._id} timeout={500} classNames="item">
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onIncrease={handleIncrease}
                                    onDecrease={handleDecrease}
                                />
                            </CSSTransition>
                        ))}
                    </TransitionGroup> */}
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