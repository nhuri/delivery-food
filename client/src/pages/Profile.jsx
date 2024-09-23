import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);

  return (
    <div>
      <h1>User Profile</h1>
      {userInfo ? (
        <div>
          <p><strong>Name:</strong> {userInfo.name}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>Phone:</strong> {userInfo.phoneNumber}</p>
          <p><strong>Address:</strong> {userInfo.address}</p>
          {/* Add more fields as necessary */}
        </div>
      ) : (
        <p>No user information available. Please log in.</p>
      )}
    </div>
  );
};

export default Profile;