import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useGetMenuByRestaurantIdQuery } from "../slices/menuApiSlice";
import MenuItems from "./MenuItems";
const MenuList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const id = queryParams.get("id"); //restaurantId

 
  const { data } = useGetMenuByRestaurantIdQuery(id);
  

  return (
    <div>
      
      <div className="row">
        {data?.map((menuItems) => (
          <MenuItems
            key={menuItems._id}
            id={menuItems._id}
            name={menuItems.name}
            description={menuItems.description}
            image={menuItems.image}
            items={menuItems.items}
            res_id = {id}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuList;
