import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import "./chat.scss";
import { io } from "socket.io-client";
import { format } from 'date-fns';
import { ReactComponent as EmojiIcon } from "../../../assets/icons/emoji.svg";
import { ReactComponent as SendIcon } from "../../../assets/icons/send.svg";
import { ReactComponent as CopyIcon } from "../../../assets/icons/copy.svg";
import { ReactComponent as ReplyIcon } from "../../../assets/icons/reply.svg";
import { ReactComponent as EditIcon } from "../../../assets/icons/edit.svg";
import { ReactComponent as DeleteIcon } from "../../../assets/icons/delete.svg";
import { Toaster, toast } from 'sonner'; 

const backendUrl = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : 'https://portfoliochat-be.onrender.com';

const socket = io(backendUrl, {
  auth: {
    token: localStorage.getItem("token"),
  },
  withCredentials: true,
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

const formatDisplayDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return format(date, 'd MMMM yyyy');
  }
};

const formatMessageTime = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'HH:mm');
};

const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
};

export default function Chat() {
  const { ChatId: chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, message: null });
  const [selectedMessageId, setSelectedMessageId] = useState(null); 
  const [editingMessage, setEditingMessage] = useState(null); 
  const [replyingTo, setReplyingTo] = useState(null); 
  const messageContainerRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const currentUser = getUserFromToken();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current && emojiPickerRef.current.contains(event.target)
      ) {
        return;
      }
    
      if (
        contextMenu.visible &&
        event.target.closest(".context-menu")
      ) {
        return;
      }
    
      setShowEmojiPicker(false);
      setContextMenu({ visible: false, x: 0, y: 0, message: null });
      setSelectedMessageId(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu]);

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
        const response = await fetch(`https://portfoliochat-be.onrender.com/api/chats/${chatId}/messages`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch messages: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched messages:", data);
        setMessages(Array.isArray(data) ? data : [data]);
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

  useEffect(() => {
    const handleDeletedMessage = ({ messageId }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    };

    socket.on("messageDeleted", handleDeletedMessage);

    return () => {
      socket.off("messageDeleted", handleDeletedMessage);
    };
  }, []);

  useEffect(() => {
    const handleUserUpdated = (updatedUser) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.sender._id === updatedUser._id
            ? { ...msg, sender: { ...msg.sender, ...updatedUser } }
            : msg
        )
      );
    };
  
    socket.on("userUpdated", handleUserUpdated);
  
    return () => {
      socket.off("userUpdated", handleUserUpdated);
    };
  }, []);

  const handleEmojiClick = (emojiData) => {
    setInput(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
        console.error("Message content cannot be empty");
        return;
    }

    if (editingMessage) {
        try {
            const response = await fetch(`https://portfoliochat-be.onrender.com/api/messages/${editingMessage._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ content: input }),
            });

            if (!response.ok) {
                throw new Error(`Failed to edit message: ${response.statusText}`);
            }

            const updatedMessage = await response.json();
            setMessages((prev) =>
                prev.map((msg) => (msg._id === updatedMessage._id ? updatedMessage : msg))
            );
            console.log("Message updated successfully:", updatedMessage);
        } catch (error) {
            console.error("Failed to update message:", error);
        }

        setEditingMessage(null);
        setInput("");
    } else {
        const tempId = `temp-${Date.now()}`;
        const tempMessage = {
            _id: tempId,
            content: input,
            sender: {
                _id: currentUser.id,
                username: currentUser.username,
                profileImage: currentUser.profileImage,
            },
            createdAt: new Date().toISOString(),
            isOptimistic: true,
            tempId,
            replyTo: replyingTo,
        };

        setMessages((prev) => [...prev, tempMessage]);
        setInput("");

        console.log("Sending message:", {
          chatId,
          content: input,
          replyTo: replyingTo ? replyingTo._id : null,
        });

        socket.emit(
            "sendMessage",
            {
                chatId,
                content: input,
                messageType: "text",
                attachments: [],
                replyTo: replyingTo ? replyingTo._id : null,
            },
            (response) => {
                if (!response.success) {
                    console.error("Failed to send message:", response.error);
                    alert(response.error);
                } else {
                    console.log("Message sent successfully:", response.messageId);
                }
            }
        );
    }

    setReplyingTo(null);
};

  const handleContextMenu = (e, message) => {
    e.preventDefault();
    console.log("Context menu opened for message:", message);
    setSelectedMessageId(message._id);
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      message,
    });
  };

  const handleDeleteMessage = async (message) => {
    toast.promise(
      new Promise(async (resolve, reject) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this message?");
        if (!confirmDelete) return reject("Deletion canceled");
  
        setMessages((prev) => prev.filter((msg) => msg._id !== message._id));
  
        try {
          const response = await fetch(`http://localhost:5000/api/messages/${message._id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
  
          if (!response.ok) {
            throw new Error(`Failed to delete message: ${response.statusText}`);
          }
  
          socket.emit("deleteMessage", { messageId: message._id });
          resolve("Message deleted successfully");
        } catch (error) {
          setMessages((prev) => [...prev, message]);
          reject("Failed to delete message");
        }
      }),
      {
        loading: "Deleting message...",
        success: "Message deleted successfully!",
        error: "Failed to delete message.",
      }
    );
  
    setContextMenu({ visible: false, x: 0, y: 0, message: null });
    setSelectedMessageId(null);
  };
  

  const handleEditMessage = (message) => {
    setInput(message.content); 
    setEditingMessage(message); 
    setContextMenu({ visible: false, x: 0, y: 0, message: null });
    setSelectedMessageId(null);
  };

  const handleReplyMessage = (message) => {
    setReplyingTo(message); 
    setContextMenu({ visible: false, x: 0, y: 0, message: null });
    setSelectedMessageId(null);
  };

  const handleCancelReply = () => {
    setReplyingTo(null); 
  };

  const handleCopyMessage = (message) => {
    navigator.clipboard.writeText(message.content)
      .then(() => {
        toast.success("Message copied to clipboard!");
      })
      .catch((err) => {
        toast.error("Failed to copy message.");
      });
  
    setContextMenu({ visible: false, x: 0, y: 0, message: null });
    setSelectedMessageId(null);
  };

  return (
    <div className="chat-container">
      <Toaster richColors position="top-center" />
      <div className="messages-container" ref={messageContainerRef}>
        {messages.length === 0 ? (
          <div className="no-messages">No messages yet</div>
        ) : (
          messages.reduce((acc, message, index) => {
            const currentMessageDate = format(new Date(message.createdAt), 'dd MMMM yyyy');
            const prevMessage = messages[index - 1];
            const prevDate = prevMessage 
              ? format(new Date(prevMessage.createdAt), 'dd MMMM yyyy') 
              : null;
            const showDate = currentMessageDate !== prevDate;
            const isOwn = message.sender?._id === currentUser?.id;

            acc.push(
              <React.Fragment key={message._id}>
                {showDate && (
                  <div className="message-date">
                    <span>{formatDisplayDate(message.createdAt)}</span>
                  </div>
                )}
                  <div
                    key={message._id}
                    className={`message-wrapper ${isOwn ? 'own-message' : ''} ${selectedMessageId === message._id ? 'selected-message' : ''} ${message.replyTo ? 'reply-to' : ''}`}
                    onContextMenu={(e) => handleContextMenu(e, message)}
                  >
                    <div className="message-avatar">
                      {message.sender?.profileImage ? (
                        <img src={message.sender.profileImage} alt={message.sender.username} />
                      ) : (
                        <div className="avatar-placeholder">
                          {message.sender?.username?.charAt(0).toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                     
                    <div className="message-content">
                      {message.replyTo && (
                        <div className="reply-preview">
                          <span className="reply-author">{message.replyTo.sender?.username || "Unknown"}</span>
                          <div className="reply-text">
                            {truncateText(message.replyTo.content, 35)}
                          </div>
                        </div>
                      )}
                      <div className="message-bubble">
                        <div className="message-text">{message.content}</div>
                        <span className="message-time">
                          {formatMessageTime(message.createdAt)}
                          {message.edited?.isEdited && <span className="edited-label">(edited)</span>}
                        </span>
                      </div>
                    </div>
                  </div>
              </React.Fragment>
            );
            return acc;
          }, [])
        )}
      </div>

      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button onClick={() => handleCopyMessage(contextMenu.message)}><CopyIcon />Copy</button>
          <button onClick={() => handleReplyMessage(contextMenu.message)}><ReplyIcon/>Reply</button>
          <button onClick={() => handleEditMessage(contextMenu.message)}><EditIcon/>Edit</button>
          <button onClick={() => handleDeleteMessage(contextMenu.message)}><DeleteIcon/>Delete</button>
        </div>
      )}

      <form className="message-form" onSubmit={handleSubmit}>
        {replyingTo && (
          <div className="replying-to">
            <span>Replying to:</span>
            <div className="reply-preview">
              <span className="reply-author">{replyingTo.sender?.username || "Unknown"}</span>
              <div className="reply-text">
                {truncateText(replyingTo.content, 50)}
              </div>
            </div>
            <button type="button" className="cancel-reply" onClick={handleCancelReply}>
              ✕
            </button>
          </div>
        )}
        <div className="input-container">
          <button 
            type="button" 
            className="emoji-button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <EmojiIcon  className="emoji-icon" />
          </button>
          <input
            className="message-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={replyingTo ? "Write a reply..." : "Type a message..."}
          />
          <button type="submit"><SendIcon className="send-icon"/></button>
        </div>
        {showEmojiPicker && (
        <div className="emoji-picker-wrapper" ref={emojiPickerRef}>
          <EmojiPicker 
            onEmojiClick={handleEmojiClick}
            width={300}
            height={400}
            emojiStyle={EmojiStyle.NATIVE}  
            theme={Theme.DARK}              
          />
        </div>
        )}
      </form>
    </div>
  );
}