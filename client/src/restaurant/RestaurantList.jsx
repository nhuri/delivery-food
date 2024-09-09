import React, { useState } from "react";
import "./restaurant.css";
import RestaurantItem from "./RestaurantItem";
import { useGetRestaurantQuery } from "../slices/restaurantApiSlice";

const RestaurantList = ({ searchValue }) => {
  const { data } = useGetRestaurantQuery();
  const filteredRestaurants = data?.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      restaurant.address?.toLowerCase().includes(searchValue.toLowerCase())
  );
  return (
    <>
      <div className="row">
        {filteredRestaurants?.map((restaurant) => (
          <RestaurantItem
            key={restaurant._id}
            id={restaurant._id}
            name={restaurant.name}
            logo={restaurant.logo}
            address={restaurant.address}
            location={restaurant.location}
            menu={restaurant.menu}
            statistics={restaurant.statistics}
          />
        ))}
      </div>
    </>
  );
};

export default RestaurantList;
