// OrderItemModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useAddItemToOrderMutation } from "../slices/orderSlice";
import { addToCart } from "../slices/cartSlice";

const OrderItemModal = ({ show, onHide, item }) => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const dispatch = useDispatch();
  const [addItemToOrder] = useAddItemToOrderMutation();
  const currentOrderId = useSelector((state) => state.order.currentOrderId);

  useEffect(() => {
    if (item) {
      // Initialize selected ingredients and price when item changes
      setSelectedIngredients(item.ingredients?.map((ing) => ing.name) || []);
      setTotalPrice(item.price || 0);
      setSelectedExtras([]);
    }
  }, [item]);

  const handleIngredientToggle = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((ing) => ing !== ingredient)
        : [...prev, ingredient]
    );
    // Added: Toggle ingredient selection
  };

  const handleExtraToggle = (extra) => {
    setSelectedExtras((prev) => {
      const newExtras = prev.includes(extra)
        ? prev.filter((ext) => ext.name !== extra.name)
        : [...prev, extra];
      calculateTotalPrice(newExtras);
      return newExtras;
    });
    // Added: Toggle extra selection and recalculate price
  };

  const calculateTotalPrice = (extras) => {
    if (!item) return;
    console.log("extras:");
    console.log(extras);
    let newTotal = item.price;
    extras?.forEach((ext) => {
      const extra = item.extras?.find((e) => e.name === ext.name);
      console.log("extra:");
      console.log(extra);
      if (extra) newTotal += extra.price;
    });
    setTotalPrice(newTotal);
    // Added: Calculate new total price based on selected extras
  };

  let cartItem;
  const handleAddToOrder = () => {
    const cartItem = {
      id: item?._id,
      name: item?.name,
      price: item?.price,
      quantity: 1,
      ingredients: selectedIngredients,
      extras: selectedExtras,
      totalPrice: totalPrice.toFixed(2),
    };
    dispatch(addToCart(cartItem));
    onHide();
    alert("The menu item added to the cart successfully");
  };
  // Function to save cart to localStorage
  const saveCartToLocalStorage = () => {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...currentCart, cartItem];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
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
            checked={selectedExtras.includes(extra)}
            onChange={() => handleExtraToggle(extra)}
          />
        ))}
        <h5>Total Price: ${totalPrice.toFixed(2)}</h5>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleAddToOrder}>
          Add to Order
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderItemModal;
