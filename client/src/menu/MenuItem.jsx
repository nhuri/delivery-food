import React from "react";
import Card from "react-bootstrap/Card";

const MenuItem = ({ id, name, description, price, category, image }) => {
  return (
    <Card>
      <Card.Img variant="top" src={image} />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Card.Text>{price}</Card.Text>
        <Card.Text>{category}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default MenuItem;
