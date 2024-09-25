// src/Cart/CartItem.jsx

import React from 'react';
import { Card, Button, ListGroup } from 'react-bootstrap';
import './Cart.css';
import { FaTrash } from 'react-icons/fa'; // Added import for trash icon


const CartItem = ({ item, onIncrease, onDecrease, onRemove  }) => {

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
              {item.ingredients.map((ing, index) => (
                <li key={index}>{ing}</li>
              ))}
            </ul>
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Extras:</strong>
            <ul>
              {item.extras.map((extra, index) => (
                <li key={index}>{extra?.name} (+${extra?.price?.toFixed(2)})</li>
              ))}
            </ul>
          </ListGroup.Item>
        </ListGroup>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Card.Text>
            Total Price: ${(item.totalPrice * item.quantity).toFixed(2)}
          </Card.Text>
          {/* <Button 
            variant="danger" 
            size="sm" 
            onClick={() => onRemove(item.id, item.extras, item.ingredients)}
            className="delete-btn"
          >
            <FaTrash />
          </Button> */}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CartItem;