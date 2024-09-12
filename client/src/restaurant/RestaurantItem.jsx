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
import { useGetReviewsQuery } from "../slices/reviewApiSlice";

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
  let urlImage;

  if (JSON.stringify(logo).slice(1, 9) === "/uploads") {
    urlImage = `http://localhost:8000/${logo.substring(9)}`;
  } else urlImage = logo;

  const reviewTarget = "restaurant";
  const reviewType = "66e015982473f95203473fd0";

  // const { data: getReviewsRestaurant } = useGetReviewsQuery(
  //   reviewType,
  //   reviewTarget,
  //   { skip: !reviewTarget }
  // );
  // console.log(getReviewsRestaurant);
  const {
    data: getReviewsRestaurant,
    error,
    isLoading,
  } = useGetReviewsQuery(reviewType, reviewTarget, { skip: !reviewTarget });

  // הוסף טיפול בשגיאות או בהמתנה
  if (isLoading) return <p>טוען...</p>;
  if (error) return <p>שגיאה: {error.message}</p>;

  console.log(getReviewsRestaurant);

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
      <Card.Img variant="top" src={urlImage} />
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
