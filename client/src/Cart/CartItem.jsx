// src/Cart/CartItem.jsx

import React from 'react';
import { Card, Button, ListGroup } from 'react-bootstrap';
import './Cart.css';
import { FaTrash } from 'react-icons/fa';

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {

  return (
    <Card className="mb-3 w-100">
      <Card.Body>
        <Card.Title>{item.name}</Card.Title>
        <Card.Text>
          Price: ${item.price.toFixed(2)}
        </Card.Text>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Button variant="outline-danger" size="sm" onClick={() => onDecrease(item.id, item.extras, item.ingredients)}>-</Button>
          <span>{item.quantity}</span>
          <Button variant="outline-danger" size="sm" onClick={() => onIncrease(item.id, item.extras, item.ingredients)}>+</Button>
        </div>

        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong>Ingredients:</strong>
            <ul>
              {item.ingredients.map((ingredient, index) => (
                <li key={index}>{typeof ingredient === 'object' ? ingredient.name : ingredient}</li>
              ))}
            </ul>
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Extras:</strong>
            <ul>
              {item.extras?.map((extra, index) => (
                <li key={index}>{extra.name} (${extra.price})</li>
              ))}
            </ul>
          </ListGroup.Item>
        </ListGroup>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Card.Text>
            Total Price: ${(item.totalPrice * item.quantity).toFixed(2)}
          </Card.Text>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onRemove(item.id, item.extras, item.ingredients)} // Added onClick handler
            className="delete-btn"
          >
            <FaTrash />
          </Button>
        </div>
      </Card.Body>
    </Card >
  );
};

export default CartItem;