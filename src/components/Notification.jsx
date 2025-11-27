import React, { useState, useRef, useEffect } from "react";
import "../stylesheets/Notification.css";
import { FaBell } from "react-icons/fa";

const Notification = ({ notifications = [], onNavigate }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }; 
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleItemClick = (item) => {
    onNavigate(item.type, item.targetId); // route to correct page
    setOpen(false);
  };

  return (
    <div className="notif-container" ref={dropdownRef}>
      <div className="notif-icon" onClick={() => setOpen(!open)}>
        <FaBell size={22} />
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      </div>

      {open && (
        <div className="notif-dropdown">
          {notifications.length === 0 ? (
            <div className="notif-empty">No notifications</div>
          ) : (
            notifications.map((item, i) => (
              <div
                key={i}
                className={`notif-item ${!item.read ? "unread" : ""}`}
                onClick={() => handleItemClick(item)}
              >
                <div className="notif-title">{item.title}</div>
                <div className="notif-time">{item.time}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
