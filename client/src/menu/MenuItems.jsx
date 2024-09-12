// import React, { useState } from "react";
// import { Card, Button } from "react-bootstrap";
// import {
//   useDeleteMenuItemMutation,
//   useGetMenuItemsQuery,
// } from "../slices/menuApiSlice";
// import EditMenuItem from "./EditMenuItem";

// const MenuItems = ({ id, name, description, image, items }) => {
//   // let imageUrl;//למקרה ונרצה להוסיף תמונה כללית לתפריט
//   //   if (image) imageUrl = JSON.stringify(image).substring(9).slice(0, -1);
//   //  <Card.Img variant="top" src={`http://localhost:8000/${imageUrl}`} />

//   // Inline styles for the card and image
//   const cardStyle = {
//     display: "flex",
//     alignItems: "center",
//     marginBottom: "20px",
//     padding: "15px",
//     borderRadius: "10px",
//     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//     flexDirection: "row",
//     border: "1px solid #ddd",
//   };

//   const contentStyle = {
//     flex: "1",
//     marginRight: "20px", // Space between content and image
//   };

//   const imageStyle = {
//     width: "150px", // Adjust the width as needed
//     height: "auto",
//     borderRadius: "8px", // Optional: rounded corners for the image
//   };

//   const [editMode, setEditMode] = useState(false);
//   const [deleteMenuItem] = useDeleteMenuItemMutation();
//   const { refetch } = useGetMenuItemsQuery(0);
//   const handleDeleteMenuItem = async (e) => {
//     const menuItemId = id;
//     const response = await deleteMenuItem({ menuItemId }).unwrap();
//     refetch();
//   };

//   return (
//     <Card style={cardStyle}>
//       <Card.Body>
//         <Card.Title>{name}</Card.Title>
//         <Card.Text>{description}</Card.Text>
//         {items?.map((dish) => (
//           <div key={dish._id} style={cardStyle}>
//             <div style={contentStyle}>
//               <Card.Title>{dish.name}</Card.Title>
//               <Card.Text>{dish.description}</Card.Text>

//               <Card.Text>{dish.price}</Card.Text>
//               <Card.Text>{dish.category}</Card.Text>
//               <Button variant="primary">Order</Button>
//               <Button
//                 onClick={(e) => {
//                   setEditMode((prev) => !prev);
//                 }}
//                 variant="primary"
//               >
//                 Edit menu item
//               </Button>
//               <Button
//                 onClick={(e) => {
//                   handleDeleteMenuItem(e);
//                 }}
//                 variant="primary"
//               >
//                 Delete menu item
//               </Button>
//             </div>

//             {editMode && (
//               <EditMenuItem id={dish._id} setEditMode={setEditMode} />
//             )}
//             <img
//               src={`http://localhost:8000/${dish.image?.substring(9)}`}
//               alt={dish.name}
//               style={imageStyle}
//             />
//           </div>
//         ))}
//       </Card.Body>
//     </Card>
//   );
// };

// export default MenuItems;
import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";

import { Card, Button, Nav } from "react-bootstrap";
import {
  useDeleteMenuItemMutation,
  useGetMenuItemsQuery,
} from "../slices/menuApiSlice";
import EditMenuItem from "./EditMenuItem";
import AddMenuItem from "./AddMenuItem";

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
  const [activeKey, setActiveKey] = useState();
  const [addMode, setAddMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteMenuItem] = useDeleteMenuItemMutation();
  const { refetch } = useGetMenuItemsQuery();

  const handleDeleteMenuItem = async (dishId) => {
    const menuId = dishId;
    await deleteMenuItem({ menuId }).unwrap();
    refetch();
  };
  const handleOrderMenuItem = async () => {};
  const handleReviewsMenuItem = async () => {};

  return (
    <Card style={cardStyle}>
      <div style={contentStyle}>
        <Card.Title>name: {name}</Card.Title>
        {/* <div id="addMenuItem">
          <h1>add</h1>
          <Nav className="justify-content-end flex-grow-1 pe-3">
            <Accordion id="accordion" activeKey={activeKey}>
              <h1>add1</h1>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Add menu item</Accordion.Header>
                <Accordion.Body>
                  <AddMenuItem setActiveKey={setActiveKey} />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Nav>
        </div> */}
        <Button variant="primary" onClick={() => setAddMode((prev) => !prev)}>
          {addMode ? "Cancel" : "Add menu item"}
        </Button>
        <Card.Text>{description}</Card.Text>
        {addMode && (
          <div style={{ marginTop: "20px" }}>
            <AddMenuItem setAddMode={setAddMode} />
          </div>
        )}

        {items?.map((dish) => (
          <div key={dish._id} style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1" }}>
                <Card.Title>{dish.name}</Card.Title>
                <Card.Text>{dish.description}</Card.Text>
                <Card.Text>price: {dish.price}</Card.Text>
                <Card.Text>{dish.category}</Card.Text>
                <Button
                  variant="primary"
                  onClick={() => setEditMode((prev) => !prev)}
                >
                  {editMode ? "Cancel" : "Edit menu item"}
                </Button>
                <Button
                  onClick={() => handleDeleteMenuItem(dish._id)}
                  variant="danger"
                  style={{ marginLeft: "10px" }}
                >
                  Delete menu item
                </Button>
                <Button
                  onClick={() => handleOrderMenuItem(dish._id)}
                  variant="primary"
                  style={{ marginLeft: "10px" }}
                >
                  order this dish
                </Button>
                <Button
                  onClick={() => handleReviewsMenuItem(dish._id)}
                  variant="primary"
                  style={{ marginLeft: "10px" }}
                >
                  look at the reviews
                </Button>
              </div>
              <img
                src={`http://localhost:8000/${dish.image?.substring(9)}`}
                alt={dish.name}
                style={imageStyle}
              />
            </div>
            {editMode && (
              <div style={{ marginTop: "20px" }}>
                <EditMenuItem menuId={dish._id} setEditMode={setEditMode} />
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default MenuItems;
