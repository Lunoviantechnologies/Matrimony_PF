import React, { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";

const ChatWindow = () => {
  const [chats, setChats] = useState([
    {
      id: 1,
      name: "Priya Sharma",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      messages: [
        { sender: "Priya Sharma", text: "Hi Naveen, how are you?", time: "10:30 AM" },
        { sender: "Me", text: "I’m good, thanks Priya!", time: "10:32 AM" },
      ],
    },
    {
      id: 2,
      name: "Rahul Mehta",
      avatar: "https://randomuser.me/api/portraits/men/41.jpg",
      messages: [
        { sender: "Rahul Mehta", text: "Hey! Did you check the proposal?", time: "Yesterday" },
      ],
    },
    {
      id: 3,
      name: "Sneha Reddy",
      avatar: "https://randomuser.me/api/portraits/women/75.jpg",
      messages: [
        { sender: "Sneha Reddy", text: "Hi! Are you free this weekend?", time: "2:45 PM" },
      ],
    },
  ]);

  const [selectedChatId, setSelectedChatId] = useState(1);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  const handleSend = () => {
    if (!message.trim()) return;
    const newMessage = {
      sender: "Me",
      text: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === selectedChatId
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    );

    setMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.messages]);

  // Filter chats by search term
  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.chatpageContainer}>
      {/* Chat List */}
      <div style={styles.chatlistContainer}>
        <div style={styles.chatlistHeader}>
          <h3 style={{ margin: 0, fontWeight: "bold", color: "#0078ff" }}>SaathJanam</h3>
        </div>

        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <FiSearch size={18} color="#666" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Chat Items */}
        <div style={{ overflowY: "auto", height: "calc(100% - 120px)" }}>
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                style={{
                  ...styles.chatlistItem,
                  backgroundColor: selectedChatId === chat.id ? "#e8f0fe" : "#fff",
                }}
                onClick={() => setSelectedChatId(chat.id)}
              >
                <img src={chat.avatar} alt={chat.name} style={styles.chatlistAvatar} />
                <div>
                  <h4 style={{ margin: 0, fontSize: 15 }}>{chat.name}</h4>
                  <p style={{ margin: 0, color: "#666", fontSize: 13 }}>
                    {chat.messages[chat.messages.length - 1]?.text}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", padding: "20px", color: "#888" }}>
              No results found
            </p>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div style={styles.chatwindowContainer}>
        <div style={styles.chatwindowHeader}>
          <div style={styles.chatwindowUser}>
            <img
              src={selectedChat.avatar}
              alt={selectedChat.name}
              style={styles.chatwindowAvatar}
            />
            <div>
              <h4 style={{ margin: 0 }}>{selectedChat.name}</h4>
              <span style={{ color: "#2ecc71", fontSize: 13 }}>Active now</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={styles.chatwindowMessages}>
          {selectedChat.messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                ...styles.chatBubble,
                alignSelf: msg.sender === "Me" ? "flex-end" : "flex-start",
                backgroundColor: msg.sender === "Me" ? "#0078ff" : "#eaeaea",
                color: msg.sender === "Me" ? "white" : "black",
              }}
            >
              <div>{msg.text}</div>
              <div style={styles.chatTime}>{msg.time}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={styles.chatwindowInput}>
          <input
            type="text"
            placeholder="Write a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            style={styles.input}
          />
          <button onClick={handleSend} style={styles.sendButton}>
            <FiSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Inline CSS styles
const styles = {
  chatpageContainer: {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    border: "1px solid #ddd",
    backgroundColor: "#f9fafb",
  },
  chatlistContainer: {
    width: "30%",
    borderRight: "1px solid #ddd",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
  },
  chatlistHeader: {
    padding: "16px",
    borderBottom: "1px solid #eee",
    textAlign: "center",
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    background: "#f1f3f4",
    margin: "10px",
    padding: "6px 10px",
    borderRadius: "8px",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    marginLeft: "8px",
    background: "transparent",
  },
  chatlistItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px 15px",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  chatlistAvatar: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    marginRight: "12px",
  },
  chatwindowContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "#fdfdfd",
  },
  chatwindowHeader: {
    padding: "15px",
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #eee",
  },
  chatwindowUser: {
    display: "flex",
    alignItems: "center",
  },
  chatwindowAvatar: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    marginRight: "10px",
  },
  chatwindowMessages: {
    flex: 1,
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    background: "#f9fafb",
  },
  chatBubble: {
    marginBottom: "10px",
    maxWidth: "60%",
    padding: "10px 14px",
    borderRadius: "16px",
    wordWrap: "break-word",
  },
  chatTime: {
    fontSize: "11px",
    color: "gray",
    marginTop: "4px",
    textAlign: "right",
  },
  chatwindowInput: {
    display: "flex",
    alignItems: "center",
    borderTop: "1px solid #ddd",
    padding: "10px",
    background: "#fff",
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "14px",
    padding: "8px 10px",
    borderRadius: "8px",
    background: "#f1f3f4",
    marginRight: "10px",
  },
  sendButton: {
    background: "#0078ff",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "38px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
};

export default ChatWindow;
