import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import { useLocation } from "react-router-dom";

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
      <Card>
        <Card.Header as="h4">Reviews</Card.Header>
        <Card.Body>
          {reviewsArr.length > 0 ? (
            <ListGroup>
              {reviewsArr.map((review, index) => (
                <ListGroup.Item
                  key={review._id}
                  className="mb-3 p-3 border rounded"
                >
                  <Card>
                    <Card.Body>
                      <Card.Title className="d-flex">
                        Review {index + 1}
                      </Card.Title>
                      <Card.Subtitle className="d-flex mb-2 text-muted">
                        Rating: {review.rating}
                      </Card.Subtitle>
                      {/* <Card.Text className="d-flex">
                        Review: {review.review}
                      </Card.Text> */}
                      <Card.Text
                        style={{ whiteSpace: "nowrap" }}
                        className="d-flex"
                      >
                        Review: {review.review}
                      </Card.Text>

                      <Card.Text className="d-flex">
                        <strong>Comment:</strong> {review.comment}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>No reviews available</p>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ReviewsPage;
