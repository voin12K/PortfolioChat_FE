import React from "react";
import "./search.scss"

import { ReactComponent as SearchIcon } from "../../../../assets/icons/search.svg";

export default function Search(){
    return(
        <div className="Search">
            <SearchIcon/>
            <input className="Search-input" placeholder="Search"/>
        </div>
    )
}