import React from "react";
import "./restaurant.css";
import RestaurantItem from "./RestaurantItem";
import { useGetRestaurantQuery } from "../slices/restaurantApiSlice";

const RestaurantList = () => {
  const { data } = useGetRestaurantQuery();
  return (
    <div className="row">
      {data?.map((restaurant) => (
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
  );
};

export default RestaurantList;
