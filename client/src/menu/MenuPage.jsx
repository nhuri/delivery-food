import React from "react";
import { Link } from "react-router-dom";

const MenuPage = () => {
  return (
    <div>
      <div>
        <Link to="/">
          <button>Back To Main</button>
        </Link>
      </div>
      MenuPage
    </div>
  );
};

export default MenuPage;
