import React from "react";
import Card from "react-bootstrap/Card";

const MenuItems = ({ id, name, description, items }) => {
  console.log(items);

  return (
    <Card>
      {/* <Card.Img variant="top" src={} /> */}
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{description}</Card.Text>
        {items?.map((dish) => (
          <Card.Body key={dish._id}>
            <Card.Title>{dish.name}</Card.Title>
            <Card.Text>{dish.description}</Card.Text>
            <Card.Text>{dish.price}</Card.Text>
            <Card.Text>{dish.category}</Card.Text>
            <Card.Text>{dish.image}</Card.Text>
          </Card.Body>
        ))}
      </Card.Body>
    </Card>
  );
};

export default MenuItems;
