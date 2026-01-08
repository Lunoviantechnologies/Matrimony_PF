import React, { useState, useRef, useEffect } from "react";
import backendIP from "../api/api";
import { FiSend, FiSearch } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../styleSheets/chatWindow.css";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { fetchUserProfiles } from "../redux/thunk/profileThunk";
import api from "../api/axiosInstance";
import { TfiMenuAlt } from "react-icons/tfi";
import { toast } from "react-toastify";

const ChatWindow = () => {
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profiles } = useSelector((state) => state.profiles);
  const { id: myId, token, role } = useSelector((state) => state.auth);

  const [acceptedList, setAcceptedList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(false);
  const [blockedByMe, setBlockedByMe] = useState(false);
  const [blockedByOther, setBlockedByOther] = useState(false);

  const messagesEndRef = useRef(null);
  const stompClientRef = useRef(null);
  const activeChatUserRef = useRef(null);

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const chatScrollRef = useRef(null);
  const isInitialLoadRef = useRef(true);
  const prevScrollHeightRef = useRef(0);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    activeChatUserRef.current = Number(userId);
  }, [userId]);

  // reset pagination
  useEffect(() => {
    if (!myId || !userId) return;

    setMessages([]);
    setPage(0);
    setHasMore(true);
    isInitialLoadRef.current = true;

    loadMessages(0, true);
  }, [userId, myId]);

  useEffect(() => {
    if (role[0].toUpperCase() === "USER") {
      dispatch(fetchUserProfiles());
    };
  }, [dispatch, role]);

  // user online or offline
  useEffect(() => {
    if (!selectedUser || !myId) return;

    const otherUserId =
      Number(selectedUser.senderId) === Number(myId)
        ? Number(selectedUser.receiverId)
        : Number(selectedUser.senderId);

    api.get("/chat/online").then(res => {
      const onlineUsers = (res.data || []).map(id => Number(id));

      console.log("all online (normalized):", onlineUsers);
      console.log("checking for:", otherUserId);

      const isOnline = onlineUsers.includes(otherUserId);
      setOnlineStatus(isOnline);
    })
      .catch(() => setOnlineStatus(false));

  }, [selectedUser, myId]);
  console.log("online : ", onlineStatus);

  // Blocked user
  useEffect(() => {
    if (!selectedUser || !myId) return;

    const otherUserId =
      Number(selectedUser.senderId) === Number(myId)
        ? selectedUser.receiverId
        : selectedUser.senderId;

    api.get(`/block/status/${myId}/${otherUserId}`)
      .then(res => {
        const { blocked, iBlocked } = res.data || {};

        setBlockedByMe(blocked && iBlocked);
        setBlockedByOther(blocked && !iBlocked);
      })
      .catch(() => {
        setBlockedByMe(false);
        setBlockedByOther(false);
      });
  }, [selectedUser, myId]);

  /* FETCH ACCEPTED USERS */
  useEffect(() => {
    if (!myId) return;

    const fetchAcceptedRequests = async () => {
      try {
        const received = await api.get(`/friends/accepted/received/${myId}`);
        const sent = await api.get(`/friends/accepted/sent/${myId}`);

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

  /* LOAD CHAT HISTORY with pagination */
  const loadMessages = async (pageNo, reset = false) => {
    if (loadingHistory || (!hasMore && !reset)) return;

    const container = chatScrollRef.current;

    // 🔒 Save scroll height before adding older messages
    if (!reset && container) {
      prevScrollHeightRef.current = container.scrollHeight;
    }

    setLoadingHistory(true);

    try {
      const res = await api.get(
        `/chat/conversation/${myId}/${Number(userId)}?page=${pageNo}&size=20`
      );

      // 🔁 Backend gives DESC → convert to ASC
      const newMessages = (res.data.content || []).reverse(); // ✅ ASC order

      setHasMore(!res.data.last);
      setPage(pageNo);

      // 🔼 Prepend old messages OR reset chat
      setMessages(prev =>
        reset ? newMessages : [...newMessages, ...prev]
      );
    } catch (err) {
      console.error("❌ Failed to load chat history", err);
    } finally {
      setLoadingHistory(false);
    }
  };

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
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },

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
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
    };

  }, [myId]);

  useEffect(() => {
    const container = chatScrollRef.current;
    if (!container) return;

    if (isInitialLoadRef.current) {
      // First load → jump to bottom
      container.scrollTop = container.scrollHeight;
      isInitialLoadRef.current = false;
    } else {
      // Preserve position when older messages load
      const newScrollHeight = container.scrollHeight;
      container.scrollTop =
        newScrollHeight - prevScrollHeightRef.current;
    }
  }, [messages]);

  // scroll for older chat
  useEffect(() => {
    const container = chatScrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop === 0 && hasMore && !loadingHistory) {
        loadMessages(page + 1);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [page, hasMore, loadingHistory]);

  // Seen chat
  useEffect(() => {
    if (!selectedUser || !myId || !stompClientRef.current?.connected) return;

    const otherUserId =
      Number(selectedUser.senderId) === Number(myId)
        ? selectedUser.receiverId
        : selectedUser.senderId;

    // 🔔 Notify backend messages are seen
    stompClientRef.current.publish({
      destination: `/app/chat/seen/${otherUserId}`,
      body: JSON.stringify({
        senderId: otherUserId,
        receiverId: myId,
      }),
    });

    // 🔁 Update backend DB
    api.post(`/chat/seen/${otherUserId}/${myId}`);

  }, [selectedUser, myId]);

  /* SEND MESSAGE */
  const handleSend = () => {
    if (blockedByMe || blockedByOther) return;
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
    if (!body) return;

    setMessages(prev => [...prev, body]);

    const container = chatScrollRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 80;

    if (isNearBottom) {
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 50);
    }
  };

  const getUserImageById = (id) => {
    if (!profiles || profiles.length === 0) return "/default-avatar.png";

    const user = profiles.find((p) => Number(p.id) === Number(id));

    if (!user || !user.updatePhoto) {
      return "/default-avatar.png";
    }
    return user.updatePhoto ? user.updatePhoto : user.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png";
  };

  const handleClearChat = () => {
    if (!selectedUser || !myId) return;

    const receiverId =
      Number(selectedUser.senderId) === Number(myId)
        ? selectedUser.receiverId
        : selectedUser.senderId;

    api.post(`/chat/clear/${myId}/${receiverId}`)
      .then(res => {
        console.log("Chat cleared:", res.data);
        setMessages([]); // optional: clear UI instantly
        setOpen(false);
      })
      .catch(err => {
        console.error("Error clearing chat:", err);
      });
  };

  const handleBlockChat = async () => {
    if (!selectedUser) return;

    const receiverId =
      Number(selectedUser.senderId) === Number(myId)
        ? selectedUser.receiverId
        : selectedUser.senderId;

    try {
      await api.post(`/block/user/${myId}/${receiverId}`);

      // ✅ IMMEDIATE UI UPDATE
      setBlockedByMe(true);
      setBlockedByOther(false);

      setOpen(false);
      toast.success("User blocked successfully");
    } catch (err) {
      console.error("Error blocking user:", err);
      toast.error("Failed to block user");
    }
  };

  const handleUnblockChat = async () => {
    if (!selectedUser) return;

    const receiverId =
      Number(selectedUser.senderId) === Number(myId)
        ? selectedUser.receiverId
        : selectedUser.senderId;

    try {
      await api.post(`/block/unblock/${myId}/${receiverId}`);

      // ✅ IMMEDIATE UI UPDATE
      setBlockedByMe(false);
      setBlockedByOther(false);

      setOpen(false);
      toast.success("User unblocked successfully");
    } catch (err) {
      console.error("Error unblocking user:", err);
      toast.error("Failed to unblock user");
    }
  };

  return (
    <div className="chatpage-container">
      {/* LEFT PANEL */}
      <div className="chatlist-container">
        <div className="chatlist-header d-flex justify-content-center align-items-center">
          <img src="/vivahjeevan_logo.png" alt="" height="50" />
          <h3>Vivahjeevan</h3>
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
              <img
                src={getUserImageById(
                  Number(selectedUser.senderId) === Number(myId) ? selectedUser.receiverId : selectedUser.senderId
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
                <span
                  className={`active-status ${onlineStatus ? "online" : "offline"}`}
                >
                  {onlineStatus ? "Online" : "Offline"}
                </span>
                {/* <span className="active-status">Active now</span> */}
              </div>
            </div>

            <div className="chatwindow-menu" ref={menuRef}>
              <TfiMenuAlt
                size={25}
                className="menu-icon"
                onClick={() => setOpen(!open)}
              />

              {open && (
                <div className="chat-dropdown">
                  <div className="dropdown-item" onClick={handleClearChat}>
                    Clear Chat
                  </div>

                  {!blockedByMe && !blockedByOther && (
                    <div className="dropdown-item" onClick={handleBlockChat}>
                      Block User
                    </div>
                  )}
                  {blockedByMe && (
                    <div className="dropdown-item" onClick={handleUnblockChat}>
                      Unblock User
                    </div>
                  )}

                  <div className="dropdown-item danger">Report</div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="select-user">Select a user to start chatting</div>
        )}

        <div className="chatwindow-messages" ref={chatScrollRef}>
          {loadingHistory && (
            <div className="chat-loader">
              <div className="spinner" />
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-bubble ${Number(msg.senderId) === Number(myId)
                ? "my-message"
                : "their-message"
                }`}
            >
              <div className={!isPremium && Number(msg.senderId) !== Number(myId) ? "blur-message" : ""}>
                {!isPremium && Number(msg.senderId) !== Number(myId)
                  ? "Premium message"
                  : msg.message}
              </div>

              <div className="chat-time">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="chatwindow-input">
          {blockedByMe ? (
            <div className="blocked-warning">You have blocked this user</div>
          ) : blockedByOther ? (
            <div className="blocked-warning">You are blocked by this user</div>
          ) : isPremium ? (
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