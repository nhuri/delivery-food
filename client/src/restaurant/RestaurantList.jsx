import React, { useEffect, useState } from "react";
import "./restaurant.css";
import RestaurantItem from "./RestaurantItem";
import { useGetRestaurantQuery } from "../slices/restaurantApiSlice";
import { useSelector } from "react-redux";
import { useGetNearbyRestaurantsQuery } from "../slices/userApiSlice";

const RestaurantList = ({ searchValue, selectedCategory }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);

  const userID = userInfo?.user?._id;

  // Fetch all restaurants
  const { data: allRestaurants, isLoading: isLoadingRestaurants } =
    useGetRestaurantQuery();

  // Fetch nearby restaurants based on user ID
  const { data: nearestRestaurantsToUser, isLoading: isLoadingNearby } =
    useGetNearbyRestaurantsQuery(userID, {
      skip: !userID, // Skip query if userID is not available
    });

  // Determine which list to display: nearby or filtered
  let restaurantList = allRestaurants;
  

  if (userID) restaurantList = nearestRestaurantsToUser?.data;

  // Filter restaurants based on search input
  if (selectedCategory === "All") selectedCategory = "";
  const filteredRestaurants = restaurantList?.filter(
    (restaurant) =>
      (restaurant.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        restaurant.foodCategory
          ?.toLowerCase()
          .includes(searchValue.toLowerCase())) &&
      restaurant.foodCategory
        ?.toLowerCase()
        .includes(selectedCategory.toLowerCase())
  );

  useEffect(() => {}, [restaurantList]);

  if (isLoadingRestaurants || (userID && isLoadingNearby)) {
    return <p>Loading...</p>; // Show a loading state while data is being fetched
  }

  return (
    <div className="row">
      {filteredRestaurants?.length > 0 ? (
        filteredRestaurants.map((restaurant) => (
          <RestaurantItem
            key={restaurant._id}
            id={restaurant._id}
            name={restaurant.name}
            logo={restaurant.logo}
            address={restaurant.address}
            location={restaurant.location}
            menu={restaurant.menu}
            statistics={restaurant.statistics}
            distanceKM={restaurant.distanceInKM}
          />
        ))
      ) : (
        <p>No restaurants found</p> // Message when no restaurants match the criteria
      )}
    </div>
  );
};

export default RestaurantList;
