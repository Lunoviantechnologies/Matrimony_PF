import React, { useEffect, useMemo, useState } from "react";
import "../styleSheets/ManageUsers.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchAdminProfiles } from "../redux/thunk/profileThunk";
import { toast } from "react-toastify";
import api from "../api/axiosInstance";

export default function ManageUser({ pageSize = 10 }) {
  const dispatch = useDispatch();
  const { token, role } = useSelector((state) => state.auth);
  const { profiles, loading } = useSelector((state) => state.profiles);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [detailUser, setDetailUser] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, user: null });
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (role[0].toUpperCase() === "ADMIN") {
      dispatch(fetchAdminProfiles());
    };
  }, [dispatch, role]);
  console.log("profiles :", profiles);

  const getUserId = (u) => u?.userId || u?.id || u?.profileId;

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/delete/${id}`);

      toast.success("User deleted successfully");
      dispatch(fetchAdminProfiles());
      setDetailUser(false);
      setConfirm({ open: false, user: null });
    } catch (error) {
      console.error("Delete failed:", error.response?.data || error.message);
      toast.error("Delete failed");
    }
  };

  const filteredUsers = useMemo(() => {
    const safeSearch = String(search || "").toLowerCase();

    return profiles.filter((u) => {
      const name = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
      const matchSearch = name.includes(safeSearch);
      const matchStatus = statusFilter ? u.profileStatus === statusFilter : true;
      return matchSearch && matchStatus;
    });
  }, [profiles, search, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const openDetail = (user) => setDetailUser(user);
  const closeDetail = () => setDetailUser(null);

  // ------------------------------
  // NUMERIC PAGINATION BUTTONS
  // ------------------------------
  const PaginationButtons = () => {
    let buttons = [];

    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          className={`pg-btn ${page === i ? "active" : ""}`}
          onClick={() => setPage(i)}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="manage-users-root">
      {/* HEADER */}
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

      {/* TABLE */}
      <div className="mu-table-wrap">
        <table className="mu-table">
          <thead>
            <tr>
              <th>Thumbnail</th>
              <th>User</th>
              <th>Age</th>
              <th>City</th>
              <th>Membership</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="mu-loading">
                  Loading users...
                </td>
              </tr>
            ) : paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="mu-empty">
                  No users found
                </td>
              </tr>
            ) : (
              paginatedUsers.map((u, index) => {
                const initials = `${(u.firstName || "U").charAt(0)}${(u.lastName || "").charAt(0)}`.toUpperCase();

                return (
                  <tr
                    key={getUserId(u) || index}
                    className={u.active !== true ? "mu-row-muted" : ""}
                  >
                    <td>
                      <div className="mu-avatar">{initials}</div>
                    </td>

                    <td onClick={() => openDetail(u)}>
                      <div className="mu-user-cell">
                        <div>
                          <div className="mu-name">
                            {u.firstName} {u.lastName}
                          </div>
                          <div className="mu-id">ID: {getUserId(u) || "N/A"}</div>
                        </div>
                      </div>
                    </td>

                    <td>{u.age || "-"}</td>
                    <td>{u.city || "-"}</td>

                    <td>
                      <span className={`mu-badge ${u.premium ? "premium" : "" }`}>
                        {u.premium ? "Premium" : "Free"}
                      </span>
                    </td>

                    <td>
                      <span className={`mu-status ${u.active || "active"}`}>
                        {u.active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="mu-actions">
                      <button className="btn btn-small" onClick={() => openDetail(u)}>
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
              })
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER + PAGINATION */}
      <div className="mu-footer">
        <span className="mu-rows-info">
          Showing {paginatedUsers.length} of {filteredUsers.length} users
        </span>

        <div className="mu-pagination">
          <button
            className="pg-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>

          {PaginationButtons()}

          <button
            className="pg-btn"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* MODALS (DETAIL + CONFIRM DELETE) */}
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
                <b>Name:</b> {detailUser.firstName} {detailUser.lastName}
              </div>
              <div className="mu-detail-row">
                <b>Email:</b> {detailUser.emailId}
              </div>
              <div className="mu-detail-row">
                <b>Phone:</b> {detailUser.mobileNumber}
              </div>
              <div className="mu-detail-row">
                <b>Gender:</b> {detailUser.gender}
              </div>
              <div className="mu-detail-row">
                <b>City:</b> {detailUser.city}
              </div>
              <div className="mu-detail-row">
                <b>Status:</b> {detailUser.active ? "Active" : "Inactive"}
              </div>
              <div className="mu-detail-row">
                <b>Membership:</b> {detailUser.premium ? "Premium" : "Free"}
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

      {confirm.open && (
        <div className="mu-modal-backdrop">
          <div className="mu-modal">
            <div className="mu-modal-header">
              <h3>Confirm Delete</h3>
            </div>

            <div className="mu-modal-body">
              Are you sure you want to delete{" "}
              <b>
                {confirm.user?.firstName} {confirm.user?.lastName}
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
