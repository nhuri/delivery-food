import React, { useEffect, useState } from "react";
import "./restaurant.css";
import RestaurantItem from "./RestaurantItem";
import { useGetRestaurantQuery } from "../slices/restaurantApiSlice";
import { useSelector } from "react-redux";
import { useGetNearbyRestaurantsQuery } from "../slices/userApiSlice";
// import { RestaurantCard } from "../components/restaurant_card"


const RestaurantList = ({ searchValue, selectedCategory }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);

  const userID = userInfo?.user?._id;

  // Fetch all restaurants
  const { data: allRestaurants, isLoading: isLoadingRestaurants } =
    useGetRestaurantQuery();
  console.log(allRestaurants)
  // Fetch nearby restaurants based on user ID
  const { data: nearestRestaurantsToUser, isLoading: isLoadingNearby } =
    useGetNearbyRestaurantsQuery(userID, {
      skip: !userID, // Skip query if userID is not available
    });
  console.log(nearestRestaurantsToUser)
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

  useEffect(() => { }, [restaurantList]);

  if (isLoadingRestaurants || (userID && isLoadingNearby)) {
    return <p>Loading...</p>; // Show a loading state while data is being fetched
  }

  return (
    <div className="restaurant-list-container"> {/* Added this container */}
      <div className="restaurant-grid"> {/* Changed from 'row' to 'restaurant-grid' */}
        {filteredRestaurants?.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <RestaurantItem
              key={restaurant._id}
              id={restaurant._id}
              name={restaurant.name}
              logo={restaurant.logo}
              address={restaurant.address}
              menu={restaurant.menu}
              statistics={restaurant.statistics}
              distanceKM={restaurant.distanceInKM}
            />
          ))
        ) : (
          <p>No restaurants found</p> // Message when no restaurants match the criteria
        )}
      </div>
    </div>
  );
};

export default RestaurantList;
