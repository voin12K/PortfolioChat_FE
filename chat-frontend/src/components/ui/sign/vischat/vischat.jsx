import React from "react";
import "./vischat.scss";

import { ReactComponent as Emoji } from "../../../../assets/icons/emoji.svg";
import { ReactComponent as Files } from "../../../../assets/icons/files.svg";
import { ReactComponent as Send } from "../../../../assets/icons/send.svg";

import Davatar  from "../../../../assets/images/3Davatar.png";
import Vavatar  from "../../../../assets/images/Voinavatar.png";

const VisChat = () => {
  return (
    <div className="chat-container">
      <div className="messages">
        <div className="message-row-left">
          <img src={Davatar} alt="3D avatar" className="avatar" />
          <div className="message-left">Hey, are you free this weekend?</div>
        </div>
        <div className="message-row-right">
          <div className="message-right">Hi! Yeah, I think I am. What's up?</div>
          <img src={Vavatar} alt="Voin avatar" className="avatar" />
        </div>
        <div className="message-row-left">
          <img src={Davatar} alt="3D avatar" className="avatar" />
          <div className="message-left">It's Alex's birthday on Sunday. I was thinking we could plan a surprise party.</div>
        </div>
        <div className="message-row-right">
          <div className="message-right">That's a great idea! Where do you want to have it?</div>
          <img src={Vavatar} alt="Voin avatar" className="avatar" />
        </div>
        <div className="message-row-left">
          <img src={Davatar} alt="3D avatar" className="avatar" />
          <div className="message-left">Maybe at my place? It’s spacious enough for everyone.</div>
        </div>
        <div className="message-row-right">
          <div className="message-right">Perfect. Do you want me to help with the decorations?</div>
          <img src={Vavatar} alt="Voin avatar" className="avatar" />
        </div>
        <div className="message-row-left">
          <img src={Davatar} alt="3D avatar" className="avatar" />
          <div className="message-left">Yes, please. Balloons, streamers, maybe some fairy lights.</div>
        </div>
        <div className="message-row-right">
          <div className="message-right">Got it. What about food and drinks?</div>
          <img src={Vavatar} alt="Voin avatar" className="avatar" />
        </div>
        <div className="message-row-left">
          <img src={Davatar} alt="3D avatar" className="avatar" />
          <div className="message-left">I'll order pizza and wings. Can you bring some snacks and soda?</div>
        </div>
        <div className="message-row-right">
          <div className="message-right">Sure thing. Do we have a playlist in mind?</div>
          <img src={Vavatar} alt="Voin avatar" className="avatar" />
        </div>
        <div className="message-row-left">
          <img src={Davatar} alt="3D avatar" className="avatar" />
          <div className="message-left">Not yet. Maybe we can both add songs to a shared playlist?</div>
        </div>
        <div className="message-row-right">
          <div className="message-right">Good idea. I'll start one on Spotify and share it with you.</div>
          <img src={Vavatar} alt="Voin avatar" className="avatar" />
        </div>
        <div className="message-row-left">
          <img src={Davatar} alt="3D avatar" className="avatar" />
          <div className="message-left">Awesome. What time should we start?</div>
        </div>
        <div className="message-row-right">
          <div className="message-right">How about 6 PM? That way everyone can come after work.</div>
          <img src={Vavatar} alt="Voin avatar" className="avatar" />
        </div>
        <div className="message-row-left">
          <img src={Davatar} alt="3D avatar" className="avatar" />
          <div className="message-left">Sounds good. Do you think we need a cake?</div>
        </div>
        <div className="message-row-right">
          <div className="message-right">Of course! I'll get one. Chocolate, right?</div>
          <img src={Vavatar} alt="Voin avatar" className="avatar" />
        </div>
        <div className="message-row-left">
          <img src={Davatar} alt="3D avatar" className="avatar" />
          <div className="message-left">Yes, Alex loves chocolate. Thanks a lot for helping!</div>
        </div>
      </div>
      <div className="input-position">
        <div className="input-area">
          <div>
            <Emoji />
            <Files />
          </div>
          <div><Send /></div>
        </div>
      </div>
    </div>
  );
};

export default VisChat;



