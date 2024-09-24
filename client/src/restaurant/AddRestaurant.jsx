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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputAddress, setInputAddress] = useState("");
  const [inputFoodCategory, setInputFoodCategory] = useState("");
  const [addRestaurant] = useAddRestaurantMutation();
  const { refetch } = useGetRestaurantQuery();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", inputName);
      formData.append("address", inputAddress);
      formData.append("foodCategory", inputFoodCategory);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const menuId = id ?? "test";

      const response = await addRestaurant({ formData }).unwrap();

      // Call the onAddSuccess callback with the new item
      // onAddSuccess(response);

      // Reset form and close add mode
      setActiveKey(false);
      setInputName("");
      setInputAddress("");
      setInputFoodCategory("");
      setImageFile(null);
      setImagePreview("");
    } catch (error) {
      console.error("Error creating menu item:", error);
    }
    refetch();
  };
  return (
    <>
      <Form onSubmit={handleAddRestaurant}>
        <h4>Add restaurant</h4>
        <InputGroup size="sm" className="mb-3">
          <Form.Control
            placeholder="name"
            onChange={(e) => setInputName(e.target.value)}
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
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            style={{ width: "100%", maxWidth: "400px" }}
          />
        )}
        <InputGroup size="sm" className="mb-3">
          <Form.Control
            placeholder="Address"
            onChange={(e) => setInputAddress(e.target.value)}
          />
        </InputGroup>
        <InputGroup size="sm" className="mb-3">
          <Form.Control
            placeholder="foodCategory"
            onChange={(e) => setInputFoodCategory(e.target.value)}
          />
        </InputGroup>
        <Button type="submit">Add Restaurant</Button>
      </Form>
    </>
  );
};

export default AddRestaurant;
