import React, { useState, useRef, useEffect, use } from "react";
import axios from "axios";
import backendIP from "../api/api";
import { FiSend, FiSearch } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../styleSheets/chatWindow.css";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { fetchUserProfiles } from "../redux/thunk/profileThunk";

const ChatWindow = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profiles } = useSelector((state) => state.profiles);
  const { id: myId } = useSelector((state) => state.auth);

  const [acceptedList, setAcceptedList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  const messagesEndRef = useRef(null);
  const stompClientRef = useRef(null);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  useEffect(() => {
    dispatch(fetchUserProfiles());
  }, [dispatch]);

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

        if (merged.length > 0 && (!userId || isNaN(Number(userId)))) {
          const first = merged[0];
          const otherId =
            Number(first.senderId) === Number(myId)
              ? first.receiverId
              : first.senderId;

          navigate(`/dashboard/messages/${otherId}`);
        }

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

  /* === FIXED WEBSOCKET === */
  useEffect(() => {
    if (!myId) return;

    console.log("🔄 Initializing WebSocket for user:", myId);

    if (!stompClientRef.current) {
      const wsUrl = backendIP.replace("/api", "") + `/ws-chat?userId=${myId}`;
      console.log("🌐 Connecting to:", wsUrl);

      const sock = new SockJS(wsUrl);

      const client = new Client({
        webSocketFactory: () => sock,
        reconnectDelay: 5000,
        connectHeaders: { "user-id": myId.toString() },

        onConnect: () => {
          console.log("🟢 STOMP Connected as:", myId);

          // SUBSCRIBE HERE (IMPORTANT)
          const subscription = client.subscribe(
            "/user/queue/messages",
            (msg) => {
              console.log("📩 Live message received:", msg.body);
              handleIncoming(JSON.parse(msg.body));
            },
            { id: "chat-sub" }
          );

          console.log("📡 Subscribed to /user/queue/messages:", subscription);
        },

        onStompError: (frame) => {
          console.error("❌ STOMP Error:", frame.headers["message"]);
          console.error("➡️ Details:", frame.body);
        },

        onWebSocketClose: () => {
          console.warn("⚠️ Chat WebSocket closed. Attempting reconnection...");
        },

        onWebSocketError: (err) => {
          console.error("🚫 WebSocket Error:", err);
        }
      });

      client.activate();
      stompClientRef.current = client;
    }

    return () => {
      console.log("🔌 Disconnecting WebSocket…");
      stompClientRef.current?.deactivate();
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
      timestamp: new Date().toISOString(),
    };

    console.log("📤 Sending message:", msgBody);

    setMessages((prev) => [...prev, msgBody]);
    setMessage("");

    if (stompClientRef.current?.connected) {
      stompClientRef.current.publish({
        destination: `/app/chat.send/${receiverId}`,
        body: JSON.stringify(msgBody),
      });

      console.log(
        `🚀 Published to /app/chat.send/${receiverId}`,
        JSON.stringify(msgBody)
      );
    } else {
      console.error("❌ Cannot send — STOMP is NOT connected");
    }
  };

  /* FILTER CONTACTS */
  const filteredContacts = acceptedList.filter((c) => {
    const name =
      Number(c.senderId) === Number(myId)
        ? c.receiverName
        : c.senderName;

    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleIncoming = (body) => {
    console.log("🧪 Incoming WS payload:", body);

    if (!body || !body.senderId) {
      console.warn("⚠️ Invalid WS payload:", body);
      return;
    }

    const chatUserId = Number(userId);
    if (
      Number(body.senderId) === chatUserId ||
      Number(body.receiverId) === chatUserId
    ) {
      setMessages((prev) => [...prev, body]);
    }
  };

  const getUserImageById = (id) => {
    if (!profiles || profiles.length === 0) return "/default-avatar.png";

    const user = profiles.find(
      (p) => Number(p.id) === Number(id)
    );

    if (!user || !user.updatePhoto) {
      return "/default-avatar.png";
    }

    return `${backendIP.replace("/api", "")}/profile-photos/${user.updatePhoto}`;
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
              const otherId =
                Number(c.senderId) === Number(myId)
                  ? c.receiverId
                  : c.senderId;
              const name =
                Number(c.senderId) === Number(myId)
                  ? c.receiverName
                  : c.senderName;
              const img =
                Number(c.senderId) === Number(myId)
                  ? c.receiverImage
                  : c.senderImage;

              return (
                <div
                  key={c.requestId}
                  className={`chatlist-item ${Number(otherId) === Number(userId)
                    ? "active-contact"
                    : ""
                    }`}
                  onClick={() =>
                    navigate(`/dashboard/messages/${otherId}`)
                  }
                >
                  {/* <img
                    src={img}
                    alt={name}
                    className="chatlist-avatar"
                  /> */}
                  <img
                    src={getUserImageById(otherId)}
                    alt={name}
                    className="chatlist-avatar"
                    onError={(e) => (e.target.src = "/default-avatar.png")}
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
              {/* <img
                src={
                  Number(selectedUser.senderId) === Number(myId) ? selectedUser.receiverImage : selectedUser.senderImage
                }
                alt=""
                className="chatwindow-avatar"
              /> */}
              <img
                src={getUserImageById(
                  Number(selectedUser.senderId) === Number(myId)
                    ? selectedUser.receiverId : selectedUser.senderId
                )}
                alt="User"
                className="chatwindow-avatar"
                onError={(e) => (e.target.src = "/default-avatar.png")}
              />

              <div>
                <h4>
                  {Number(selectedUser.senderId) === Number(myId)
                    ? selectedUser.receiverName
                    : selectedUser.senderName}
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