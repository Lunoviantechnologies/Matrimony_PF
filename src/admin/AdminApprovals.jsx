import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProfiles } from "../redux/thunk/profileThunk";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";

export default function AdminApprovals() {
  const dispatch = useDispatch();

  const { role } = useSelector((state) => state.auth);
  const { profiles = [], loading } = useSelector((state) => state.profiles);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Only pending profiles shown to admin
  const [visibleProfiles, setVisibleProfiles] = useState([]);

  /* ---------------- FETCH PROFILES ---------------- */
  useEffect(() => {
    if (role?.[0]?.toUpperCase() === "ADMIN") {
      dispatch(fetchAdminProfiles());
    }
  }, [dispatch, role]);

  /* ---------------- FILTER PENDING ---------------- */
  useEffect(() => {
    const pendingOnly = profiles.filter((p) => {
      return (
        p.accountStatus?.toUpperCase() === "PENDING VERIFICATION" ||
        p.accountStatus === null ||
        p.accountStatus === undefined ||
        p.approved === false ||
        p.isApproved === false
      );
    });

    setVisibleProfiles(pendingOnly);
    setPage(1);
  }, [profiles]);

  /* ---------------- APPROVE ---------------- */
  const handleActionApproved = async (userId) => {
    try {
      // Optimistic UI
      setVisibleProfiles((prev) => prev.filter((u) => u.id !== userId));

      await api.post(`/admin/profiles/approve/${userId}`);

      toast.success("User profile approved successfully!");
      dispatch(fetchAdminProfiles());
    } catch (error) {
      console.error("Approve error:", error);
      toast.error("Approval failed!");
      dispatch(fetchAdminProfiles());
    }
  };

  /* ---------------- REJECT ---------------- */
  const handleActionReject = async (userId) => {
    try {
      setVisibleProfiles((prev) => prev.filter((u) => u.id !== userId));

      await api.post(`/admin/profiles/reject/${userId}`);

      toast.success("User profile rejected successfully!");
      dispatch(fetchAdminProfiles());
    } catch (error) {
      console.error("Reject error:", error);
      toast.error("Rejection failed!");
      dispatch(fetchAdminProfiles());
    }
  };

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.max(
    1,
    Math.ceil(visibleProfiles.length / pageSize)
  );

  const paginatedData = visibleProfiles.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-3" style={{ color: "#00695C" }}>
        Admin Approvals
      </h2>

      <table className="table table-bordered table-striped align-middle">
        <thead>
          <tr>
            <th className="text-center">S.No</th>
            <th className="text-center">User ID</th>
            <th className="text-center">User</th>
            <th className="text-center">Bio</th>
            <th className="text-center">Profile Photo</th>
            <th className="text-center">Requested On</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan="7" className="text-center">
                Loading...
              </td>
            </tr>
          )}

          {!loading && paginatedData.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">
                No approvals pending
              </td>
            </tr>
          )}

          {!loading &&
            paginatedData.map((u, index) => (
              <tr key={u.id} className="text-center">
                <td>{(page - 1) * pageSize + index + 1}</td>
                <td>{u.id}</td>
                <td>{u.firstName || "-"}</td>
                <td>{u.aboutYourself || "-"}</td>

                {/* PROFILE PHOTO */}
                <td>
                  {u.profilePhoto ? (
                    <img
                      src={u.profilePhoto}
                      alt="Profile"
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        cursor: "pointer",
                        border: "1px solid #ccc",
                      }}
                      onClick={() =>
                        window.open(u.profilePhoto, "_blank")
                      }
                    />
                  ) : (
                    <span className="text-muted">No Photo</span>
                  )}
                </td>

                <td>
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleString()
                    : "-"}
                </td>

                <td>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => handleActionApproved(u.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleActionReject(u.id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <span className="text-muted">
          Showing{" "}
          {visibleProfiles.length === 0
            ? 0
            : (page - 1) * pageSize + 1}
          –
          {Math.min(page * pageSize, visibleProfiles.length)} of{" "}
          {visibleProfiles.length}
        </span>

        <ul className="pagination mb-0">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => changePage(page - 1)}
            >
              Prev
            </button>
          </li>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (num) => (
              <li
                key={num}
                className={`page-item ${page === num ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => changePage(num)}
                >
                  {num}
                </button>
              </li>
            )
          )}

          <li
            className={`page-item ${
              page === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => changePage(page + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
