import React from "react";
import { Card } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import ReviewCard from "./ReviewCard"; // Import the new ReviewCard component

const ReviewsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const reviewsArrString = queryParams.get("reviewsArrString");

  let reviewsArr = [];
  try {
    reviewsArr = JSON.parse(reviewsArrString || "[]");
  } catch (error) {
    console.error("Error parsing reviews array:", error);
    reviewsArr = [];
  }

  return (
    <div className="container mt-4">
     
          {reviewsArr.length > 0 ? (
            reviewsArr.map((review, index) => (
              <ReviewCard key={review._id} review={review} index={index} />
            ))
          ) : (
            <p>No reviews available</p>
          )}
      
    </div>
  );
};

export default ReviewsPage;
