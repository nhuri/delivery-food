import React from "react";
import { useGetReviewsQuery } from "../slices/reviewApiSlice";

const ReiviewMenuItem = ({ id }) => {
  const reviewTarget = id;
  const { data: getReviewsMenuItem } = useGetReviewsQuery(
    "menuItem",
    reviewTarget,
    { skip: !reviewTarget }
  );
  return <div>${getReviewsMenuItem}</div>;
};

export default ReiviewMenuItem;
