import React, { useState, useRef, useEffect } from "react";
import "../stylesheets/Notification.css";
import { FaBell } from "react-icons/fa";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import backendIP from "../api/api";
import axios from "axios";
import { useSelector } from "react-redux";

const Notification = ({ onNavigate }) => {
  const { id: myId } = useSelector((state) => state.auth);

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ------------------------------------------------
  // 1. Load old notifications once
  // ------------------------------------------------
  useEffect(() => {
    if (!myId) return;

    console.log("📥 Fetching saved notifications...");

    axios
      .get(`${backendIP}/notifications/GetAll?userId=${myId}`)
      .then((res) => {
        console.log("📦 Initial notifications:", res.data);

        if (Array.isArray(res.data)) {
          setNotifications(res.data);
        } else if (res.data.content) {
          setNotifications(res.data.content);
        } else {
          setNotifications([]);
        }
      })
      .catch((err) => {
        console.error("❌ Failed loading notifications:", err);
        setNotifications([]);
      });
  }, [myId]);

  // ------------------------------------------------
  // 2. WebSocket + STOMP Setup
  // ------------------------------------------------
  useEffect(() => {
    if (!myId) return;

    const wsBase = backendIP.replace("/api", "");
    const wsURL = `${wsBase}/ws-chat?userId=${myId}`;

    console.log("🌐 Attempting WS connection:", wsURL);

    const socket = new SockJS(wsURL);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      connectHeaders: {
        userId: String(myId)
      },

      debug: (msg) => {
        console.log("🔧 STOMP Debug:", msg);
      },

      onConnect: () => {
        console.log("🟢 WS CONNECTED for user:", myId);

        client.subscribe(
          `/user/queue/notifications`,
          (message) => {
            console.log("📨 Live notification received:", message);

            const notif = JSON.parse(message.body);

            setNotifications((prev) => {
              const prevList = Array.isArray(prev) ? prev : [];
              return [{ ...notif, read: false }, ...prevList];
            });
          }
        );
      },

      onWebSocketClose: () => {
        console.warn("🔴 WebSocket closed — will auto reconnect");
      },

      onStompError: (frame) => {
        console.error("❌ STOMP Error:", frame);
      },
    });

    client.activate();

    return () => {
      console.log("🛑 Cleaning WS connection...");
      client.deactivate();
    };
  }, [myId]);

  // ------------------------------------------------
  // 3. Close dropdown when clicking outside
  // ------------------------------------------------
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ------------------------------------------------
  // 4. Mark as Read
  // ------------------------------------------------
  const markAsRead = async (id) => {
    try {
      await axios.post(`${backendIP}/notifications/mark-all-read?userId=${myId}`);

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );

      console.log("✔ Marked read:", id);
    } catch (err) {
      console.error("❌ Failed marking read:", err);
    }
  };

  // ------------------------------------------------
  // 5. On Click of Notification
  // ------------------------------------------------
  const handleItemClick = (item) => {
    console.log("➡ Notification clicked:", item);

    markAsRead(item.id);
    onNavigate(item.type, item.targetId);
    setOpen(false);
  };

  // ------------------------------------------------
  // 6. Unread Count
  // ------------------------------------------------
  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  // ------------------------------------------------
  // 7. Render
  // ------------------------------------------------
  return (
    <div className="notif-container" ref={dropdownRef}>
      <div className="notif-icon" onClick={() => setOpen(!open)}>
        <FaBell size={20} />
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      </div>

      {open && (
        <div className="notif-dropdown">
          {(!notifications || notifications.length === 0) && (
            <div className="notif-empty">No notifications</div>
          )}

          {notifications.map((item) => (
            <div
              key={item.id}
              className={`notif-item ${!item.read ? "unread" : ""}`}
              onClick={() => handleItemClick(item)}
            >
              <div className="notif-title">{item.message}</div>
              <div className="notif-time">
                {new Date(item.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notification;