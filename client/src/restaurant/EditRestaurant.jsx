import React, { useState } from "react";
import {
  useEditRestaurantMutation,
  useGetRestaurantQuery,
} from "../slices/restaurantApiSlice";
import Button from "react-bootstrap/Button";

const EditRestaurant = ({ id, setEditMode }) => {
  const [inputName, setInputName] = useState("");
  const [inputLogo, setInputLogo] = useState("");
  const [inputAdress, setInputAdress] = useState("");
  const [inputStatistics, setInputStatistics] = useState("");
  const [editRestaurant] = useEditRestaurantMutation();
  const { refetch } = useGetRestaurantQuery();

  const handleEditRestaurant = async (e) => {
    e.preventDefault();
    const restaurantId = id;
    const response = await editRestaurant({
      restaurantId,
      data: {
        name: inputName,
        logo: inputLogo,
        address: inputAdress,
        statistics: inputStatistics,
      },
    }).unwrap();
    refetch();
    setEditMode(false);
  };
  return (
    <div className="editRestaurant">
      <h4>Edit the restaurant</h4>
      <input
        onChange={(e) => setInputName(e.target.value)}
        type="text"
        placeholder="Enter the name"
      />
      <input
        onChange={(e) => setInputLogo(e.target.value)}
        type="text"
        placeholder="Enter the logo link"
      />
      <input
        onChange={(e) => setInputAdress(e.target.value)}
        type="text"
        placeholder="Enter the adress"
      />
      <input
        onChange={(e) => setInputStatistics(e.target.value)}
        type="text"
        placeholder="Enter the statistics"
      />
      <Button onClick={handleEditRestaurant}>Edit Restaurant</Button>
    </div>
  );
};

export default EditRestaurant;
