import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";

import { Card, Button, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux'; // Added useSelector import
import {
  useDeleteMenuItemMutation,
  useGetMenuItemsQuery,
} from "../slices/menuApiSlice";
import EditMenuItem from "./EditMenuItem";
import AddMenuItem from "./AddMenuItem";
import { useGetReviewsQuery } from "../slices/reviewApiSlice";
import ReiviewMenuItem from "./reiviewMenuItem";
import { useUpdateOrderMutation } from '../slices/orderSlice'; // Added import for addToOrder action
import {
  useCreateOrderMutation,
  useAddItemToOrderMutation
} from '../slices/orderSlice'; // Updated imports
import { setCurrentOrderId } from '../slices/orderSlice';
import { addToCart } from '../slices/cartSlice'; 


const MenuItems = ({ id, name, description, image, items, res_id }) => {



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
  const dispatch = useDispatch();
  const [createOrder] = useCreateOrderMutation();
  const [addItemToOrder] = useAddItemToOrderMutation();
  const currentOrderId = useSelector(state => state.order.currentOrderId); // Changed from state.order to state.auth
  const userInfo = useSelector(state => state.auth.userInfo);
  // console.log("DSADSADASD");
  // console.log(userInfo?.data?.user?.id);
  console.log(currentOrderId);


  const handleDeleteMenuItem = async (itemId) => {
    const menuId = itemId;
    await deleteMenuItem({ menuId }).unwrap();
    refetch();
  };

  const handleOrderMenuItem = async (item) => {
    try {
      if (!userInfo) {
        // Implement logic to prompt user to log in
        console.log("User needs to log in"); // Added console log for debugging
        return;
      }
      // console.log(currentOrderId); // Added console log for debugging
      console.log(userInfo.user); // Added console log for debugging

      let orderId = currentOrderId;
      if (!orderId) {
        // Create a new order if one doesn't exist
        const newOrder = await createOrder({
          customer: userInfo?.id,
          restaurant: res_id, // Assuming 'id' here is the restaurant id
          deliveryTime: new Date(), // You might want to let the user choose this
          communication: "" // You might want to add this field to your form
        }).unwrap();
        orderId = newOrder.order._id;
        dispatch(setCurrentOrderId(orderId));
        console.log("New order made")
      }

      // Add item to the order
      const result = await addItemToOrder({
        orderId,
        menuItemId: item._id,
        // Add other necessary fields like extrasIds, removedIngredientsIds if applicable
      }).unwrap();

      console.log("Item added to order:", result); // Added console log for debugging
      dispatch(addToCart({
        _id: item._id,
        name: item.name,
        price: item.price,
        // Add any other relevant item details
      }));

      // Show a success message to the user
    } catch (err) {
      // Handle error
      console.error("Failed to add item to order:", err);
    }
  };


  const handleReviewsMenuItem = async () => { };

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
            <AddMenuItem setAddMode={setAddMode} id={id} />
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
                  onClick={() => handleOrderMenuItem(item)}
                  variant="primary"
                  style={{ marginLeft: "10px" }}
                >
                  Add to order
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
