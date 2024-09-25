import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "./SingleRestaurant.css";
import { useGetTopThreeByRestaurantIdQuery } from "../slices/reviewApiSlice";
import { useGetTopThreeBySalesQuery } from "../slices/restaurantApiSlice";
import RButton from "../components/rButton";
import OrderItemModal from "../components/OrderItemModal";

const SingleRestaurant = () => {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);

  const id = queryParams.get("id");
  const name = queryParams.get("name");
  const logo = queryParams.get("logo");
  const address = queryParams.get("address");
  const averageRating = queryParams.get("averageRating");
  const distanceKM = queryParams.get("distanceKM");
  const [hover, setHover] = useState(false);
  const reviewTarget = id;
  const { data: getTopThree } = useGetTopThreeByRestaurantIdQuery(
    reviewTarget,
    {
      skip: !reviewTarget,
    }
  );
  useEffect(() => {}, [getTopThree]);
  // console.log(getTopThree.data.topThree);

  const restaurantId = id;
  const { data: getTopThreeBySales } = useGetTopThreeBySalesQuery(
    restaurantId,
    {
      skip: !restaurantId,
    }
  );
  useEffect(() => {}, [getTopThreeBySales]);

  let urlImage;

  if (logo?.startsWith("/uploads")) {
    urlImage = `http://localhost:8000/${logo.substring(9)}`;
  } else {
    urlImage = logo;
  }

  const handleOrderMenuItem = (item) => {
    setSelectedItem(item);
    setShowOrderModal(true);
  };

  const handleMenuPage = () => {
    navigate(`/MenuList?id=${id}`);
  };

  const handleReviewsPage = () => {
    // const reviewsArrString = JSON.stringify(reviewsArr);
    // const encodedReviewsArrString = encodeURIComponent(reviewsArrString);
    navigate(`/ReviewsPage?id=${id}`);

    // navigate(`/ReviewsPage?id=${id}`);
  };

  const handleBackClick = () => {
    navigate(-1); // This will navigate back to the previous page
  };
  const handleCardClick = () => {
    // navigate(
    //   `/SingleRestaurant?id=${id}&name=${encodeURIComponent(name)}&logo=${encodeURIComponent(logo)}&address=${encodeURIComponent(address)}&averageRating=${encodeURIComponent(averageRating)}&distanceKM=${encodeURIComponent(distanceKM)}`
    // );
  };

  return (
    <div className="single-restaurant-page">
      {/* Back button */}
      <RButton
        onClick={handleBackClick} // Pass the navigation handler to onClick
        hoverEffect={true}
        visibleTo="all" // Visible to all users
      >
        Back
      </RButton>

      {/* Full-width image header */}
      <header className="restaurant-header">
        <img src={urlImage} alt={name} className="restaurant-image" />
        <div className="overlay">
          <div>
            <h1 className="restaurant-title">{name}</h1>
          </div>
          <rButton
            onClick={handleMenuPage}
            className="btn btn-outline-danger mx-2"
          >
            View Menu
          </rButton>
          <rButton
            onClick={handleReviewsPage}
            className="btn btn-outline-dark mx-2"
          >
            View Reviews
          </rButton>
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
        <h1>Most popular by rating</h1>
        <div className="d-flex flex-wrap justify-content-start">
          {getTopThree?.data.topThree.map((obj) => {
            return (
              <Card
                key={obj.item._id}
                style={{
                  width: "18rem",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer", // מציין שהכרטיס ניתן ללחיצה
                  transform: hover ? "scale(1.02)" : "scale(1)", // מגדיל את הכרטיס כאשר העכבר עובר עליו
                  boxShadow: hover
                    ? "0 4px 8px rgba(0, 0, 0, 0.2)"
                    : "0 2px 4px rgba(0, 0, 0, 0.1)", // מוסיף צל כאשר העכבר עובר עליו
                  border: "1px solid #FF5252",
                }}
                onClick={handleCardClick}
                onMouseEnter={() => setHover(true)} // הגדרת מצב hover
                onMouseLeave={() => setHover(false)} // הגדרת מצב hover
              >
                <Card.Img
                  variant="top"
                  src={`http://localhost:8000/${obj.item.image?.substring(9)}`}
                />
                <Card.Body>
                  <Card.Title
                    style={{
                      color: "#FF5252",
                      fontWeight: "bold",
                      textAlign: "center",
                      marginBottom: "15px",
                    }}
                  >
                    {obj.item.name}
                  </Card.Title>
                  <Card.Text style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                    price:
                    {obj.item.price}
                  </Card.Text>
                  <Card.Text>
                    {" "}
                    <span style={{ fontWeight: "bold" }}>
                      Description:
                    </span>{" "}
                    {obj.item.description}
                  </Card.Text>
                  <Card.Text>
                    {" "}
                    <span style={{ fontWeight: "bold" }}>Rating:</span>{" "}
                    {obj.averageRating}
                  </Card.Text>
                </Card.Body>
              </Card>
            );
          })}
        </div>
        <h1>Most popular by sales</h1>
        <div className="d-flex flex-wrap justify-content-start">
          {getTopThreeBySales?.map((obj, index) => {
            return (
              <Card
                key={`${obj.menuItem?._id}-${index}`}
                style={{
                  width: "18rem",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer", // מציין שהכרטיס ניתן ללחיצה
                  transform: hover ? "scale(1.02)" : "scale(1)", // מגדיל את הכרטיס כאשר העכבר עובר עליו
                  boxShadow: hover
                    ? "0 4px 8px rgba(0, 0, 0, 0.2)"
                    : "0 2px 4px rgba(0, 0, 0, 0.1)", // מוסיף צל כאשר העכבר עובר עליו
                  border: "1px solid #FF5252",
                }}
                onClick={handleCardClick}
                onMouseEnter={() => setHover(true)} // הגדרת מצב hover
                onMouseLeave={() => setHover(false)} // הגדרת מצב hover
              >
                <Card.Img
                  variant="top"
                  src={`http://localhost:8000/${obj.menuItem?.image?.substring(
                    9
                  )}`}
                />
                <Card.Body>
                  <Card.Title
                    style={{
                      color: "#FF5252",
                      fontWeight: "bold",
                      textAlign: "center",
                      marginBottom: "15px",
                    }}
                  >
                    {obj.menuItem?.name}
                  </Card.Title>
                  <Card.Text style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                    price:
                    {obj.menuItem?.price}
                  </Card.Text>
                  <Card.Text>
                    {" "}
                    <span style={{ fontWeight: "bold" }}>
                      Description:
                    </span>{" "}
                    {obj.menuItem?.description}
                  </Card.Text>
                  <Card.Text>
                    {" "}
                    <span style={{ fontWeight: "bold" }}>Sold:</span> {obj.sold}
                  </Card.Text>
                  <Button
                    variant="success"
                    onClick={() => handleOrderMenuItem(obj.menuItem)}
                    className="me-2"
                  >
                    Add to Order
                  </Button>
                </Card.Body>
                <OrderItemModal
                  show={showOrderModal}
                  onHide={() => {
                    setShowOrderModal(false);
                    setSelectedItem(null);
                  }}
                  item={selectedItem}
                />
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SingleRestaurant;
