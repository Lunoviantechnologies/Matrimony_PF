import React, { useEffect, useState } from "react";
import "../styleSheets/AdminProfile.css";
import api from "../api/axiosInstance";

function timeAgo(iso) {
  const d = new Date(iso);
  const diff = Math.max(0, Date.now() - d.getTime());
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  return `${days}d ago`;
}

export default function AdminProfile() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    joinedIn24Hours: 0,
    joinedIn7Days: 0,
    joinedIn30Days: 0,
  });

  const [currentPage, setCurrentPage] = useState(0); // backend uses 0 index
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const pageSize = 10;

  /* -----------------------------------
     Fetch Recently Joined (Server Pagination)
  ----------------------------------- */
  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `/admin/recent-users?page=${currentPage}&size=${pageSize}`
        );

        const data = res.data;

        setStats({
          totalUsers: data.totalUsers,
          joinedIn24Hours: data.joinedIn24Hours,
          joinedIn7Days: data.joinedIn7Days,
          joinedIn30Days: data.joinedIn30Days,
        });

        setUsers(data.users.content || []);
        setTotalPages(data.users.totalPages || 0);

      } catch (err) {
        console.error("Error fetching recently joined users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentUsers();
  }, [currentPage]);

  return (
    <div className="ap-root">
      <h2 className="ap-title">Recently Joined Users</h2>

      {loading ? (
        <p style={{ textAlign: "center", marginTop: 20 }}>Loading...</p>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="ap-cards">
            <div className="ap-card">
              <div className="ap-card-number">{stats.joinedIn24Hours}</div>
              <div className="ap-card-label">Joined in 24 hrs</div>
            </div>

            <div className="ap-card">
              <div className="ap-card-number">{stats.joinedIn7Days}</div>
              <div className="ap-card-label">Joined in 7 days</div>
            </div>

            <div className="ap-card">
              <div className="ap-card-number">{stats.joinedIn30Days}</div>
              <div className="ap-card-label">Joined in 30 days</div>
            </div>

            <div className="ap-card">
              <div className="ap-card-number">{stats.totalUsers}</div>
              <div className="ap-card-label">Total users</div>
            </div>
          </div>

          {/* User List */}
          <div className="ap-list">
            <div className="ap-list-header">
              <div>User</div>
              <div>Location</div>
              <div>Joined</div>
            </div>

            {users.map((u) => (
              <div className="ap-row" key={u.id}>
                <div className="ap-user">
                  <div className="ap-avatar">
                    {(u.firstName || "?").charAt(0)}
                  </div>

                  <div>
                    <div className="ap-name">
                      {u.firstName} {u.lastName}
                    </div>
                    <div className="ap-sub">{u.education || ""}</div>
                  </div>
                </div>

                <div className="ap-location">{u.city || "—"}</div>

                <div className="ap-joined">
                  <div className="ap-time">
                    {timeAgo(u.createdAt)}
                  </div>
                  <div className="ap-timestamp">
                    {new Date(u.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination-controls">
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              ◀ Previous
            </button>

            <span className="page-number">
              Page {currentPage + 1} of {totalPages}
            </span>

            <button
              disabled={currentPage + 1 === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
}