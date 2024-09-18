import React from "react";
import { Card } from "react-bootstrap";
import "./ReviewCard.css";
const ReviewCard = ({ review, index }) => {
  return (
    <Card className="review-card">
      <Card.Body>
        <Card.Title>Review {index + 1}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Rating: {review.rating}
        </Card.Subtitle>
        <div className="review-content">
          <Card.Text className="review-text">{review.review}</Card.Text>
          <Card.Text className="review-comment">
            <strong>Comment:</strong> {review.comment}
          </Card.Text>
        </div>
      </Card.Body>
    </Card>
  );
};


export default ReviewCard;