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
  /////////////////////////////////////////////

  const [image, setImage] = useState(null);
  // const [inputLogo, setInputLogo] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setInputLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setInputLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  /////////////////////////////////////////////

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
      {/* <InputGroup size="sm" className="mb-3">
        <Form.Control
          placeholder="logo"
          onChange={(e) => setInputLogo(e.target.value)}
        />
  
      </InputGroup> */}
      {/* ////////////////////////////// */}
      <div>
        <InputGroup size="sm" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter image URL or drag and drop an image"
            value={inputLogo}
            onChange={(e) => setInputLogo(e.target.value)}
          />
        </InputGroup>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{
            border: "2px dashed #ccc",
            borderRadius: "4px",
            padding: "20px",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Drag & Drop your image here or click to select
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            style={{ display: "block", cursor: "pointer" }}
          >
            <Button variant="primary">Choose Image</Button>
          </label>
        </div>
        {image && (
          <img
            src={image}
            alt="Preview"
            style={{ width: "100%", maxWidth: "400px" }}
          />
        )}
      </div>
      {/* /////////////////////////////// */}
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
