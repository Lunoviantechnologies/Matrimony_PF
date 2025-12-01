import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import backendIP from "../api/api";
import { FiSend, FiSearch } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../styleSheets/chatWindow.css"; // ← EXTERNAL CSS
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";

const ChatWindow = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { id: myId, myProfile } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [contacts, setContacts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  const messagesEndRef = useRef(null);

  // console.log("premium: ", myProfile);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load accepted friends
  useEffect(() => {
    axios
      .get(`${backendIP}/friends/accepted`)
      .then((res) => {
        const list = res.data.filter(
          (u) => Number(u.receiverId) === Number(myId)
        );
        setContacts(list);

        const selected = list.find(
          (c) => Number(c.senderId) === Number(userId)
        );
        setSelectedUser(selected);
      })
      .catch((err) => console.error("Error loading contacts:", err));
  }, [userId, myId]);

  // Load messages
  useEffect(() => {
    if (!userId) return;

    axios
      .get(`${backendIP}/chat/conversation/${myId}/${userId}`)
      .then((res) => {
        setMessages(res.data.content);
        console.log("loading messages: ", res.data);
      })
      .catch((err) => console.error("Error loading messages:", err));
  }, [userId, myId]);

  // Check premium
  useEffect(() => {
    dispatch(fetchMyProfile(myId))
      .then(data => {
        console.log("premium: ", data.payload.premium);
        setIsPremium(data.payload.premium);
      }).catch((err) => {
        setIsPremium(false);
        console.log("failed to load the premium of a user", err);
      });
  }, [myId]);

  // Send message
  const handleSend = async () => {
    if (!message.trim() || !selectedUser) return;

    try {
      await axios.post(`${backendIP}/chat/send/${myId}/${userId}`, {
        message: message,
      });

      setMessages((prev) => [...prev,
      {
        senderId: myId,
        receiverId: selectedUser.senderId,
        message,
        timestamp: new Date().toISOString(),
      },
      ]);

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const filteredContacts = contacts.filter((chat) =>
    chat.senderName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="chatpage-container">
      {/* LEFT PANEL */}
      <div className="chatlist-container">
        <div className="chatlist-header">
          <h3>SaathJanam</h3>
        </div>

        {/* Search */}
        <div className="search-container">
          <FiSearch size={18} color="#666" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Contacts */}
        <div className="chatlist-scroll">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div
                key={contact.requestId}
                className={`chatlist-item ${Number(contact.senderId) === Number(userId)
                  ? "active-contact"
                  : ""
                  }`}
                onClick={() =>
                  navigate(`/dashboard/messages/${contact.senderId}`)
                }
              >
                <img
                  src={contact.image}
                  alt={contact.senderName}
                  className="chatlist-avatar"
                />
                <div>
                  <h4>{contact.senderName}</h4>
                  <p>Click to open chat</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-contacts">No contacts found</p>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="chatwindow-container">
        {/* Header */}
        {selectedUser ? (
          <div className="chatwindow-header">
            <div className="chatwindow-user">
              <img
                src={selectedUser.image}
                alt={selectedUser.senderName}
                className="chatwindow-avatar"
              />
              <div>
                <h4>{selectedUser.senderName}</h4>
                <span className="active-status">Active now</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="select-user">Select a user to start chatting</div>
        )}

        {/* Messages */}
        <div className="chatwindow-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-bubble ${Number(msg.senderId) === Number(myId)
                ? "my-message"
                : "their-message"
                }`}
            >
              <div>{msg.message}</div>
              <div className="chat-time">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chatwindow-input">
          {isPremium ? (
            <>
              <input
                type="text"
                placeholder="Write a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="msg-input"
              />
              <button onClick={handleSend} className="send-button">
                <FiSend size={20} />
              </button>
            </>
          ) : (
            <div className="premium-warning">
              You need a Premium Subscription to send messages.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;