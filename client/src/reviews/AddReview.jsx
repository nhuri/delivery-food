import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import {
  useCreateReviewForMenuItemMutation,
  useCreateReviewForRestaurantMutation,
  useGetReviewsForMenuItemQuery,
  useGetReviewsForRestaurantQuery,
} from "../slices/reviewApiSlice";
import { useSelector } from "react-redux";
import "./AddReview.css";

const AddReview = ({ setAddMode, id, type }) => {
  const [inputComment, setInputComment] = useState("");
  const [inputRating, setInputRating] = useState("");
  const [inputReview, setInputReview] = useState("");

  let createReview;
  let refetch;
  if (type === "m") {
    [createReview] = useCreateReviewForMenuItemMutation();
    const { refetch: refetchReviews } = useGetReviewsForMenuItemQuery(id);
    refetch = refetchReviews;
  } else if (type === "r") {
    [createReview] = useCreateReviewForRestaurantMutation();
    const { refetch: refetchReviews } = useGetReviewsForRestaurantQuery(id);
    refetch = refetchReviews;
  }
  const userInfo = useSelector((state) => state.auth.userInfo);
  const userId = userInfo?.id;

  const handleAddReview = async (e) => {
    e.preventDefault();

    try {
      const author = userId;
      const rating = inputRating;
      const review = inputReview;
      const comment = inputComment;

      const response = await createReview({
        [type === "r" ? "restaurant" : "menuItem"]: id,
        author,
        rating,
        review,
        comment,
      }).unwrap();

      // Reset form and close add mode
      setAddMode(false);
      setInputComment("");
      setInputRating("");
      setInputReview("");
      if (refetch) refetch();
    } catch (error) {
      console.error("Error creating review:", error);
    }
  };

  return (
    <Form onSubmit={handleAddReview}>
      <h4>Add Review</h4>
      <InputGroup size="sm" className="mb-3">
        <Form.Control
          placeholder="Review"
          value={inputReview}
          onChange={(e) => setInputReview(e.target.value)}
          required
        />
      </InputGroup>
      <InputGroup size="sm" className="mb-3">
        <Form.Control
          placeholder="Rating (1-5)"
          type="number"
          value={inputRating}
          onChange={(e) => {
            const value = e.target.value;
            if (value >= 0 && value <= 5) {
              setInputRating(value);
            }
          }}
          min="0"
          max="5"
          required
        />
      </InputGroup>
      <InputGroup size="sm" className="mb-3">
        <Form.Control
          placeholder="Comment"
          value={inputComment}
          onChange={(e) => setInputComment(e.target.value)}
          required
        />
      </InputGroup>
      <Button type="submit">Add Review</Button>
    </Form>
  );
};

export default AddReview;
