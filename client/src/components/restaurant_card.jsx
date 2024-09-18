import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import EditRestaurant from "../restaurant/EditRestaurant";
import {
  useDeleteRestaurantMutation,
  useGetRestaurantQuery,
} from "../slices/restaurantApiSlice";
import "../restaurant/restaurant.css";
import { useGetReviewsQuery } from "../slices/reviewApiSlice";

export default RestaurantCard = ({
  id,
  name,
  logo,
  address,
  location,
  menu,
  statistics,
  distanceKM,
}) =>  {
  {
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
  console.log(getReviewsRestaurant);
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
      `/SingleRestaurant?id=${id}&name=${encodeURIComponent(
        name
      )}&logo=${encodeURIComponent(logo)}&address=${encodeURIComponent(
        address
      )}&location=${encodeURIComponent(location)}&menu=${encodeURIComponent(
        menu
      )}&statistics=${encodeURIComponent(
        statistics
      )}&averageRating=${encodeURIComponent(
        averageRating
      )}&reviewsArr=${encodeURIComponent(JSON.stringify(reviewsArr))}
       &distanceKM=${encodeURIComponent(distanceKM)}`
    );
  };

  let urlImage;

  if (JSON.stringify(logo).slice(1, 9) === "/uploads") {
    urlImage = `http://localhost:8000/${logo.substring(9)}`;
  } else urlImage = logo;

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image="/static/images/cards/contemplative-reptile.jpg"
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
        {name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
  }}

