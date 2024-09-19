import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addToCart, removeFromCart, decreaseQuantity } from '../slices/cartSlice';
import './CartItem.css';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleIncrease = () => {
    dispatch(addToCart({ ...item, quantity: 1 }));
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      dispatch(decreaseQuantity(item._id));
    } else {
      dispatch(removeFromCart(item._id));
    }
  };

  return (
    <Card className="cart-item w-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Card.Title>{item.name}</Card.Title>
            <Card.Text>
              Price: ${item.price}
            </Card.Text>
          </div>
          <div className="d-flex align-items-center">
            <Button variant="outline-secondary" size="sm" onClick={handleDecrease}>-</Button>
            {/* Added: Ensure quantity is always a number */}
            <span className="mx-2">{item.quantity || 0}</span>
            <Button variant="outline-secondary" size="sm" onClick={handleIncrease}>+</Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CartItem;