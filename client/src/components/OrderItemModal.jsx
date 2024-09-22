// OrderItemModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { useAddItemToOrderMutation } from '../slices/orderSlice';

const OrderItemModal = ({ show, onHide, item, onAddToOrder }) => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const dispatch = useDispatch();
  const [addItemToOrder] = useAddItemToOrderMutation();
  const currentOrderId = useSelector(state => state.order.currentOrderId);

  useEffect(() => {
    if (item) {
      // Initialize selected ingredients and price when item changes
      setSelectedIngredients(item.ingredients?.map(ing => ing.name) || []);
      setTotalPrice(item.price || 0);
      setSelectedExtras([]);
    }
  }, [item]);

   const handleIngredientToggle = (ingredient) => {
    setSelectedIngredients(prev =>
      prev.includes(ingredient)
        ? prev.filter(ing => ing !== ingredient)
        : [...prev, ingredient]
    );
    // Added: Toggle ingredient selection
  };

  const handleExtraToggle = (extra) => {
    setSelectedExtras(prev => {
      const newExtras = prev.includes(extra.name)
        ? prev.filter(ext => ext !== extra.name)
        : [...prev, extra.name];
      calculateTotalPrice(newExtras);
      return newExtras;
    });
    // Added: Toggle extra selection and recalculate price
  };

  
  const calculateTotalPrice = (extras) => {
    if (!item) return;
    let newTotal = item.price;
    extras.forEach(extraName => {
      const extra = item.extras?.find(e => e.name === extraName);
      if (extra) newTotal += extra.price;
    });
    setTotalPrice(newTotal);
    // Added: Calculate new total price based on selected extras
  };

  const handleAddToOrder = async () => {
    if (!item) return;
  
    const orderItem = {
      _id: item._id,
      name: item.name,
      price: totalPrice,
      quantity: 1,
      selectedIngredients: selectedIngredients,
      selectedExtras: item.extras.filter(extra => selectedExtras.includes(extra.name)),
    };
  
    onAddToOrder(orderItem);
    onHide();
  };

  if (!item) return null;
  
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{item.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Ingredients:</h5>
                {item.ingredients?.map((ingredient, index) => (
                    <Form.Check
                        key={index}
                        type="checkbox"
                        label={ingredient.name}
                        checked={selectedIngredients.includes(ingredient.name)}
                        onChange={() => handleIngredientToggle(ingredient.name)}
                    />
                ))}
                <h5>Extras:</h5>
                {item.extras?.map((extra, index) => (
                    <Form.Check
                        key={index}
                        type="checkbox"
                        label={`${extra.name} (+$${extra.price.toFixed(2)})`}
                        checked={selectedExtras.includes(extra.name)}
                        onChange={() => handleExtraToggle(extra)}
                    />
                ))}
                <h5>Total Price: ${totalPrice.toFixed(2)}</h5>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Cancel</Button>
                <Button variant="primary" onClick={handleAddToOrder}>Add to Order</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderItemModal;