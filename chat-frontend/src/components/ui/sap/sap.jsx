import React from "react";
import "./sap.scss"
import Search from "./search/search";
import Profile from "./profile/profile";

export default function Sap(){
    return(
        <div className="sap">
            <Search/>
            <Profile/>
        </div>
    )
}