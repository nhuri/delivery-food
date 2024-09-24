import React, { useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useGetReviewsForMenuItemQuery } from "../slices/reviewApiSlice";
import ReviewCard from "./ReviewCard";
import { useLocation } from "react-router-dom";
import "./ReviewsPage.css";
import AddReview from "./AddReview";

const ReiviewMenuItem = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const [addMode, setAddMode] = useState(false);

  const {
    data: getReviewsMenuItem,
    isLoading,
    error,
  } = useGetReviewsForMenuItemQuery(id, {
    skip: !id,
  });

  if (isLoading) return <p>Loading reviews...</p>;
  if (error) return <p>Error loading reviews: {error.message}</p>;

  const reviewsArr = getReviewsMenuItem?.data?.reviews || [];

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
        <Button variant="primary" onClick={() => setAddMode((prev) => !prev)}>
          {addMode ? "Cancel" : "Add review on the menu item"}
        </Button>
        {addMode && (
          <div style={{ marginTop: "20px" }}>
            <AddReview setAddMode={setAddMode} id={id} type={"m"} />
          </div>
        )}
      </Card>
    </div>
  );
};

export default ReiviewMenuItem;
