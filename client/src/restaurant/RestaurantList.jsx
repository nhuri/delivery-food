import React, { useEffect, useState } from "react";
import "./restaurant.css";
import RestaurantItem from "./RestaurantItem";
import { useGetRestaurantQuery } from "../slices/restaurantApiSlice";
import { useSelector } from "react-redux";
import { useGetNearbyRestaurantsQuery } from "../slices/userApiSlice";

const RestaurantList = ({ searchValue }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const userID = userInfo?.user._id;

  // Fetch all restaurants
  const { data: allRestaurants, isLoading: isLoadingRestaurants } =
    useGetRestaurantQuery();
  console.log(allRestaurants);

  // Fetch nearby restaurants based on user ID
  const { data: nearestRestaurantsToUser, isLoading: isLoadingNearby } =
    useGetNearbyRestaurantsQuery(userID, {
      skip: !userID, // Skip query if userID is not available
    });
  console.log(nearestRestaurantsToUser);

  // Filter restaurants based on search input
  const filteredRestaurants = allRestaurants?.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      restaurant.address?.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Determine which list to display: nearby or filtered
  let restaurantList = filteredRestaurants;
  // userID && nearestRestaurantsToUser?.length > 0
  //   ? nearestRestaurantsToUser
  //   : filteredRestaurants;
  if (userID) restaurantList = nearestRestaurantsToUser.data;

  useEffect(() => {
    if (restaurantList) {
      console.log(restaurantList); // Debugging purposes
    }
  }, [restaurantList]);

  if (isLoadingRestaurants || (userID && isLoadingNearby)) {
    return <p>Loading...</p>; // Show a loading state while data is being fetched
  }

  return (
    <div className="row">
      {restaurantList?.length > 0 ? (
        restaurantList.map((restaurant) => (
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
        ))
      ) : (
        <p>No restaurants found</p> // Message when no restaurants match the criteria
      )}
    </div>
  );
};

export default RestaurantList;
