import React, { useEffect, useState } from "react";
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
import Colors from "../utils/Colors"

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
  const reviewTarget = id;
  const { data: getReviewsRestaurant } = useGetReviewsQuery(reviewTarget, {
    skip: !reviewTarget,
  });
  // console.log(getReviewsRestaurant);
  // const reviewsArr = getReviewsRestaurant?.data?.reviews?.length > 0;
  const [reviewsArr, setReviewsArr] = useState([]);

  useEffect(() => {
    if (getReviewsRestaurant?.data?.reviews) {
      const reviews = getReviewsRestaurant.data.reviews;

      // השמה ל-reviewsArr תעשה רק אם אורך המערך גדול מ-0
      if (reviews.length > 0) {
        setReviewsArr(reviews);
      }
    }
  }, [getReviewsRestaurant]);
  let reviewsArray;
  if (reviewsArr.length > 0) {
    reviewsArray = reviewsArr;
  }

  const ratingArr = reviewsArr?.map((review) => review.rating);
  const average = (arr) => {
    if (arr?.length === 0) return 0; // התמודדות עם מערך ריק
    const sum = arr?.reduce((acc, num) => acc + num, 0);
    return sum / arr?.length;
  };
  let averageRating = average(ratingArr);
  if (!averageRating)
    averageRating = "This Restaurant without rate yet, be the first";

  const handleCardClick = () => {
    navigate(
      `/SingleRestaurant?id=${id}&name=${encodeURIComponent(name)}&logo=${encodeURIComponent(logo)}&address=${encodeURIComponent(address)}&averageRating=${encodeURIComponent(averageRating)}&distanceKM=${encodeURIComponent(distanceKM)}`
    );
  };

  let urlImage;

  if (JSON.stringify(logo).slice(1, 9) === "/uploads") {
    urlImage = `http://localhost:8000/${logo.substring(9)}`;
  } else urlImage = logo;

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
        border: "1px solid #FF5252",
      }}
      onClick={handleCardClick}
      onMouseEnter={() => setHover(true)} // הגדרת מצב hover
      onMouseLeave={() => setHover(false)} // הגדרת מצב hover
    >
      <Card.Img variant="top" src={urlImage} />
      <Card.Body>
        <Card.Title style={{
          color: "#FF5252",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "15px"
        }}>{name}</Card.Title>
        <Card.Text style={{ fontWeight: "bold", fontSize: "1.1em" }}>{address}</Card.Text>
        <Card.Text> <span style={{ fontWeight: "bold" }}>Distance:</span> {distanceKM}</Card.Text>
        <Card.Text> <span style={{ fontWeight: "bold" }}>Rating:</span> {averageRating}</Card.Text>

        <Button
          variant="primary"
          id="btn"
          onClick={(e) => e.stopPropagation()
      } // הימנע מהפצת האירוע
          style={{
            backgroundColor: '#FF5252',
            color: '#f8f9fa',
            fontWeight: 'bold',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            border: '1px solid #FF5252',
            transition: 'all 0.3s ease-in-out',
            marginTop: 5,
          }}
        >
          More
        </Button>
        {/* <Button
          id="btn"
          onClick={(e) => e.stopPropagation()} // הימנע מהפצת האירוע
        >
          {name} Website
          <Link to="https://florentina.co.il/" />
        </Button> */}
        {/* <Button
          id="btn"
          onClick={(e) => {
            e.stopPropagation(); // הימנע מהפצת האירוע
            handleDeleteRestaurant(e);
          }}
        >
          Delete Restaurant
        </Button> */}
        {/* <Button
          id="btn"
          onClick={(e) => {
            e.stopPropagation(); // הימנע מהפצת האירוע
            setEditMode((prev) => !prev);
          }}
        >
          Edit Restaurant
        </Button> */}
      </Card.Body>
      {editMode && <EditRestaurant id={id} setEditMode={setEditMode} />}
    </Card>
  );
};

export default RestaurantItem;
