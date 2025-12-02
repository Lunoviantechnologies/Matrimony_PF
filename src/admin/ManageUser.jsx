import React, { useEffect, useMemo, useState } from "react";
import "../stylesheets/ManageUsers.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfiles } from "../redux/thunk/profileThunk";
import axios from "axios";
import backendIP from "../api/api";

export default function ManageUser({ pageSize = 10 }) {
  const dispatch = useDispatch();
  const { profiles = [], loading } = useSelector((state) => state.profiles);
  console.log("data:", profiles);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [detailUser, setDetailUser] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, user: null });
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchUserProfiles());
  }, [dispatch]);

  // ================= SAFE USER ID FUNCTION =================
  const getUserId = (u) => u?.userId || u?.id || u?.profileId;

  /* =========================
     DELETE USER API
  ============================ */
const handleDelete = async (id) => {
  try {
    await axios.delete(`${backendIP}/admin/delete/${id}`);

    setSearch("");

    alert("User deleted successfully");

    dispatch(fetchUserProfiles());

    setDetailUser(false);
    setConfirm({ open: false, user: null }); // ✅ THIS CLOSES MODAL

  } catch (error) {
    console.error("Delete failed:", error.response?.data || error.message);

    alert(
      "Delete failed. Check if backend API URL matches:\n" +
        `${backendIP}/admin/delete/${id}`
    );
  }
};


  // ================= FILTER + SEARCH =================
  const filteredUsers = useMemo(() => {
    const safeSearch = String(search || "").toLowerCase(); // ✅ FIXED

    return profiles.filter((u) => {
      const name = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();

      const matchSearch = name.includes(safeSearch);

      const matchStatus = statusFilter ? u.profileStatus === statusFilter : true;

      return matchSearch && matchStatus;
    });
  }, [profiles, search, statusFilter]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  const openDetail = (user) => setDetailUser(user);
  const closeDetail = () => setDetailUser(null);

  return (
    <div className="manage-users-root">
      {/* ================= HEADER ================= */}
      <div className="mu-header">
        <h2>Manage Users</h2>


        <div className="mu-controls">
          <input
            type="text"
            placeholder="Search users..."
            className="mu-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="mu-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="pending_verification">Pending</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="mu-table-wrap">
        {loading ? (
          <div className="mu-loading">Loading users...</div>
        ) : paginatedUsers.length === 0 ? (
          <div className="mu-empty">No users found</div>
        ) : (
          <table className="mu-table">
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>User</th>
                <th>Email</th>
                <th>City</th>
                <th>Membership</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.map((u, index) => {
                const initials = `${(u.firstName || "U").charAt(0)}${
                  (u.lastName || "").charAt(0)
                }`.toUpperCase();

                return (
                  <tr
                    key={getUserId(u) || index}
                    className={u.profileStatus !== "active" ? "mu-row-muted" : ""}
                  >
                    <td>
                      <div className="mu-avatar">{initials}</div>
                    </td>

                    <td onClick={() => openDetail(u)}>
                      <div className="mu-user-cell">
                        <div>
                          <div className="mu-name">
                            {u.firstName || "No"} {u.lastName || "Name"}
                          </div>
                          <div className="mu-id">
                            ID: {getUserId(u) || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>{u.age || "-"}</td>
                    <td>{u.city || "-"}</td>

                    <td>
                      <span
                        className={`mu-badge ${
                          u.membership === "Premium" ? "premium" : ""
                        }`}
                      >
                        {u.membership || "Free"}
                      </span>
                    </td>


                    <td>
                      <span className={`mu-status ${u.profileStatus || "active"}`}>
                        {u.profileStatus || "active"}
                      </span>
                    </td>

                    <td className="mu-actions">
                      <button
                        className="btn btn-small"
                        onClick={() => openDetail(u)}
                      >
                        View
                      </button>

                      <button
                        className="btn btn-small btn-danger"
                        onClick={() => setConfirm({ open: true, user: u })}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= FOOTER ================= */}
      <div className="mu-footer">
        <span className="mu-rows-info">
          Showing {paginatedUsers.length} of {filteredUsers.length} users
        </span>

        <div className="mu-pagination">
          <button
            className="btn btn-small"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>

          <span>
            {page} / {totalPages}
          </span>

          <button
            className="btn btn-small"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* ================= VIEW USER MODAL ================= */}
      {detailUser && (
        <div className="mu-modal-backdrop" onClick={closeDetail}>
          <div className="mu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mu-modal-header">
              <h3>User Details</h3>
              <button className="btn btn-small" onClick={() => setDetailUser(null)}>
                X
              </button>
            </div>

            <div className="mu-modal-body">
              <div className="mu-detail-row">
                <b>Name:</b> {detailUser.firstName || "-"}{" "}
                {detailUser.lastName || "-"}
              </div>

              <div className="mu-detail-row">
                <b>Email:</b> {detailUser.email || "-"}
              </div>

              <div className="mu-detail-row">
                <b>Phone:</b> {detailUser.phoneNumber || "-"}
              </div>

              <div className="mu-detail-row">
                <b>Gender:</b> {detailUser.gender || "-"}
              </div>

              <div className="mu-detail-row">
                <b>City:</b> {detailUser.city || "-"}
              </div>

              <div className="mu-detail-row">
                <b>Status:</b> {detailUser.profileStatus || "active"}
              </div>

              <div className="mu-detail-row">
                <b>Membership:</b> {detailUser.membership || "Free"}
              </div>

              <div className="mu-notes">
                Extra notes or description can go here
              </div>
            </div>
            <div className="mu-modal-footer">
              <button className="btn" onClick={closeDetail}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRM MODAL ================= */}
      {confirm.open && (
        <div className="mu-modal-backdrop">
          <div className="mu-modal">
            <div className="mu-modal-header">
              <h3>Confirm Delete</h3>
            </div>

            <div className="mu-modal-body">
              Are you sure you want to delete{" "}
              <b>
                {confirm.user?.firstName || "-"}{" "}
                {confirm.user?.lastName || "-"}
              </b>
              ?
            </div>

            <div className="mu-modal-footer">
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(getUserId(confirm.user))}
              >
                Yes Delete
              </button>

              <button
                className="btn"
                onClick={() => setConfirm({ open: false, user: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
