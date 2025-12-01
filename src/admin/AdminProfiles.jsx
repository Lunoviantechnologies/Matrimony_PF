import React, { useMemo } from "react";
import "../styleSheets/AdminProfile.css";

/**
 * AdminProfile.jsx
 * - Frontend only demo of "recently joined" admin widget.
 * - Replace MOCK_USERS with API data later.
 */

const now = () => new Date();

const MOCK_USERS = [
  { id: "u101", name: "Aarushi Sharma", joinedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), city: "Hyderabad" }, // 2 hours ago
  { id: "u102", name: "Arjun Reddy", joinedAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(), city: "Bangalore" }, // 26 hours ago ~ 1 day
  { id: "u103", name: "Sneha Patil", joinedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), city: "Pune" }, // 3 days ago
  { id: "u104", name: "Rohit Verma", joinedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), city: "Delhi" }, // 10 days ago
  { id: "u105", name: "Aditi Singh", joinedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), city: "Lucknow" }, // 20 days ago
  { id: "u106", name: "Vishal Kumar", joinedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), city: "Chennai" }, // 40 days ago
];

function timeAgo(iso) {
  const d = new Date(iso);
  const diff = Math.max(0, Date.now() - d.getTime());
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec} sec${sec !== 1 ? "s" : ""} ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min${min !== 1 ? "s" : ""} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hr / 24);
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months !== 1 ? "s" : ""} ago`;
}

export default function AdminProfile({ users = MOCK_USERS }) {
  // derive counts & sorted list
  const stats = useMemo(() => {
    const total = users.length;
    const tNow = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const in24 = users.filter(u => tNow - new Date(u.joinedAt).getTime() <= dayMs).length;
    const in7 = users.filter(u => tNow - new Date(u.joinedAt).getTime() <= 7 * dayMs).length;
    const in30 = users.filter(u => tNow - new Date(u.joinedAt).getTime() <= 30 * dayMs).length;

    // sorted newest first
    const sorted = [...users].sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt));

    return { total, in24, in7, in30, sorted };
  }, [users]);

  return (
    <div className="ap-root">
      <h2 className="ap-title">Recently Joined Users</h2>

      <div className="ap-cards">
        <div className="ap-card">
          <div className="ap-card-number">{stats.in24}</div>
          <div className="ap-card-label">Joined in 24 hrs</div>
        </div>

        <div className="ap-card">
          <div className="ap-card-number">{stats.in7}</div>
          <div className="ap-card-label">Joined in 7 days</div>
        </div>

        <div className="ap-card">
          <div className="ap-card-number">{stats.in30}</div>
          <div className="ap-card-label">Joined in 30 days</div>
        </div>

        <div className="ap-card">
          <div className="ap-card-number">{stats.total}</div>
          <div className="ap-card-label">Total users</div>
        </div>
      </div>

      <div className="ap-list">
        <div className="ap-list-header">
          <div>User</div>
          <div>Location</div>
          <div>Joined</div>
        </div>

        {stats.sorted.map(u => (
          <div className="ap-row" key={u.id}>
            <div className="ap-user">
              <div className="ap-avatar">{u.name.charAt(0)}</div>
              <div>
                <div className="ap-name">{u.name}</div>
                <div className="ap-sub">{u.education || ""}</div>
              </div>
            </div>

            <div className="ap-location">{u.city || "—"}</div>

            <div className="ap-joined">
              <div className="ap-time">{timeAgo(u.joinedAt)}</div>
              <div className="ap-timestamp">{new Date(u.joinedAt).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
