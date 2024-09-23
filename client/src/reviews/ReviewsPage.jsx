import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useGetReviewsForRestaurantQuery } from "../slices/reviewApiSlice";
import ReviewCard from "./ReviewCard";
import "./ReviewsPage.css";

const ReviewsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const {
    data: getReviewsRestaurant,
    isLoading,
    error,
  } = useGetReviewsForRestaurantQuery(id, {
    skip: !id,
  });

  if (isLoading) return <p>Loading reviews...</p>;
  if (error) return <p>Error loading reviews: {error.message}</p>;

  const reviewsArr = getReviewsRestaurant?.data?.reviews || [];

  return (
    <div className="reviews-container">
      <Card className="board">
        <Card.Header as="h4">Reviews</Card.Header>
        <Card.Body>
          {reviewsArr.length > 0 ? (
            <Row xs={1} sm={2} md={3} lg={4} xl={6} className="g-4">
              {reviewsArr.map((review, index) => (
                <Col key={review._id || index}>
                  <ReviewCard review={review} index={index} />
                </Col>
              ))}
            </Row>
          ) : (
            <p>No reviews available</p>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ReviewsPage;
