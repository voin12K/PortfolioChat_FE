import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./chat.scss";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: {
    token: localStorage.getItem("token"),
  },
});

const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { id: payload.id, username: payload.username || "Anonymous" };
  } catch {
    return null;
  }
};

export default function Chat() {
  const { ChatId: chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messageContainerRef = useRef(null);
  const currentUser = getUserFromToken();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  

  useEffect(() => {
  socket.on("connect", () => {
    console.log("✅ Socket connected (inside Chat):", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Socket connection error:", err.message);
  });

  return () => {
    socket.off("connect");
    socket.off("connect_error");
  };
}, []);


useEffect(() => {
  if (!chatId) return;

  console.log("Joining chat:", chatId);
  socket.emit("joinChat", chatId);

  const handleNewMessage = (message) => {
    console.log("New message received:", message);

    setMessages((prev) => {
      const withoutTemp = prev.filter(
        m => !(m.isOptimistic && 
              m.content === message.content && 
              m.sender._id === message.sender._id &&
              new Date(m.createdAt).getTime() > Date.now() - 5000)
      );

      if (withoutTemp.some(m => m._id === message._id)) return withoutTemp;

      return [...withoutTemp, message];
    });
  };

  socket.on("newMessage", handleNewMessage);

  socket.on("error", (error) => {
    console.error("Socket error:", error.message);
  });

  const loadInitialMessages = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/chats/${chatId}/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fetched messages:", data); // Для отладки

      // Если API возвращает объект сообщения, а не массив
      setMessages(Array.isArray(data) ? data : [data]); // Преобразуем в массив, если это объект
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  loadInitialMessages();

return () => {
    socket.emit("leaveChat", chatId);
    socket.off("newMessage", handleNewMessage);
    socket.off("error");
  };
}, [chatId]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

const handleSubmit = (e) => {
  e.preventDefault();
  if (!input.trim()) return;

  const messageData = {
    chatId,
    content: input,
  };

  const tempId = `temp-${Date.now()}`;
  const tempMessage = {
    _id: tempId,
    content: input,
    sender: {
      _id: currentUser.id,
      username: currentUser.username,
    },
    createdAt: new Date().toISOString(),
    isOptimistic: true,
    tempId
  };
  
  setMessages((prev) => [...prev, tempMessage]);
  setInput("");

  socket.emit("sendMessage", messageData, (response) => {
    if (!response.success) {
      console.error("Failed to send message:", response.error);
      setMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
    }
  });
};

  return (
    <div className="chat-container">
      <div className="messages-container" ref={messageContainerRef}>
        {messages.length === 0 ? (
          <div className="no-messages">No messages yet</div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`message ${
                message.sender?._id === currentUser?.id ? "own-message" : ""
              } ${message.isOptimistic ? "optimistic" : ""}`}
            >
              <div className="message-header">
                <span className="sender-name">
                  {message.sender?.username || "Unknown"}
                </span>
                <span className="message-time">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="message-content">{message.content}</div>
            </div>
          ))
        )}
      </div>

      <form className="message-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">
          Send
        </button>
      </form>
    </div>
  );
}
