import React, { useState, useEffect } from "react";
import "./people.scss";
import axios from "axios";

export default function People() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        console.error("Error fetching chats:", err);
        setError(err.response?.data?.message || "Failed to load chats");
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  if (loading) return <div className="People-loading">Loading chats...</div>;
  if (error) return <div className="People-error">{error}</div>;

  return (
    <div className="People">
      <div className="People-wrapper">
        <h2>Your Chats</h2>
        <div className="People-list">
          {chats.length === 0 ? (
            <p>No active chats found</p>
          ) : (
            chats.map((chat) => (
              <div key={chat._id} className="People-item">
                {chat.type === 'private' ? (

                  <div className="chat-info">
                    {chat.users.filter(user => user._id !== localStorage.getItem("userId")).map(user => (
                      <div key={user._id}>
                        {user.profileImage ? (
                          <img src={user.profileImage} alt={user.name} className="user-avatar" />
                        ) : (
                          <div className="avatar-placeholder">{user.name.charAt(0)}</div>
                        )}
                        <h3>{user.name}</h3>
                        {chat.lastMessage && <p className="last-message">{chat.lastMessage.content}</p>}
                      </div>
                    ))}
                  </div>
                ) : (

                  <div className="chat-info">
                    <h3>{chat.name}</h3>
                    <p>{chat.users.length} members</p>
                    {chat.lastMessage && <p className="last-message">{chat.lastMessage.content}</p>}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}