import React from "react";
import "./chat.scss"
import { io } from "socket.io-client";


export default function Chat(){

    return(
        <div className="Chat">
            <div className="Messeges" id="message-container"></div>
            <form className="form">
                <input type="text"></input>
                <button type="sumbit"> Send</button>

            </form>
        </div>
    )
}