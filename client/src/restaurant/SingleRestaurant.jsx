import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./restaurant.css";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const SingleRestaurant = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // הוצאת הפרמטרים מה-query params
  const id = queryParams.get("id");
  const name = queryParams.get("name");
  const logo = queryParams.get("logo");
  const address = queryParams.get("address");
  const locationParam = queryParams.get("location");
  const menu = queryParams.get("menu");
  const statistics = queryParams.get("statistics");
  const navigate = useNavigate();
  const handleMenuPage = () => {
    navigate(`/MenuList?id=${id}`);
  };
  let urlImage;

  if (JSON.stringify(logo).slice(1, 9) === "/uploads") {
    urlImage = `http://localhost:8000/${logo.substring(9)}`;
  } else urlImage = logo;

  return (
    <>
      <div id="singleRestaurant">
        <Link to="/">
          <Button>Back</Button>
        </Link>

        <div className="restaurant-card">
          <div className="restaurant-info">
            <h2 className="restaurant-name">{name}</h2>
            <div id="ch" className="d-flex justify-content-center">
              <div className="restaurant-address">
                <p>Our adress: {address}</p>
                <Button onClick={handleMenuPage}>menu</Button>
              </div>

              <img src={urlImage} alt={name} className="restaurant-logo" />

              <div className="restaurant-statistics">
                <p className="restaurant-location">{locationParam}</p>
                <h3>Statistics:</h3>
                <p>{statistics}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleRestaurant;
