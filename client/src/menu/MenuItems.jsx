import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useDeleteMenuItemMutation } from "../slices/menuApiSlice";
import EditMenuItem from "./EditMenuItem";
import AddMenuItem from "./AddMenuItem";
import { useUpdateOrderMutation } from "../slices/orderSlice";
import {
  useCreateOrderMutation,
  useAddItemToOrderMutation,
} from "../slices/orderSlice";
import { setCurrentOrderId } from "../slices/orderSlice";
import { addToCart } from "../slices/cartSlice";
import OrderItemModal from "../components/OrderItemModal";

const MenuItems = ({ id, name, description, image, items, res_id }) => {
  const location = useLocation();
  const navigate = useNavigate();

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
    marginRight: "20px",
  };

  const imageStyle = {
    width: "250px",
    height: "auto",
    borderRadius: "8px",
  };

  const [menuItems, setMenuItems] = useState(items); // Initialize local state
  const [addMode, setAddMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteMenuItem] = useDeleteMenuItemMutation();
  const dispatch = useDispatch();
  const [createOrder] = useCreateOrderMutation();
  const [addItemToOrder] = useAddItemToOrderMutation();
  const currentOrderId = useSelector((state) => state.order.currentOrderId);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDeleteMenuItem = async (itemId) => {
    const menuId = itemId;
    await deleteMenuItem({ menuId }).unwrap();
    // Update local state
    setMenuItems((prevItems) =>
      prevItems.filter((item) => item._id !== itemId)
    );
  };

  const handleOrderMenuItem = (item) => {
    setSelectedItem(item);
    setShowOrderModal(true);
  };

  const handleAddToOrder = async (itemWithSelections) => {
    try {
      if (!userInfo) {
        console.log("User needs to log in");
        return;
      }

      let orderId = currentOrderId;

      if (!orderId) {
        const newOrder = await createOrder({
          customer: userInfo?.id,
          restaurant: res_id,
          deliveryTime: new Date(),
          communication: "",
        }).unwrap();
        orderId = newOrder.order._id;
        dispatch(setCurrentOrderId(orderId));
      }

      await addItemToOrder({
        orderId: orderId,
        menuItemId: itemWithSelections._id,
        removedIngredientsIds: itemWithSelections.ingredients
          ?.filter(
            (ing) => !itemWithSelections.selectedIngredients.includes(ing.name)
          )
          .map((ing) => ing._id),
        extrasIds: itemWithSelections.selectedExtras.map((extra) => extra._id),
      }).unwrap();

      dispatch(addToCart(itemWithSelections));
    } catch (err) {
      console.error("Failed to add item to order:", err);
    }
  };

  const handleReviewsMenuItem = async (itemId) => {
    navigate(`/ReviewMenuItem?id=${itemId}`);
  };

  // Define the missing function
  const handleAddMenuItem = (newItem) => {
    // Update the local state with the new item
    setMenuItems((prevItems) => [...prevItems, newItem]);
  };

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
            <AddMenuItem
              setAddMode={setAddMode}
              id={id}
              onAddSuccess={handleAddMenuItem} // Pass the handler here
            />
          </div>
        )}

        {menuItems?.map((item) => (
          <div key={item._id} style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                <Card.Text>price: {item.price}</Card.Text>
                <Card.Text>{item.category}</Card.Text>
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
                  Look at the reviews
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
      <OrderItemModal
        show={showOrderModal}
        onHide={() => {
          setShowOrderModal(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onAddToOrder={handleAddToOrder}
      />
    </Card>
  );
};

export default MenuItems;
