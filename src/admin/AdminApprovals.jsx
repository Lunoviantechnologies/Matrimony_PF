import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProfiles } from "../redux/thunk/profileThunk";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";
import backendIP from "../api/api";

export default function AdminApprovals() {
  const dispatch = useDispatch();
  const { role } = useSelector(state => state.auth);
  const { profiles = [], loading } = useSelector((state) => state.profiles);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Local UI state for only pending profiles
  const [visibleProfiles, setVisibleProfiles] = useState([]);

  // Fetch profiles on mount
  useEffect(() => {
    if (role[0].toUpperCase() === "ADMIN") {
      dispatch(fetchAdminProfiles());
    };
  }, [dispatch, role]);

  // Filter pending profiles
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

  // Approve
  const handleActionApproved = async (userId) => {
    console.log("approving userId :", typeof userId);
    try {
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

  // Reject
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

  // Pagination
  const totalPages = Math.max(1, Math.ceil(visibleProfiles.length / pageSize));
  const paginatedData = visibleProfiles.slice((page - 1) * pageSize, page * pageSize);

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };
  console.log("statuss : ", visibleProfiles);
  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-3" style={{ color: "#00695C" }}>Admin Approvals</h2>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th className="approveHeader text-center">S.No</th>
            <th className="approveHeader text-center">User ID</th>
            <th className="approveHeader text-center">User</th>
            <th className="approveHeader text-center">Bio</th>
            <th className="approveHeader text-center">Document</th>
            <th className="approveHeader text-center">Requested On</th>
            <th className="approveHeader text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {!loading && paginatedData.map((u, index) => {
            return (
              <tr key={u.id} className="text-center">
                <td>{(page - 1) * pageSize + index + 1}</td>
                <td>{u.id}</td>
                <td>{u.firstName}</td>
                <td>{u.aboutYourself || "-"}</td>

                <td>
                  {u.documentFile ? (
                    <a
                      href={`${backendIP}/admin/document/${u.documentFile}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  ) : "No Document"}
                </td>

                <td>{u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}</td>
                <td>
                  <button className="btn btn-success btn-sm me-2" onClick={() => handleActionApproved(u.id)}>Approve</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleActionReject(u.id)}>Reject</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <span className="text-muted">
          Showing {visibleProfiles.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, visibleProfiles.length)} of {visibleProfiles.length}
        </span>

        <ul className="pagination mb-0">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => changePage(page - 1)}>Prev</button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
            <li key={num} className={`page-item ${page === num ? "active" : ""}`}>
              <button className="page-link" onClick={() => changePage(num)}>{num}</button>
            </li>
          ))}
          <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => changePage(page + 1)}>Next</button>
          </li>
        </ul>
      </div>
    </div>
  );
};