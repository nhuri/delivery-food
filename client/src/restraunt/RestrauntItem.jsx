import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

const RestrauntItem = ({
  id,
  name,
  logo,
  address,
  location,
  menu,
  statistics,
}) => {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img variant="top" src={logo} />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{address}</Card.Text>
        {/* <Card.Text>{statistics}</Card.Text> */}
        <Button variant="primary">menu</Button>
      </Card.Body>
    </Card>
    // <Link to="#" className="card">
    //   <div>
    //     <img src={logo} alt={name} />
    //     <h2>{name}</h2>
    //     <h3>{address}</h3>
    //     {/* <Link to={`/${menu}`}>menu</Link> */}
    //     <h3>{statistics}</h3>
    //   </div>
    // </Link>
  );
};

export default RestrauntItem;
