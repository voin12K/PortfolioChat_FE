import React, { useState, useEffect } from "react";
import "./people.scss";
import axios from "axios";
import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";

export default function People() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/api/chats/my", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setChats(response.data);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error("Error fetching chats:", err);
        setError(err.response?.data?.message || "Failed to load chats");
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'HH:mm');
  };

  const handleChatClick = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <div className="People">
      <div className="People-wrapper">
        {loading ? (
          <div className="People-loading">Loading chats...</div>
        ) : error ? (
          <div className="People-error">{error}</div>
        ) : (
          <div className="People-list">
            {chats.length === 0 ? (
              <p className="no-chats">No active chats found</p>
            ) : (
              chats.map((chat) => (
                <div 
                  key={chat._id} 
                  className="People-item"
                  onClick={() => handleChatClick(chat._id)}
                  style={{ cursor: 'pointer' }} 
                >
                  {chat.type === 'private' ? (
                    <div className="chat-info">
                      <div className="avatar-and-content">
                        {chat.users
                          .filter(user => String(user._id) !== String(localStorage.getItem("userId")))
                          .slice(1, 2)
                          .map(user => (
                            <React.Fragment key={user._id}>
                              {user.profileImage ? (
                                <img src={user.profileImage} alt={user.name} className="avatar" />
                              ) : (
                                <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
                              )}
                              <div className="content-wrapper">
                                <div className="name-and-time">
                                  <h3>{user.name}</h3>
                                  {chat.lastMessage && (
                                    <span className="message-time">
                                      {formatMessageTime(chat.lastMessage.createdAt)}
                                    </span>
                                  )}
                                </div>
                                <div className="message-and-unread">
                                  {chat.lastMessage && (
                                    <p className="last-message">
                                      {chat.lastMessage.content}
                                    </p>
                                  )}
                                  {chat.unreadCount > 0 && (
                                    <span className="unread-count">
                                      {chat.unreadCount}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </React.Fragment>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div className="chat-info">
                      <div className="avatar-and-content">
                        <div className="avatar">G</div>
                        <div className="content-wrapper">
                          <div className="name-and-time">
                            <h3>{chat.name}</h3>
                            {chat.lastMessage && (
                              <span className="message-time">
                                {formatMessageTime(chat.lastMessage.createdAt)}
                              </span>
                            )}
                          </div>
                          <div className="message-and-unread">
                            <p>
                              {chat.users.length} members
                              {chat.lastMessage && ` • ${chat.lastMessage.content}`}
                            </p>
                            {chat.unreadCount > 0 && (
                              <span className="unread-count">
                                {chat.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}