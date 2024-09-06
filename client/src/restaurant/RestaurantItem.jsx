import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import EditRestaurant from "./EditRestaurant";
import {
  useDeleteRestaurantMutation,
  useGetRestaurantQuery,
} from "../slices/restaurantApiSlice";

const RestaurantItem = ({
  id,
  name,
  logo,
  address,
  location,
  menu,
  statistics,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [deleteRestaurant] = useDeleteRestaurantMutation();
  const { refetch } = useGetRestaurantQuery();

  const handleDeleteRestaurant = async (e) => {
    const restaurantId = id;
    const response = await deleteRestaurant({
      restaurantId,
    }).unwrap();
    refetch();
  };
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img variant="top" src={logo} />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{address}</Card.Text>
        <Card.Text>{statistics}</Card.Text>
        <Button variant="primary" id="btn">
          menu
        </Button>
        <Button id="btn">
          {name} website
          <Link to="https://florentina.co.il/"></Link>
        </Button>
        <Button
          id="btn"
          onClick={() => {
            handleDeleteRestaurant();
          }}
        >
          Delete Restaurant
        </Button>
        <Button
          id="btn"
          onClick={() => {
            if (editMode == false) setEditMode(true);
            else setEditMode(false);
          }}
        >
          Edit Restaurant
        </Button>
      </Card.Body>
      {editMode && <EditRestaurant id={id} setEditMode={setEditMode} />}
    </Card>
  );
};

export default RestaurantItem;
