import React, { useMemo, useEffect, useState } from "react";
import "../styleSheets/AdminProfile.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProfiles } from "../redux/thunk/profileThunk";

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

export default function AdminProfile() {
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth);
  const { profiles: users } = useSelector((state) => state.profiles);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // 10 users per page

  useEffect(() => {
    if (role[0].toUpperCase() === "ADMIN") {
      dispatch(fetchAdminProfiles());
    };
  }, [dispatch, role]);
  // console.log("profiles :", profiles);

  const stats = useMemo(() => {
    const total = users.length;
    const tNow = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    const in24 = users.filter(
      (u) => tNow - new Date(u.createdAt).getTime() <= dayMs
    ).length;

    const in7 = users.filter(
      (u) => tNow - new Date(u.createdAt).getTime() <= 7 * dayMs
    ).length;

    const in30 = users.filter(
      (u) => tNow - new Date(u.createdAt).getTime() <= 30 * dayMs
    ).length;

    const sorted = [...users].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return { total, in24, in7, in30, sorted };
  }, [users]);

  // ------------------------
  // PAGINATION LOGIC
  // ------------------------

  const totalPages = Math.ceil(stats.sorted.length / pageSize);

  const currentPageData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return stats.sorted.slice(start, start + pageSize);
  }, [currentPage, stats.sorted]);


  return (
    <div className="ap-root">
      <h2 className="ap-title">Recently Joined Users</h2>

      {loading ? (
        <p style={{ textAlign: "center", marginTop: 20 }}>Loading...</p>
      ) : (
        <>
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

          {/* User List */}
          <div className="ap-list">
            <div className="ap-list-header">
              <div>User</div>
              <div>Location</div>
              <div>Joined</div>
            </div>

            {currentPageData.map((u) => (
              <div className="ap-row" key={u.id}>
                <div className="ap-user">
                  <div className="ap-avatar">
                    {(u.firstName || u.name || "?").charAt(0)}
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
                    {timeAgo(u.createdAt || u.joinedAt)}
                  </div>
                  <div className="ap-timestamp">
                    {new Date(u.createdAt || u.joinedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Buttons */}
          <div className="pagination-controls">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              ◀ Previous
            </button>

            <span className="page-number">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
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
