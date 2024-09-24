import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfoOnLoginOrRegister } from "../slices/authSlice"; // Import the action
import { useUpdateUserMutation } from "../slices/userApiSlice"; // Import the mutation
import './Profile.css';

const Profile = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUserInfo, setUpdatedUserInfo] = useState({
    _id: userInfo?.id,
    name: userInfo?.name,
    email: userInfo?.email,
    phoneNumber: userInfo?.phoneNumber,
    address: userInfo?.address,
  });
  
  const dispatch = useDispatch();
  const [updateUser] = useUpdateUserMutation(); // Use the mutation

  useEffect(() => {
    if (userInfo) {
      setUpdatedUserInfo({
        _id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        phoneNumber: userInfo.phoneNumber,
        address: userInfo.address,
      });
    }
  }, [userInfo]);

  const handleSaveClick = async () => {
    try {
      const updatedUser = await updateUser(updatedUserInfo).unwrap(); // Make the API call
      dispatch(setUserInfoOnLoginOrRegister(updatedUser)); // Update Redux with new user info
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserInfo({ ...updatedUserInfo, [name]: value });
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
              />
              <input
                type="email"
                name="email"
                value={updatedUserInfo.email}
                onChange={handleChange}
              />
              <input
                type="text"
                name="phoneNumber"
                value={updatedUserInfo.phoneNumber}
                onChange={handleChange}
              />
              <input
                type="text"
                name="address"
                value={updatedUserInfo.address}
                onChange={handleChange}
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
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No restaurants added yet.</p>
              )}
              <button className="add-restaurant-button">Add New Restaurant</button>
            </div>
          )}
        </div>
      ) : (
        <p className="profile-message">No user information available. Please log in.</p>
      )}
    </div>
  );
};

export default Profile;
