import React from "react";
import { Link } from "react-router-dom";

const RestrauntItem = ({
  id,
  name,
  logo,
  address,
  location,
  menu,
  statistics,
}) => {
  return (
    <Link to="#" className="card">
      <div>
        <img src={logo} alt={name} />
        <h2>{name}</h2>
        <h3>{address}</h3>
        {/* <Link to={`/${menu}`}>menu</Link> */}
        <h3>{statistics}</h3>
      </div>
    </Link>
  );
};

export default RestrauntItem;
