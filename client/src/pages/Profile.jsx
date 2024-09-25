import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfoOnLoginOrRegister } from "../slices/authSlice"; // Import the action
import { useUpdateUserMutation } from "../slices/userApiSlice"; // Import the mutation
import { useGetRestaurantStatisticsQuery } from "../slices/StatisticsApiSlice"; // Import the query for fetching statistics
import "./Profile.css";

const Profile = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();
  const [updateUser] = useUpdateUserMutation(); // Use the mutation

  const [isEditing, setIsEditing] = useState(false);
  const [updatedUserInfo, setUpdatedUserInfo] = useState({
    _id: "",
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  // Sync local state with userInfo from Redux
  useEffect(() => {
    if (userInfo) {
      setUpdatedUserInfo({
        _id: userInfo.id, // Ensure to use userInfo.id
        name: userInfo.name,
        email: userInfo.email,
        phoneNumber: userInfo.phoneNumber,
        address: userInfo.address,
      });
    }
  }, [userInfo]); // Dependency array to update whenever userInfo changes

  // Handle saving the updated user information
  const handleSaveClick = async () => {
    try {
      const updatedUser = await updateUser(updatedUserInfo).unwrap(); // Make the API call
      dispatch(setUserInfoOnLoginOrRegister(updatedUser)); // Update Redux with new user info
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Failed to update user:", error);
    }
    window.location.reload();
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserInfo((prev) => ({ ...prev, [name]: value })); // Update the specific field in updatedUserInfo
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">User Profile</h1>
      {userInfo ? (
        <div className="profile-card">
          <h2 className="profile-subtitle">Personal Information</h2>
          {isEditing ? (
            <div>
              <input
                type="text"
                name="name"
                value={updatedUserInfo.name}
                onChange={handleChange}
                placeholder="Name"
              />
              <input
                type="email"
                name="email"
                value={updatedUserInfo.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <input
                type="text"
                name="phoneNumber"
                value={updatedUserInfo.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
              />
              <input
                type="text"
                name="address"
                value={updatedUserInfo.address}
                onChange={handleChange}
                placeholder="Address"
              />
              <button onClick={handleSaveClick}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          ) : (
            <div>
              <p className="profile-text">
                <strong>Name:</strong> {userInfo.name}
              </p>
              <p className="profile-text">
                <strong>Email:</strong> {userInfo.email}
              </p>
              <p className="profile-text">
                <strong>Phone:</strong> {userInfo.phoneNumber}
              </p>
              <p className="profile-text">
                <strong>Address:</strong> {userInfo.address}
              </p>
              <button onClick={() => setIsEditing(true)}>Edit</button>
            </div>
          )}

          {/* Admin Panel for Restaurant Owners */}
          {userInfo.role === "restaurant-owner" && (
            <div className="admin-panel">
              <h2 className="profile-subtitle">Admin Panel</h2>
              <p>Restaurants you've added:</p>
              {userInfo.restaurants && userInfo.restaurants.length > 0 ? (
                <ul>
                  {userInfo.restaurants.map((restaurant) => (
                    <li key={restaurant._id}>
                      <strong>{restaurant.name}</strong> - {restaurant.address}
                      <Statistics restaurantId={restaurant._id} />{" "}
                      {/* No need to check for restaurant._id here */}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No restaurants added yet.</p>
              )}
              <button className="add-restaurant-button">
                Add New Restaurant
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="profile-message">
          No user information available. Please log in.
        </p>
      )}
    </div>
  );
};

// New component to fetch and display statistics for each restaurant
const Statistics = ({ restaurantId }) => {
  const {
    data: stats,
    error,
    isLoading,
  } = useGetRestaurantStatisticsQuery(restaurantId); // Fetch statistics for the given restaurantId

  if (isLoading) return <p>Loading statistics...</p>;
  if (error) return <p>Error fetching statistics.</p>;

  return (
    <div className="restaurant-stats">
      <p>
        <strong>Orders:</strong> {stats.orders}
      </p>
      <p>
        <strong>Average Rating:</strong> {stats.averageRating}
      </p>
      <p>
        <strong>Total Reviews:</strong> {stats.reviews.length}
      </p>
    </div>
  );
};

export default Profile;
