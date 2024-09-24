import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { useCreateMenuItemMutation } from "../slices/menuApiSlice";
import { Container, Card, ListGroup } from "react-bootstrap"; // Import Card and Container from Bootstrap
import "./AddMenuItem.css"; // Import custom CSS for further styling

const AddMenuItem = ({ setAddMode, id, onAddSuccess }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [inputPrice, setInputPrice] = useState("");
  const [inputCategory, setInputCategory] = useState("");

  const [extras, setExtras] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [extraName, setExtraName] = useState("");
  const [extraPrice, setExtraPrice] = useState("");
  const [ingredientName, setIngredientName] = useState("");

  const [createMenuItem] = useCreateMenuItemMutation();

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

  const handleAddExtra = () => {
    if (extraName && extraPrice) {
      setExtras([
        ...extras,
        { name: extraName, price: parseFloat(extraPrice) },
      ]);
      setExtraName("");
      setExtraPrice("");
    }
  };

  const handleAddIngredient = () => {
    if (ingredientName) {
      setIngredients([...ingredients, { name: ingredientName }]);
      setIngredientName("");
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", inputName);
      formData.append("description", inputDescription);
      formData.append("price", inputPrice);
      formData.append("category", inputCategory);
      formData.append("extras", JSON.stringify(extras));
      formData.append("ingredients", JSON.stringify(ingredients));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const menuId = id;

      const response = await createMenuItem({ formData, menuId }).unwrap();
      onAddSuccess(response);
      setAddMode(false);
      setInputName("");
      setInputDescription("");
      setInputPrice("");
      setInputCategory("");
      setImageFile(null);
      setImagePreview("");
      setExtras([]);
      setIngredients([]);
    } catch (error) {
      console.error("Error creating menu item:", error);
    }
    refetch();
    window.location.reload();
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-lg">
        <Card.Body>
          <Form onSubmit={handleAddMenuItem}>
            <h4 className="text-center mb-4">Add Menu Item</h4>
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
              className="image-drop-zone"
            >
              Drag & Drop your image here or click to select
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="fileInput"
              />
              <label htmlFor="fileInput" className="d-block text-center">
                <Button variant="primary">Choose Image</Button>
              </label>
            </div>
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="img-preview" />
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
            <h5>Extras</h5>
            <InputGroup size="sm" className="mb-3">
              <Form.Control
                placeholder="Extra Name"
                value={extraName}
                onChange={(e) => setExtraName(e.target.value)}
              />
              <Form.Control
                placeholder="Extra Price"
                type="number"
                value={extraPrice}
                onChange={(e) => setExtraPrice(e.target.value)}
              />
              <Button onClick={handleAddExtra}>Add Extra</Button>
            </InputGroup>
            <ListGroup>
              {extras.map((extra, index) => (
                <ListGroup.Item key={index}>
                  {extra.name} - ${extra.price.toFixed(2)}
                </ListGroup.Item>
              ))}
            </ListGroup>

            <h5>Ingredients</h5>
            <InputGroup size="sm" className="mb-3">
              <Form.Control
                placeholder="Ingredient Name"
                value={ingredientName}
                onChange={(e) => setIngredientName(e.target.value)}
              />

              <Button onClick={handleAddIngredient}>Add Ingredient</Button>
            </InputGroup>
            <ListGroup>
              {ingredients.map((ingredient, index) => (
                <ListGroup.Item key={index}>{ingredient.name}</ListGroup.Item>
              ))}
            </ListGroup>

            {/* <Button type="submit" className="mt-3">
        Add Menu Item
      </Button> */}
            <Button type="submit" variant="success" className="w-100">
              Add Menu Item
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddMenuItem;
