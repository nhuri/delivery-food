import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import {
  useCreateMenuItemMutation,
  useGetMenuItemsQuery,
} from "../slices/menuApiSlice";

const AddMenuItem = ({ setAddMode, id, onAddSuccess }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [inputPrice, setInputPrice] = useState("");
  const [inputCategory, setInputCategory] = useState("");

  const [createMenuItem] = useCreateMenuItemMutation();
  const { refetch } = useGetMenuItemsQuery();

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

  const handleAddMenuItem = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", inputName);
      formData.append("description", inputDescription);
      formData.append("price", inputPrice);
      formData.append("category", inputCategory);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const menuId = id ?? "test";

      const response = await createMenuItem({ formData, menuId }).unwrap();

      // Call the onAddSuccess callback with the new item
      onAddSuccess(response);

      // Reset form and close add mode
      setAddMode(false);
      setInputName("");
      setInputDescription("");
      setInputPrice("");
      setInputCategory("");
      setImageFile(null);
      setImagePreview("");
    } catch (error) {
      console.error("Error creating menu item:", error);
    }
    refetch();
    window.location.reload();
  };

  return (
    <Form onSubmit={handleAddMenuItem}>
      <h4>Add Menu Item</h4>
      <InputGroup size="sm" className="mb-3">
        <Form.Control
          placeholder="Name"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          required
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
          placeholder="Description"
          value={inputDescription}
          onChange={(e) => setInputDescription(e.target.value)}
          required
        />
      </InputGroup>
      <InputGroup size="sm" className="mb-3">
        <Form.Control
          placeholder="Price"
          type="number"
          value={inputPrice}
          onChange={(e) => setInputPrice(e.target.value)}
          required
        />
      </InputGroup>
      <InputGroup size="sm" className="mb-3">
        <Form.Control
          placeholder="Category"
          value={inputCategory}
          onChange={(e) => setInputCategory(e.target.value)}
          required
        />
      </InputGroup>
      <Button type="submit">Add Menu Item</Button>
    </Form>
  );
};

export default AddMenuItem;
