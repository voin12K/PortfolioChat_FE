import React, { useState, useEffect } from "react";
import "./people.scss";
import axios from "axios";
import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const SOCKET_URL = "https://portfoliochat-be.onrender.com"; 

export default function People() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const myUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }

        const response = await axios.get("https://portfoliochat-be.onrender.com/api/chats/my", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
 
        setChats(response.data);
        setLoading(false);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load chats");
        setLoading(false);
      }
    };

    fetchChats();
  }, [myUserId]);

useEffect(() => {
  const newSocket = io(SOCKET_URL, {
    auth: { token: localStorage.getItem("token") },
    transports: ['websocket'],  
  });
  setSocket(newSocket);

  newSocket.on("connect", () => {
    console.log('Socket connected:', newSocket.id);
  });
  newSocket.on("disconnect", () => {
    console.log('Socket disconnected');
  });
  newSocket.on("connect_error", (err) => {
    console.error('Socket connection error:', err.message);
  });

  return () => {
    newSocket.disconnect();
  };
}, []);


  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleNewMessage = (message) => {
      setChats(prevChats => {
        const chatIndex = prevChats.findIndex(chat => {
          const chatId = typeof message.chat === "object" ? message.chat._id : message.chat;
          return chat._id === chatId;
        });

        if (chatIndex === -1) {
          return prevChats;
        }

        const senderId = message.sender?._id || message.sender;
        const isMyMessage = String(senderId) === String(myUserId);

        const updatedChats = [...prevChats];
        updatedChats[chatIndex] = {
          ...updatedChats[chatIndex],
          lastMessage: message,
          unreadCount: isMyMessage
            ? updatedChats[chatIndex].unreadCount || 0
            : (updatedChats[chatIndex].unreadCount || 0) + 1
        };

        return updatedChats;
      });
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, myUserId]);

  useEffect(() => {
    if (!socket || chats.length === 0) return;

    chats.forEach(chat => {
      socket.emit("joinChat", chat._id);
    });
  }, [socket, chats]);

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
              chats.map((chat) => {
                return (
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
                            .filter(user => String(user._id) !== String(myUserId))
                            .slice(0, 1)
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
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}