import React, { useState, useRef, useEffect } from "react";
import backendIP from "../api/api";
import { FiSend, FiSearch } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../styleSheets/chatWindow.css";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import api from "../api/axiosInstance";
import { TfiMenuAlt } from "react-icons/tfi";
import { toast } from "react-toastify";
import ReportUserModal from "./ReportUserModal";
import ViewProfileModal from "./ViewProfileModal";
import { fetchProfileById } from "../redux/thunk/profileThunk";
import { getProfileImage } from "../utils/profileImage";

const ChatWindow = () => {
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: myId, token, role, myProfile } = useSelector((state) => state.auth);
  const { selectedProfile, profileLoading } = useSelector(state => state.profiles);

  const [acceptedList, setAcceptedList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(false);
  const [blockedByMe, setBlockedByMe] = useState(false);
  const [blockedByOther, setBlockedByOther] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportCategory, setReportCategory] = useState("");
  const [isReported, setIsReported] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [freeMessagesSent, setFreeMessagesSent] = useState(false);

  const messagesEndRef = useRef(null);
  const stompClientRef = useRef(null);
  const activeChatUserRef = useRef(null);

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const chatScrollRef = useRef(null);
  const isInitialLoadRef = useRef(true);
  const prevScrollHeightRef = useRef(0);
  const [showModal, setShowModal] = useState(false);

  console.log("acceptedList: ", acceptedList);
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
    setShowChat(!!selectedUser);
  }, [selectedUser]);

  useEffect(() => {
    activeChatUserRef.current = Number(userId);
  }, [userId]);

  // reset pagination
  useEffect(() => {
    const uid = Number(userId);

    if (!myId || !userId || isNaN(uid)) return;

    setMessages([]);
    setPage(0);
    setHasMore(true);
    isInitialLoadRef.current = true;

    loadMessages(0, true);
  }, [userId, myId]);

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
  // console.log("online : ", onlineStatus);

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

        // ✅ Only select chat if URL has a valid userId
        if (userId && !isNaN(Number(userId))) {
          const selected = merged.find(
            (c) => Number(c.senderId) === Number(userId) || Number(c.receiverId) === Number(userId)
          );

          setSelectedUser(selected || null);
        } else {
          setSelectedUser(null);
        }

      } catch (err) {
        console.error("Error fetching accepted list:", err);
      }
    };

    fetchAcceptedRequests();
  }, [myId, userId]);

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
      const uid = Number(userId);
      if (isNaN(uid)) return;

      const res = await api.get(
        `/chat/conversation/${myId}/${uid}?page=${pageNo}&size=20`
      );
      // console.log("chat data : ", res);
      // 🔁 Backend gives DESC → convert to ASC
      const newMessages = (res.data.content || []).reverse(); // ✅ ASC order

      setHasMore(!res.data.last);
      setPage(pageNo);

      // 🔼 Prepend old messages OR reset chat
      setMessages(prev => reset ? newMessages : [...newMessages, ...prev]);
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
          const subscription = client.subscribe("/user/queue/messages", (msg) => {
            // console.log("📩 Live message received:", msg.body);
            handleIncoming(JSON.parse(msg.body));
          },
            { id: "chat-sub" }
          );

          client.subscribe("/user/queue/seen", (msg) => {
            const seenByUserId = Number(msg.body);
            handleSeenUpdate(seenByUserId);
          });
          // console.log("📡 Subscribed to /user/queue/messages:", subscription);
        },

        onStompError: (frame) => {
          console.error("STOMP Error:", frame);

          if (frame.body?.includes("PREMIUM_REQUIRED")) {
            toast.error("Upgrade to Premium to continue chatting");
            navigate("/dashboard/premium");
          }
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
    if (!container || messages.length === 0) return;

    if (isInitialLoadRef.current) {
      // 🔽 First load → jump to bottom
      container.scrollTop = container.scrollHeight;
      isInitialLoadRef.current = false;

      // ✅ THIS is the important line
      if (isAtBottom()) {
        markMessagesAsSeen();
      }
    } else {
      // 🔼 Preserve position when older messages load
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

      if (isAtBottom()) {
        markMessagesAsSeen();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [page, hasMore, loadingHistory]);

  // mark seen
  const markMessagesAsSeen = () => {
    if (!myId || !userId || messages.length === 0) return;
    const unseenFromOther = messages.some(
      m =>
        Number(m.senderId) === Number(userId) &&
        Number(m.receiverId) === Number(myId) &&
        !m.seen
    );
    if (!unseenFromOther) return;

    api.post(`/chat/seen/${userId}/${myId}`)
      .then(() => {
        // ✅ update local state immediately
        setMessages(prev => prev.map(m =>
          Number(m.senderId) === Number(userId) ? { ...m, seen: true } : m));
      })
      .catch(() => { });
  };

  const isAtBottom = () => {
    const container = chatScrollRef.current;
    if (!container) return false;

    return (
      container.scrollHeight - container.scrollTop - container.clientHeight < 20
    );
  };

  /* SEND MESSAGE */
  const handleSend = () => {
    if (blockedByMe || blockedByOther) return;
    if (!selectedUser) return;

    const receiverId = Number(selectedUser.senderId) === Number(myId) ? selectedUser.receiverId : selectedUser.senderId;

    if (!isPremium) {

      if (freeMessagesSent >= 2) {
        toast.info("Upgrade to Premium to continue chatting");
        return;
      }

      const msgBody = {
        senderId: myId,
        receiverId,
        message: "default",
        timestamp: new Date().toISOString(),
        seen: false
      };

      // ✅ Optimistic UI update
      const tempId = Date.now();
      setMessages(prev => [...prev, { ...msgBody, tempId }]);
      setFreeMessagesSent(prev => prev + 1);

      if (stompClientRef.current?.connected) {
        stompClientRef.current.publish({
          destination: `/app/chat.send/${receiverId}`,
          body: JSON.stringify(msgBody),
        });
      }

      return;
    }

    //PREMIUM USER → send typed message
    if (!message.trim()) return;

    const msgBody = {
      senderId: myId,
      receiverId,
      message,
      timestamp: new Date().toISOString(),
      seen: false
    };
    console.log("📤 Sending message:", msgBody);

    const tempId = Date.now();
    setMessages(prev => [...prev, { ...msgBody, tempId }]);
    setMessage("");

    if (stompClientRef.current?.connected) {
      stompClientRef.current.publish({
        destination: `/app/chat.send/${receiverId}`,
        body: JSON.stringify(msgBody),
      });

      console.log(`🚀 Published to /app/chat.send/${receiverId}`, JSON.stringify(msgBody));
    } else {
      console.error("❌ Cannot send — STOMP is NOT connected");
    }
  };

  useEffect(() => {
    if (!isPremium && messages.length > 0) {
      const myFreeMsgs = messages.filter(
        m =>
          Number(m.senderId) === Number(myId) &&
          m.message === "default"
      ).length;

      setFreeMessagesSent(myFreeMsgs);
    }
  }, [messages, isPremium, myId]);

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

    const activeChatUserId = activeChatUserRef.current;

    // ✅ ONLY accept messages for the currently open chat
    const isForCurrentChat =
      (Number(body.senderId) === Number(activeChatUserId) &&
        Number(body.receiverId) === Number(myId)) ||
      (Number(body.senderId) === Number(myId) &&
        Number(body.receiverId) === Number(activeChatUserId));

    if (!isForCurrentChat) {
      console.log("🚫 Message ignored (not active chat):", body);
      return;
    }

    setMessages(prev => {
      const exists = prev.some(m => m.tempId && m.senderId === body.senderId && m.message === body.message);

      if (exists) {
        return prev.map(m => m.tempId && m.senderId === body.senderId && m.message === body.message ? body : m);
      }
      return [...prev, body];
    });

    const container = chatScrollRef.current;
    if (!container) return;

    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 80;

    if (isNearBottom) {
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;

        // ✅ Mark seen only if this chat is open
        api.post(`/chat/seen/${body.senderId}/${myId}`).catch(() => { });
      }, 50);
    }
  };

  const handleSeenUpdate = (seenByUserId) => {
    setMessages(prev =>
      prev.map(m =>
        Number(m.senderId) === Number(myId) &&
          Number(m.receiverId) === Number(seenByUserId)
          ? { ...m, seen: true }
          : m
      )
    );
  };

  const getUserDetails = (otherUserId) => {
    if (!acceptedList || acceptedList.length === 0)
      return { name: "User", photo: "/placeholder_boy.png", gender: "Male" };

    const match = acceptedList.find((c) => Number(c.senderId) === Number(otherUserId) || Number(c.receiverId) === Number(otherUserId));
    console.log("match accept: ", match)

    if (!match)
      return { name: "User", photo: "/placeholder_boy.png", gender: "Male" };

    let name = "";
    let photo = null;
    let gender = null;

    if (Number(match.senderId) === Number(otherUserId)) {
      name = match.senderName;
      photo = match.senderPhoto;
      gender = match.senderGender;
    } else {
      name = match.receiverName;
      photo = match.receiverPhoto;
      gender = match.receiverGender;
    }

    if (!photo) {
      photo = gender === "Female"
        ? "/placeholder_girl.png"
        : "/placeholder_boy.png";
    }

    return { name, photo, gender };
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

  const handleReportUser = async () => {
    if (!reportCategory) {
      toast.error("Please select a category");
      return;
    }

    if (!reportReason.trim()) {
      toast.error("Please enter reason");
      return;
    }

    const reportedUserId =
      Number(selectedUser.senderId) === Number(myId)
        ? selectedUser.receiverId
        : selectedUser.senderId;

    try {
      const repoRes = await api.post(`/reports/user/${reportedUserId}?reporterId=${myId}&reason=${reportCategory}`, {
        reporterId: myId,
        reportedUserId,
        reason: reportCategory,
        description: reportReason
      });

      toast.success("User reported successfully");
      console.log("report data: ", reportCategory, reportReason, reportedUserId);
      console.log("report res: ", repoRes);
      setIsReported(true);
      setReportReason("");
      setReportCategory("");
      setShowReportModal(false);
    } catch (err) {
      console.error("Error reporting user:", err);
      toast.error("Failed to report user", err);
    }
  };

  useEffect(() => {
    setIsReported(false);
  }, [userId]);

  let headerUser = { name: "User", photo: "/placeholder_boy.png" };
  if (selectedUser) {
    const otherId = Number(selectedUser.senderId) === Number(myId) ? selectedUser.receiverId : selectedUser.senderId;
    headerUser = getUserDetails(otherId);
  };

  const handleViewProfile = async () => {
    if (!selectedUser) return;
    const otherId = Number(selectedUser.senderId) === Number(myId) ? selectedUser.receiverId : selectedUser.senderId;
    try {
      await dispatch(fetchProfileById({ myId, userId: otherId })).unwrap();
      setShowModal(true); // open ONLY after data arrives
    } catch (err) {
      toast.error("Failed to load profile");
    }
  };

  // console.log("selectedProfile: ", selectedProfile);

  return (
    <div className={`chatpage-container ${showChat ? "show-chat" : ""}`}>
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
              const otherId = Number(c.senderId) === Number(myId) ? c.receiverId : c.senderId;
              const name = Number(c.senderId) === Number(myId) ? c.receiverName : c.senderName;
              const img = Number(c.senderId) === Number(myId) ? c.receiverImage : c.senderImage;
              const user = getUserDetails(otherId)
              console.log("user details: ", user)
              return (
                <div
                  key={c.requestId}
                  className={`chatlist-item ${Number(otherId) === Number(userId)
                    ? "active-contact"
                    : ""
                    }`}
                  onClick={() => {
                    setShowChat(true);
                    navigate(`/dashboard/messages/${otherId}`);
                  }}
                >
                  <img
                    src={getProfileImage(user)}
                    alt={user.name}
                    className="chatlist-avatar"
                    onError={(e) => (e.target.src = "/placeholder_boy.png")}
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

            {/* ✅ Mobile back button (WhatsApp style) */}
            <button
              className="mobile-back-btn"
              onClick={() => {
                setShowChat(false);
                setSelectedUser(null);
              }}
            >
              ←
            </button>

            <div className="chatwindow-user">
              <img
                src={getProfileImage(headerUser)}
                alt={headerUser.name}
                className="chatwindow-avatar"
                onError={(e) => (e.target.src = "/placeholder_boy.png")}
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
                  <div className="dropdown-item" onClick={handleViewProfile}>
                    View Profile
                  </div>

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

                  <div
                    className="dropdown-item danger"
                    onClick={() => { setShowReportModal(true); setOpen(false); }}
                  >
                    Report
                  </div>
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

                {Number(msg.senderId) === Number(myId) && (
                  <span className={`seen-status ${msg.seen ? "seen" : "sent"}`}>
                    {msg.seen ? " ✔✔" : " ✔"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="chatwindow-input">
          {isReported ? (
            <div className="blocked-warning"> This account is reported </div>
          ) : blockedByMe ? (
            <div className="blocked-warning"> You have blocked this user </div>
          ) : blockedByOther ? (
            <div className="blocked-warning"> You are blocked by this user </div>
          ) : (
            <div className="chat-input-box">

              <input
                type="text"
                placeholder={!isPremium ? freeMessagesSent >= 2 ? "Upgrade to Premium to continue chatting" : "Click send to send interest message" : "Write a message..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="msg-input"
                readOnly={!isPremium || freeMessagesSent >= 2}   // ⭐ free user cannot type
              />

              <button onClick={handleSend} className="send-button">
                <FiSend size={18} />
              </button>

            </div>
          )}
        </div>

      </div>

      {showModal && (
        profileLoading ? (
          <p className="no-requests-message">Loading profile...</p>
        ) : (
          selectedProfile && (
            <ViewProfileModal
              premium={myProfile?.premium}
              profile={selectedProfile}
              onClose={() => setShowModal(false)}
            />
          )
        )
      )}

      <ReportUserModal
        show={showReportModal}
        onClose={() => {
          setShowReportModal(false);
          setReportReason("");
          setReportCategory("");
        }}
        reason={reportReason}
        setReason={setReportReason}
        category={reportCategory}
        setCategory={setReportCategory}
        onSubmit={handleReportUser}
      />

    </div>
  );
};

export default ChatWindow;