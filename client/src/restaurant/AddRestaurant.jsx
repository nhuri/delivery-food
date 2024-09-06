import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import React, { useState } from "react";
import {
  useAddRestaurantMutation,
  useGetRestaurantQuery,
} from "../slices/restaurantApiSlice";
// import mongoose from "mongoose";
// const { ObjectId } = mongoose.Types;
import Button from "react-bootstrap/Button";

const AddRestaurant = ({ setActiveKey }) => {
  const [inputName, setInputName] = useState("");
  const [inputLogo, setInputLogo] = useState("");
  const [inputAddress, setInputAddress] = useState("");
  const [inputStatistics, setInputStatistics] = useState("");
  const [addRestaurant] = useAddRestaurantMutation();
  const { refetch } = useGetRestaurantQuery();

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    const response = await addRestaurant({
      name: inputName,
      logo: inputLogo,
      address: inputAddress,
      statistics: inputStatistics,
    }).unwrap();
    setActiveKey(null);
    refetch();
  };
  return (
    <>
      <h4>Add restaurant</h4>
      <InputGroup size="sm" className="mb-3">
        <Form.Control
          placeholder="name"
          onChange={(e) => setInputName(e.target.value)}
        />
      </InputGroup>
      <InputGroup size="sm" className="mb-3">
        <Form.Control
          placeholder="logo"
          onChange={(e) => setInputLogo(e.target.value)}
        />
      </InputGroup>
      <InputGroup size="sm" className="mb-3">
        <Form.Control
          placeholder="Address"
          onChange={(e) => setInputAddress(e.target.value)}
        />
      </InputGroup>
      <InputGroup size="sm" className="mb-3">
        <Form.Control
          placeholder="statistics"
          onChange={(e) => setInputStatistics(e.target.value)}
        />
      </InputGroup>
      <Button onClick={handleAddRestaurant}>Add Restaurant</Button>
    </>
  );
};

export default AddRestaurant;
