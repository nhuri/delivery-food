// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import Button from "react-bootstrap/Button";
// import Card from "react-bootstrap/Card";
// import EditRestaurant from "./EditRestaurant";
// import {
//   useDeleteRestaurantMutation,
//   useGetRestaurantQuery,
// } from "../slices/restaurantApiSlice";
// import "./SingleRestaurant";
// import { Navigate, useNavigate } from "react-router-dom";
// import Singlerestaurant from "./SingleRestaurant";

// const RestaurantItem = ({
//   id,
//   name,
//   logo,
//   address,
//   location,
//   menu,
//   statistics,
// }) => {
//   const [editMode, setEditMode] = useState(false);
//   const [deleteRestaurant] = useDeleteRestaurantMutation();
//   const { refetch } = useGetRestaurantQuery();

//   const handleDeleteRestaurant = async (e) => {
//     const restaurantId = id;
//     const response = await deleteRestaurant({
//       restaurantId,
//     }).unwrap();
//     refetch();
//   };
//   const [hover, setHover] = useState(false);
//   const navigate = useNavigate();
//   const handleCardClick = () => {
//     navigate(
//       `/SingleRestaurant?id=${id}&name=${encodeURIComponent(
//         name
//       )}&logo=${encodeURIComponent(logo)}&address=${encodeURIComponent(
//         address
//       )}&location=${encodeURIComponent(location)}&menu=${encodeURIComponent(
//         menu
//       )}&statistics=${encodeURIComponent(statistics)}`
//     );
//   };

//   return (
//     <Card
//       style={{
//         width: "18rem",
//         transition: "transform 0.3s ease, box-shadow 0.3s ease",
//         cursor: "pointer", // מציין שהכרטיס ניתן ללחיצה
//         transform: hover ? "scale(1.02)" : "scale(1)", // מגדיל את הכרטיס כאשר העכבר עובר עליו
//         boxShadow: hover
//           ? "0 4px 8px rgba(0, 0, 0, 0.2)"
//           : "0 2px 4px rgba(0, 0, 0, 0.1)", // מוסיף צל כאשר העכבר עובר עליו
//       }}
//       onClick={handleCardClick}
//       onMouseEnter={() => setHover(true)} // הגדרת מצב hover
//       onMouseLeave={() => setHover(false)} // הגדרת מצב hover
//     >
//       <Card.Img variant="top" src={logo} />
//       <Card.Body>
//         <Card.Title>{name}</Card.Title>
//         <Card.Text>{address}</Card.Text>
//         <Card.Text>{statistics}</Card.Text>
//         <Button variant="primary" id="btn">
//           menu
//         </Button>
//         <Button id="btn">
//           {name} website
//           <Link to="https://florentina.co.il/"></Link>
//         </Button>
//         <Button
//           id="btn"
//           onClick={() => {
//             handleDeleteRestaurant();
//           }}
//         >
//           Delete Restaurant
//         </Button>
//         <Button
//           id="btn"
//           onClick={() => {
//             if (editMode == false) setEditMode(true);
//             else setEditMode(false);
//           }}
//         >
//           Edit Restaurant
//         </Button>
//       </Card.Body>
//       {editMode && <EditRestaurant id={id} setEditMode={setEditMode} />}
//     </Card>
//   );
// };

// export default RestaurantItem;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import EditRestaurant from "./EditRestaurant";
import {
  useDeleteRestaurantMutation,
  useGetRestaurantQuery,
} from "../slices/restaurantApiSlice";
import "./restaurant.css";

const RestaurantItem = ({
  id,
  name,
  logo,
  address,
  location,
  menu,
  statistics,
  distanceKM,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [deleteRestaurant] = useDeleteRestaurantMutation();
  const { refetch } = useGetRestaurantQuery();
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  const handleDeleteRestaurant = async (e) => {
    e.stopPropagation(); // הימנע מהפצת האירוע
    const restaurantId = id;
    const response = await deleteRestaurant({ restaurantId }).unwrap();
    refetch();
  };

  const handleCardClick = () => {
    navigate(
      `/SingleRestaurant?id=${id}&name=${encodeURIComponent(
        name
      )}&logo=${encodeURIComponent(logo)}&address=${encodeURIComponent(
        address
      )}&location=${encodeURIComponent(location)}&menu=${encodeURIComponent(
        menu
      )}&statistics=${encodeURIComponent(statistics)}`
    );
  };

  return (
    <Card
      style={{
        width: "18rem",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "pointer", // מציין שהכרטיס ניתן ללחיצה
        transform: hover ? "scale(1.02)" : "scale(1)", // מגדיל את הכרטיס כאשר העכבר עובר עליו
        boxShadow: hover
          ? "0 4px 8px rgba(0, 0, 0, 0.2)"
          : "0 2px 4px rgba(0, 0, 0, 0.1)", // מוסיף צל כאשר העכבר עובר עליו
      }}
      onClick={handleCardClick}
      onMouseEnter={() => setHover(true)} // הגדרת מצב hover
      onMouseLeave={() => setHover(false)} // הגדרת מצב hover
    >
      <Card.Img variant="top" src={logo} />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{address}</Card.Text>
        <Card.Text>{statistics}</Card.Text>
        <Card.Text>{distanceKM}</Card.Text>

        <Button
          variant="primary"
          id="btn"
          onClick={(e) => e.stopPropagation()} // הימנע מהפצת האירוע
        >
          Menu
        </Button>
        <Button
          id="btn"
          onClick={(e) => e.stopPropagation()} // הימנע מהפצת האירוע
        >
          {name} Website
          <Link to="https://florentina.co.il/" />
        </Button>
        <Button
          id="btn"
          onClick={(e) => {
            e.stopPropagation(); // הימנע מהפצת האירוע
            handleDeleteRestaurant(e);
          }}
        >
          Delete Restaurant
        </Button>
        <Button
          id="btn"
          onClick={(e) => {
            e.stopPropagation(); // הימנע מהפצת האירוע
            setEditMode((prev) => !prev);
          }}
        >
          Edit Restaurant
        </Button>
      </Card.Body>
      {editMode && <EditRestaurant id={id} setEditMode={setEditMode} />}
    </Card>
  );
};

export default RestaurantItem;
