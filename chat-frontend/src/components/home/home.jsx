import React from "react";
import "./home.scss"
import Sap from "../ui/sap/sap";
import Chat from "../ui/chat/chat";
import People from "../ui/peoples/people";

export default function Home(){
    return(
        <div className="Home">
            <div className="Saap"><Sap/></div>
            <div className="Home-under">
                <div className="Peoples"><People/></div>
                <div className="Chats"><Chat/></div>
            </div>
        </div>
    )
}