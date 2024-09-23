import React, { useState, useEffect } from "react";
import { Card, Button, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  useDeleteMenuItemMutation,
  useGetMenuItemsQuery,
} from "../slices/menuApiSlice";
import EditMenuItem from "./EditMenuItem";
import AddMenuItem from "./AddMenuItem";
import ReiviewMenuItem from "./reiviewMenuItem";
import {
  useCreateOrderMutation,
  useAddItemToOrderMutation,
} from "../slices/orderSlice";
import { setCurrentOrderId } from "../slices/orderSlice";
import { addToCart } from "../slices/cartSlice";
import OrderItemModal from "../components/OrderItemModal";

const MenuItems = ({ id, name, description, image, items, res_id }) => {
  const [localItems, setLocalItems] = useState(items);
  const [activeKey, setActiveKey] = useState();
  const [addMode, setAddMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [deleteMenuItem] = useDeleteMenuItemMutation();
  const { refetch } = useGetMenuItemsQuery();
  const dispatch = useDispatch();
  const [createOrder] = useCreateOrderMutation();
  const [addItemToOrder] = useAddItemToOrderMutation();
  const currentOrderId = useSelector((state) => state.order.currentOrderId);
  const userInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const handleAddMenuItem = (newItem) => {
    setLocalItems((prevItems) => [...prevItems, newItem]);
    refetch();
  };

  const handleDeleteMenuItem = async (itemId) => {
    const menuId = itemId;
    await deleteMenuItem({ menuId }).unwrap();
    setLocalItems((prevItems) =>
      prevItems.filter((item) => item._id !== itemId)
    );
    refetch();
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

      const result = await addItemToOrder({
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

  const handleReviewsMenuItem = async () => {
    // Implement review functionality here
  };

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
              onAddSuccess={handleAddMenuItem}
            />
          </div>
        )}

        {localItems?.map((item) => (
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
