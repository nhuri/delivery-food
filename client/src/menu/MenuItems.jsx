  import React, { useState } from "react";
  import Accordion from "react-bootstrap/Accordion";

  import { Card, Button, Nav } from "react-bootstrap";
  import {
    useDeleteMenuItemMutation,
    useGetMenuItemsQuery,
  } from "../slices/menuApiSlice";
  import EditMenuItem from "./EditMenuItem";
  import AddMenuItem from "./AddMenuItem";
  import { useGetReviewsQuery } from "../slices/reviewApiSlice";
  import ReiviewMenuItem from "./reiviewMenuItem";

  const MenuItems = ({ id, name, description, image, items }) => {
    

    
    const cardStyle = {
      display: "flex",
      alignItems: "flex-start",
      marginBottom: "20px",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      border: "1px solid #ddd",
      flexDirection: "row",
      position: "relative",
    };

    const contentStyle = {
      flex: "1",
      marginRight: "20px", // Space between content and image
    };

    const imageStyle = {
      width: "250px", // Adjust the width as needed
      height: "auto",
      borderRadius: "8px", // Optional: rounded corners for the image
    };

    // const reviewTarget = id;
    // const { data: getReviewsMenuItem } = useGetReviewsQuery(
    //   "menuItem",
    //   reviewTarget,
    //   { skip: reviewTarget === "undefined" }
    // );
    const [activeKey, setActiveKey] = useState();
    const [addMode, setAddMode] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [deleteMenuItem] = useDeleteMenuItemMutation();
    const { refetch } = useGetMenuItemsQuery();
    

    const handleDeleteMenuItem = async (itemId) => {
      const menuId = itemId;
      await deleteMenuItem({ menuId }).unwrap();
      refetch();
    };
    const handleOrderMenuItem = async () => {};
    const handleReviewsMenuItem = async () => {};

    return (
      <Card style={cardStyle}>
        <div style={contentStyle}>
          <Card.Title>name: {name}</Card.Title>
          <Card.Text>{description}</Card.Text>
          <Button variant="primary" onClick={() => setAddMode((prev) => !prev)}>
            {addMode ? "Cancel" : "Add menu item"}
          </Button>
          {addMode && (
            <div style={{ marginTop: "20px" }}>
              <AddMenuItem setAddMode={setAddMode} id ={id } />
            </div>
          )}

          {items?.map((item) => (
            <div key={item._id} style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ flex: "1" }}>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                  <Card.Text>price: {item.price}</Card.Text>
                  <Card.Text>{item.category}</Card.Text>
                  <ReiviewMenuItem id={item._id} />
                  <Button
                    variant="primary"
                    onClick={() => setEditMode((prev) => !prev)}
                  >
                    {editMode ? "Cancel" : "Edit menu item"}
                  </Button>
                  <Button
                    onClick={() => handleDeleteMenuItem(item._id)}
                    variant="danger"
                    style={{ marginLeft: "10px" }}
                  >
                    Delete menu item
                  </Button>
                  <Button
                    onClick={() => handleOrderMenuItem(item._id)}
                    variant="primary"
                    style={{ marginLeft: "10px" }}
                  >
                    order this item
                  </Button>
                  <Button
                    onClick={() => handleReviewsMenuItem(item._id)}
                    variant="primary"
                    style={{ marginLeft: "10px" }}
                  >
                    look at the reviews
                  </Button>
                </div>
                <img
                  src={`http://localhost:8000/${item.image?.substring(9)}`}
                  alt={item.name}
                  style={imageStyle}
                />
              </div>
              {editMode && (
                <div style={{ marginTop: "20px" }}>
                  <EditMenuItem menuId={item._id} setEditMode={setEditMode} />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    );
  };

  export default MenuItems;
