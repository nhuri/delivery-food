import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useGetMenuItemsQuery } from "../slices/menuApiSlice";
import MenuItem from "./menuItem";
const MenuList = () => {
  const queryParams = new URLSearchParams(location.search);

  const navigateB = useNavigate();
  const handleBack = () => {
    navigateB(-1); // חוזר לדף הקודם
  };
  const id = queryParams.get("id");
  const { data } = useGetMenuByRestaurantIdQuery({ id });
  const dishes = data.items;
  return (
    <div>
      <Button onClick={handleBack}>Back</Button>
      <div className="row">
        {dishes?.map((menuItem) => (
          <MenuItem
            key={menuItem._id}
            id={menuItem._id}
            name={menuItem.name}
            description={menuItem.description}
            price={menuItem.price}
            category={menuItem.category}
            image={menuItem.image}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuList;
