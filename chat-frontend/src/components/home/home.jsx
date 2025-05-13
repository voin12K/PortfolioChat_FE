import React from "react";
import "./home.scss";
import Sap from "../ui/sap/sap";
import People from "../ui/peoples/people";

export default function Home() {
  return (
    <div className="home">
      <div className="home-header wrapper">
        <Sap />
      </div>
      <div className="home-content wrapper">
        <div className="peoples">
          <People />
        </div>
      </div>
    </div>
  );
}