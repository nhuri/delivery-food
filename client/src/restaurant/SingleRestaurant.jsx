import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "./SingleRestaurant.css";

const SingleRestaurant = ({
  id,
  name,
  logo,
  address,
  location,
  menu,
  statistics,
  distanceKM,
}) => {
  // const location2 = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const id = queryParams.get("id");
  // const name = queryParams.get("name");
  // const logo = queryParams.get("logo");
  // const address = queryParams.get("address");
  // const averageRating = queryParams.get("averageRating");
  // const distanceKM = queryParams.get("distanceKM");

  const navigate = useNavigate();

  let urlImage;
  if (logo?.startsWith("/uploads")) {
    urlImage = `http://localhost:8000/${logo}`;
  } else {
    urlImage = logo;
  }

  const handleMenuPage = () => {
    navigate(`/MenuList?id=${id}`);
  };

  const handleReviewsPage = () => {
    // const reviewsArrString = JSON.stringify(reviewsArr);
    // const encodedReviewsArrString = encodeURIComponent(reviewsArrString);
    navigate(`/ReviewsPage?id=${id}`);


    // navigate(`/ReviewsPage?id=${id}`);
  };

  const handleBack = () => {
    navigate(-1); // This will navigate back to the previous page
  };

  return (
    <div className="single-restaurant-page">
      {/* Back button */}
      <div className="back-button-container my-3">
        <Button onClick={handleBack} className="btn btn-outline-dark">
          &larr; Back
        </Button>
      </div>

      {/* Full-width image header */}
      <header className="restaurant-header">
        <img src={urlImage} alt={name} className="restaurant-image" />
        <div className="overlay">
          <div>
            <h1 className="restaurant-title">{name}</h1>
          </div>
          <Button
            onClick={handleMenuPage}
            className="btn btn-outline-dark mx-2"
          >
            View Menu
          </Button>
          <Button
            onClick={handleReviewsPage}
            className="btn btn-outline-dark mx-2"
          >
            View Reviews
          </Button>
        </div>
      </header>

      {/* Restaurant details section */}
      <div className="restaurant-details container">
        <div className="row mb-5">
          <div className="col-lg-4 col-md-6">
            <h2>Address</h2>
            <p>{address}</p>
          </div>
          <div className="col-lg-4 col-md-6">
            <h2>Distance</h2>
            <p>{distanceKM} KM</p>
          </div>
          <div className="col-lg-4 col-md-6">
            <h2>Average Rating</h2>
            <p>{averageRating}</p>
          </div>
        </div>

        {/* Buttons */}
      </div>
    </div>
  );
};

export default SingleRestaurant;
