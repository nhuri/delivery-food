import React from "react";
import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";

const MenuItems = ({ id, name, description, image, items }) => {
  const imageUrl = JSON.stringify(image);
  console.log(imageUrl);
  // .substring(9).slice(0, -1)

  return (
    <Card>
      {/* <Card.Img variant="top" src={} /> */}
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        {/* <img src={`http://localhost:8000/${imageUrl}`} alt="Example" /> */}
        <Card.Text>{description}</Card.Text>
        {items?.map((dish) => (
          <Card.Body key={dish._id}>
            <Card.Title>{dish.name}</Card.Title>
            <Card.Text>{dish.description}</Card.Text>
            <Button>order</Button>
            <Card.Text>{dish.price}</Card.Text>
            <Card.Text>{dish.category}</Card.Text>
            <img
              src={`http://localhost:8000/${dish.image.substring(9)}`}
              alt="Example"
            />
            {/* <Card.Img variant="top" src={imageUrl} /> */}
            <Card.Text>{dish.image.substring(9)}</Card.Text>
          </Card.Body>
        ))}
      </Card.Body>
    </Card>
  );
};

export default MenuItems;
