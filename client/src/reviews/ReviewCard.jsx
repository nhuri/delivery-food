import React from "react";
import { Card } from "react-bootstrap";

const ReviewCard = ({ review, index }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>Review {index + 1}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Rating: {review.rating}
        </Card.Subtitle>
        <Card.Text style={{ whiteSpace: "nowrap" }}>
          Review: {review.review}
        </Card.Text>
        <Card.Text>
          <strong>Comment:</strong> {review.comment}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ReviewCard;
