import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, decreaseQuantity } from '../slices/cartSlice';
import './CartItem.css';
import { useUpdateOrderMutation } from '../slices/orderSlice';


const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const totalPrice = (item.price * item.quantity).toFixed(2);
  const currentOrderId = useSelector(state => state.order.currentOrderId);
  const [updateOrder] = useUpdateOrderMutation();

  const handleIncrease = async () => {
    dispatch(addToCart({ ...item, quantity: 1 }));
    if (currentOrderId) {
      // console.log("currentOrderId:")
      // console.log(currentOrderId)
      // console.log(" item._id:")
      // console.log( item._id)
      // console.log(" item.quantity:")
      // console.log( item.quantity)

      try {
        await updateOrder({ 
          orderId: currentOrderId, 
          menuItemId: item._id, 
          quantity: item.quantity + 1 
        });
      } catch (error) {
        console.error('Failed to update order:', error);
      }
    }
  };

  const handleDecrease = async () => {
    if (item.quantity > 1) {
      dispatch(decreaseQuantity(item._id));
      if (currentOrderId) {
        try {
          // Added: Update order in backend
          await updateOrder({
            orderId: currentOrderId,
            menuItemId: item._id,
            quantity: item.quantity - 1
          });
        } catch (error) {
          console.error('Failed to update order:', error);
        }
      }
    } else {
      dispatch(removeFromCart(item._id));
      if (currentOrderId) {
        try {
          // Added: Remove item from order in backend
          await updateOrder({
            orderId: currentOrderId,
            menuItemId: item._id,
            quantity: 0
          });
        } catch (error) {
          console.error('Failed to update order:', error);
        }
      }
    }
  };

  return (
    <Card className="cart-item w-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Card.Title>{item.name}</Card.Title>
            <Card.Text>
              Price: ${item.price} each
            </Card.Text>
            <Card.Text>
              Total: ${totalPrice}
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