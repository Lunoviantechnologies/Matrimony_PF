import React, { useState, useRef, useEffect } from "react";
import "../stylesheets/Notification.css";
import { FaBell } from "react-icons/fa";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import backendIP from "../api/api";
import { useSelector } from "react-redux";
import api from "../api/axiosInstance";

const AdminNotification = ({ onNavigate }) => {
  const { id: myId, token } = useSelector((state) => state.auth);

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  /* ------------------------------------------------
     1. Load old notifications
  ------------------------------------------------ */
  useEffect(() => {
    if (!myId) return;

    api.get(`/admin/notifications/All?userId=${myId}`)
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data : res.data?.content || [];

        // 🔑 normalize read flag
        const normalized = data.map((n) => ({...n, read: Boolean(n.read),}));

        setNotifications(normalized);
      })
      .catch((err) => {
        console.error("❌ Failed loading notifications:", err);
        setNotifications([]);
      });
  }, [myId]);

  /* ------------------------------------------------
     2. WebSocket + STOMP
  ------------------------------------------------ */
  useEffect(() => {
    if (!myId) return;

    const wsBase = backendIP.replace("/api", "");
    const wsURL = `${wsBase}/ws-chat?userId=${myId}`;

    const socket = new SockJS(wsURL);

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      onConnect: () => {
        console.log("🟢 WS CONNECTED");

        client.subscribe("/user/queue/notifications", (message) => {
          const notif = JSON.parse(message.body);

          setNotifications((prev) => [
            { ...notif, read: false },
            ...(Array.isArray(prev) ? prev : []),
          ]);
        });
      },

      onStompError: (frame) => {
        console.error("❌ STOMP Error:", frame);
      },
    });

    client.activate();

    return () => client.deactivate();
  }, [myId, token]);

  /* ------------------------------------------------
     3. Close dropdown on outside click
  ------------------------------------------------ */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ------------------------------------------------
     4. Mark single notification read
  ------------------------------------------------ */
  const markAsRead = async (id) => {
    try {
      await api.post(`/admin/notifications/read/${id}`);

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("❌ Failed marking read:", err);
    }
  };

  /* ------------------------------------------------
     5. Mark ALL notifications read
  ------------------------------------------------ */
  const markAllAsRead = async () => {
    try {
      await api.post(`/admin/notifications/mark-all-read?userId=${myId}`);

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    } catch (err) {
      console.error("❌ Failed marking all read:", err);
    }
  };

  /* ------------------------------------------------
     6. On notification click
  ------------------------------------------------ */
  const handleItemClick = (item) => {
    markAsRead(item.id);
    onNavigate(item.type, item.targetId);
    setOpen(false);
  };

  /* ------------------------------------------------
     7. Unread count
  ------------------------------------------------ */
  const unreadCount = notifications.filter((n) => !n.read).length;

  /* ------------------------------------------------
     8. Render
  ------------------------------------------------ */
  return (
    <div className="notif-container" ref={dropdownRef}>
      <div className="notif-icon" onClick={() => setOpen(!open)}>
        <FaBell size={20} />
        {unreadCount > 0 && (<span className="notif-badge">{unreadCount}</span>)}
      </div>

      {open && (
        <div className="notif-dropdown">
          {unreadCount > 0 && (
            <div className="notif-actions">
              <button
                className="mark-all-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  markAllAsRead();
                }}
              >
                Mark all as read
              </button>
            </div>
          )}

          {notifications.length === 0 && (
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

export default AdminNotification;