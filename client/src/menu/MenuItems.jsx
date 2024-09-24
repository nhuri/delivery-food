import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useDeleteMenuItemMutation } from "../slices/menuApiSlice";
import EditMenuItem from "./EditMenuItem";
import AddMenuItem from "./AddMenuItem";
import { useCreateOrderMutation, useAddItemToOrderMutation } from "../slices/orderSlice";
import { setCurrentOrderId } from "../slices/orderSlice";
import { addToCart } from "../slices/cartSlice";
import OrderItemModal from "../components/OrderItemModal";
import './MenuItems.css';

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

  const [activeKey, setActiveKey] = useState();
  const [addMode, setAddMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const dispatch = useDispatch();
  const [deleteMenuItem] = useDeleteMenuItemMutation();
  const [createOrder] = useCreateOrderMutation();
  const [addItemToOrder] = useAddItemToOrderMutation();
  const currentOrderId = useSelector((state) => state.order.currentOrderId);
  const userInfo = useSelector((state) => state.auth.userInfo);

  const [menuItems, setMenuItems] = useState(items);
  const [addMode, setAddMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDeleteMenuItem = async (itemId) => {
    const menuId = itemId;
    await deleteMenuItem({ menuId }).unwrap();
    refetch();
    window.location.reload();
  };

  const handleOrderMenuItem = (item) => {
    setSelectedItem(item);
    setShowOrderModal(true);
  };

  const handleAddToOrder = async (itemWithSelections) => {
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
        ?.filter((ing) => !itemWithSelections.selectedIngredients.includes(ing.name))
        .map((ing) => ing._id),
      extrasIds: itemWithSelections.selectedExtras.map((extra) => extra._id),
    }).unwrap();

    dispatch(addToCart(itemWithSelections));
  };

  const handleReviewsMenuItem = (itemId) => {
    navigate(`/ReviewMenuItem?id=${itemId}`);
  };

  const handleAddMenuItem = (newItem) => {
    setMenuItems((prevItems) => [...prevItems, newItem]);
  };

  // Group menu items by category
  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});
  let urlImage;

  if (JSON.stringify(image).slice(1, 9) === "/uploads") {
    urlImage = `http://localhost:8000/${image.substring(9)}`;
  } else urlImage = image;

  return (
    <Card className="mb-4 shadow-sm rounded">
      <Card.Body>
        <Card.Img variant="top" src={urlImage} />
        <Card.Title className="text-center mb-3 restaurant-name">{name}</Card.Title>
        <Card.Text className="text-muted restaurant-description">{description}</Card.Text>
        <Button 
          variant="success" 
          onClick={() => setAddMode((prev) => !prev)} 
          className="mb-3 add-menu-item-button"
        >
          {addMode ? "Cancel" : "Add Menu Item"}
        </Button>
        {addMode && (
          <AddMenuItem setAddMode={setAddMode} id={id} // onAddSuccess={handleAddMenuItem} />
        )}

<div className="menu-items-container">
  {Object.keys(groupedItems).map((category) => (
    <div key={category} className="category-section text-center">
      <h5 className="category-title">{category}</h5>
      {groupedItems[category].map((item) => (
        <Row key={item._id} className="mb-3"> {/* Each item in its own row */}
          <Col xs={12}> {/* Full width for each item */}
            <div className="d-flex align-items-start border p-3 rounded menu-item-card">
              <div className="flex-grow-1 me-3">
                <Card.Title className="menu-item-name">{item.name}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                <Card.Text className="font-weight-bold menu-item-price">Price: ${item.price}</Card.Text>
                {item.extras && item.extras.length > 0 && (
                  <div>
                    <Card.Text>Extras:</Card.Text>
                    <ul>
                      {item.extras.map((extra, index) => (
                        <li key={index}>
                          {extra.name} - ${extra.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {item.ingredients && item.ingredients.length > 0 && (
                  <div>
                    <Card.Text>Ingredients:</Card.Text>
                    <ul>
                      {item.ingredients.map((ingredients, index) => (
                        <li key={index}>{ingredients.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="button-group">
                  <Button variant="warning" onClick={() => setEditMode((prev) => !prev)} className="me-2">
                    {editMode ? "Cancel" : "Edit Menu Item"}
                  </Button>
                  <Button variant="danger" onClick={() => handleDeleteMenuItem(item._id)} className="me-2">
                    Delete
                  </Button>
                  <Button variant="success" onClick={() => handleOrderMenuItem(item)} className="me-2">
                    Add to Order
                  </Button>
                  <Button variant="info" onClick={() => handleReviewsMenuItem(item._id)}>
                    Reviews
                  </Button>
                </div>
              </div>
              <img
                src={`http://localhost:8000/${item.image?.substring(9)}`}
                alt={item.name}
                className="img-fluid rounded"
                style={{ maxWidth: "150px", height: "auto" }}
              />
              {editMode && (
                <EditMenuItem menuId={item._id} setEditMode={setEditMode} className="mt-3" />
              )}
            </div>
          </Col>
        </Row>
      ))}
    </div>
  ))}
</div>

      </Card.Body>
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
