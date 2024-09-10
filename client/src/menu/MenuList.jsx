import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useGetMenuByIdQuery } from "../slices/menuApiSlice";
import MenuItem from "./menuItem";
const MenuList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const id = queryParams.get("id"); //restaurantId

  const navigateB = useNavigate();
  const handleBack = () => {
    navigateB(-1); // חוזר לדף הקודם
  };
  const { data } = useGetMenuByIdQuery(id);
  // const dishes = data[items];
  if (data && data.items) console.log("hello");

  return (
    <div>
      <Button onClick={handleBack}>Back</Button>
      <div className="row">
        {/* {dishes?.map((menuItem) => (
          <MenuItem
            key={menuItem._id}
            idd={menuItem._id}
            name={menuItem.name}
            description={menuItem.description}
            price={menuItem.price}
            category={menuItem.category}
            image={menuItem.image}
          />
        ))} */}
      </div>
    </div>
  );
};

export default MenuList;
