import React, { useState, useRef, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axiosInstance";
import { markRead, markAllRead} from "../redux/slices/notificationSlice";
import "../styleSheets/Notification.css";

const Notification = ({ onNavigate }) => {
  const dispatch = useDispatch();
  const { id: myId } = useSelector(s => s.auth);
  const notifications = useSelector(s => s.notifications.list);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // close dropdown on outside click
  useEffect(() => {
    const handler = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // unread count
  const unreadCount =
    notifications?.filter(n => !n.read).length || 0;

  // mark single notification read
  const handleMarkRead = async item => {
    try {
      await api.post(`/notifications/read/${item.id}`);

      dispatch(markRead(item.id));

      if (onNavigate) {
        onNavigate(item.type, item.targetId);
      }

      setOpen(false);
    } catch (err) {
      console.error("Failed marking read:", err);
    }
  };

  // mark all read
  const handleMarkAll = async e => {
    e.stopPropagation();

    try {
      await api.post(`/notifications/mark-all-read?userId=${myId}`);

      dispatch(markAllRead());
    } catch (err) {
      console.error("Failed marking all read:", err);
    }
  };

  return (
    <div className="notif-container" ref={dropdownRef}>
      {/* Bell */}
      <div className="notif-icon" onClick={() => setOpen(!open)}>
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount}</span>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="notif-dropdown">

          {unreadCount > 0 && (
            <div className="notif-actions">
              <button
                className="mark-all-btn"
                onClick={handleMarkAll}
              >
                Mark all as read
              </button>
            </div>
          )}

          {notifications.length === 0 && (
            <div className="notif-empty">
              No notifications
            </div>
          )}

          {notifications.map(item => (
            <div
              key={item.id}
              className={`notif-item ${!item.read ? "unread" : ""
                }`}
              onClick={() => handleMarkRead(item)}
            >
              <div className="notif-title">
                {item.message}
              </div>

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