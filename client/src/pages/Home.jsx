import React from "react";
import RestaurantList from "../restaurant/RestaurantList";
import NavbarHome from "../components/navbarHome";
const Home = () => {
  return (
    <>
      <NavbarHome />
      <RestaurantList />
    </>
  );
};

export default Home;
