import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import backendIP from "../api/api";
import { FiSend, FiSearch } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../styleSheets/chatWindow.css";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const ChatWindow = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id: myId } = useSelector((state) => state.auth);

  const [acceptedList, setAcceptedList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  const messagesEndRef = useRef(null);
  const stompClientRef = useRef(null);

  /* AUTO SCROLL */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* FETCH ACCEPTED USERS */
  useEffect(() => {
    if (!myId) return;

    const fetchAcceptedRequests = async () => {
      try {
        const received = await axios.get(
          `${backendIP}/friends/accepted/received/${myId}`
        );
        const sent = await axios.get(
          `${backendIP}/friends/accepted/sent/${myId}`
        );

        const merged = [...received.data, ...sent.data];
        setAcceptedList(merged);

        // Auto-select first contact if URL has no userId
        if (merged.length > 0 && (!userId || isNaN(Number(userId)))) {
          const first = merged[0];
          const otherId =
            Number(first.senderId) === Number(myId)
              ? first.receiverId
              : first.senderId;

          navigate(`/dashboard/messages/${otherId}`);
        }

        // Set selected user based on URL param
        const selected = merged.find(
          (c) =>
            Number(c.senderId) === Number(userId) ||
            Number(c.receiverId) === Number(userId)
        );
        setSelectedUser(selected || null);

      } catch (err) {
        console.error("Error fetching accepted list:", err);
      }
    };

    fetchAcceptedRequests();
  }, [myId, userId, navigate]);

  /* LOAD CHAT HISTORY */
  useEffect(() => {
    if (!myId) return;
    if (!userId || isNaN(Number(userId))) return;

    axios
      .get(`${backendIP}/chat/conversation/${myId}/${Number(userId)}`)
      .then((res) => {
        setMessages(res.data.content || []);
      })
      .catch((err) => console.error("Error loading messages:", err));
  }, [myId, userId]);

  /* CHECK PREMIUM */
  useEffect(() => {
    if (!myId) return;

    dispatch(fetchMyProfile(myId))
      .then((data) => {
        setIsPremium(Boolean(data.payload?.premium));
      })
      .catch(() => setIsPremium(false));
  }, [myId, dispatch]);

  /* SETUP WEBSOCKET */
  useEffect(() => {
    if (!myId) return;

    let subscription = null;

    // If client already exists → just change subscription
    if (stompClientRef.current && stompClientRef.current.connected) {

      // Remove old subscription (VERY IMPORTANT)
      stompClientRef.current.unsubscribe("chat-sub");

      // Create NEW subscription for the correct user
      subscription = stompClientRef.current.subscribe(
        `/user/${myId}/queue/messages`,
        (msg) => handleIncoming(JSON.parse(msg.body)),
        { id: "chat-sub" }
      );

      return () => {
        stompClientRef.current?.unsubscribe("chat-sub");
      };
    }

    /* First-time WebSocket connect */
    const socketUrl = backendIP.replace("/api", "") + "/ws-chat";
    const sock = new SockJS(socketUrl);

    const client = new Client({
      webSocketFactory: () => sock,
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("🟢 STOMP Connected");

        subscription = client.subscribe(
          `/user/${myId}/queue/messages`,
          (msg) => handleIncoming(JSON.parse(msg.body)),
          { id: "chat-sub" }
        );
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      subscription?.unsubscribe();
    };
  }, [myId]);

  /* SEND MESSAGE */
  const handleSend = () => {
    if (!message.trim() || !selectedUser) return;

    const receiverId =
      Number(selectedUser.senderId) === Number(myId)
        ? selectedUser.receiverId
        : selectedUser.senderId;

    const msgBody = {
      senderId: myId,
      receiverId,
      message,
      timestamp: new Date().toISOString()
    };

    // Optimistic UI
    setMessages((prev) => [...prev, msgBody]);
    setMessage("");

    // Send via STOMP
    if (stompClientRef.current?.connected) {
      stompClientRef.current.publish({
        destination: `/app/chat.send/${receiverId}`,
        body: JSON.stringify(msgBody),
      });
    }
  };

  /* FILTER CONTACTS */
  const filteredContacts = acceptedList.filter((c) => {
    const name =
      Number(c.senderId) === Number(myId) ? c.receiverName : c.senderName;

    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleIncoming = (body) => {
    // Only push if message belongs to THIS chat window
    if (
      Number(body.senderId) === Number(userId) ||
      Number(body.receiverId) === Number(userId)
    ) {
      setMessages((prev) => [...prev, body]);
    }
  };

  return (
    <div className="chatpage-container">
      {/* LEFT PANEL */}
      <div className="chatlist-container">
        <div className="chatlist-header d-flex justify-content-center align-items-center">
          <img src="/saathjanam_logo.png" alt="" height="50" />
          <h3>SaathJanam</h3>
        </div>

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

        <div className="chatlist-scroll">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((c) => {
              const otherId = Number(c.senderId) === Number(myId) ? c.receiverId : c.senderId;
              const name = Number(c.senderId) === Number(myId) ? c.receiverName : c.senderName;
              const img = Number(c.senderId) === Number(myId) ? c.receiverImage : c.senderImage;

              return (
                <div
                  key={c.requestId}
                  className={`chatlist-item ${Number(otherId) === Number(userId) ? "active-contact" : ""
                    }`}
                  onClick={() =>
                    navigate(`/dashboard/messages/${otherId}`)
                  }
                >
                  <img
                    src={img}
                    alt={name}
                    className="chatlist-avatar"
                  />
                  <div>
                    <h4>{name}</h4>
                    <p>Click to chat</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no-contacts">No contacts found</p>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="chatwindow-container">
        {selectedUser ? (
          <div className="chatwindow-header">
            <div className="chatwindow-user">
              <img src={Number(selectedUser.senderId) === Number(myId)
                ? selectedUser.receiverImage : selectedUser.senderImage
              }
                alt=""
                className="chatwindow-avatar"
              />
              <div>
                <h4>
                  {Number(selectedUser.senderId) === Number(myId)
                    ? selectedUser.receiverName : selectedUser.senderName}
                </h4>
                <span className="active-status">Active now</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="select-user">Select a user to start chatting</div>
        )}

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

        <div className="chatwindow-input">
          {isPremium ? (
            <div className="chat-input-box">
              <input
                type="text"
                placeholder="Write a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="msg-input"
              />
              <button onClick={handleSend} className="send-button">
                <FiSend size={18} />
              </button>
            </div>
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