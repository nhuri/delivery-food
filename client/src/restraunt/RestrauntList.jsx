import React from "react";
import "./restraunt.css";
import restraunts from "../restraunts";
import RestrauntItem from "./RestrauntItem";

const RestrauntList = () => {
  return (
    <div className="row">
      {restraunts?.map((restraunt) => (
        <RestrauntItem
          key={restraunt.id}
          name={restraunt.name}
          logo={restraunt.logo}
          address={restraunt.address}
          location={restraunt.location}
          menu={restraunt.menu}
          restraunt={restraunt.statistics}
        />
      ))}
    </div>
  );
};

export default RestrauntList;
