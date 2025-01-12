import React from "react";
import "./vischat.scss";

const VisChat = () => {
  return (
    <div className="chat-container">
      <div className="messages">
        <div className="message-row left">
          <div className="avatar"></div>
          <div className="message">Сообщение от пользователя</div>
        </div>
        <div className="message-row right">
          <div className="message">Ответ</div>
          <div className="avatar"></div>
        </div>
        <div className="message-row left">
          <div className="avatar"></div>
          <div className="message">Ещё одно сообщение</div>
        </div>
        <div className="message-row right">
          <div className="message">Ответ на сообщение</div>
          <div className="avatar"></div>
        </div>
      </div>
      <div className="input-area">
        <button className="emoji-btn">😊</button>
        <input type="text" placeholder="Введите сообщение..." />
        <button className="send-btn">➤</button>
      </div>
    </div>
  );
};

export default VisChat;
