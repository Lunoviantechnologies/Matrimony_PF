import React, { useEffect, useState } from "react";
import axios from "axios";
import backendIP from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfiles } from "../redux/thunk/profileThunk";

export default function AdminApprovals() {
  const dispatch = useDispatch();
  const { profiles = [], loading } = useSelector((state) => state.profiles);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Local UI state for only pending profiles
  const [visibleProfiles, setVisibleProfiles] = useState([]);

  // Fetch profiles on mount
  useEffect(() => {
    dispatch(fetchUserProfiles());
  }, [dispatch]);

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

      await axios.post(`${backendIP}/admin/profiles/approve/${userId}`);

      alert("User profile approved successfully!");
      dispatch(fetchUserProfiles());
    } catch (error) {
      console.error("Approve error:", error);
      alert("Approval failed!");
      dispatch(fetchUserProfiles());
    }
  };

  // Reject
  const handleActionReject = async (userId) => {
    try {
      setVisibleProfiles((prev) => prev.filter((u) => u.id !== userId));

      await axios.post(`${backendIP}/admin/profiles/reject/${userId}`);

      alert("User profile rejected successfully!");
      dispatch(fetchUserProfiles());
    } catch (error) {
      console.error("Reject error:", error);
      alert("Rejection failed!");
      dispatch(fetchUserProfiles());
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
      <h2 className="fw-bold mb-3" style={{color : "#00695C"}}>Admin Approvals</h2>

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
          {loading && (
            <tr>
              <td colSpan="7" className="text-center">Loading...</td>
            </tr>
          )}

          {!loading && paginatedData.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">No approvals pending</td>
            </tr>
          )}

          {!loading && paginatedData.map((u, index) => (
            <tr key={u.id} className="text-center">
              <td>{(page - 1) * pageSize + index + 1}</td>
              <td>{u.id}</td>
              <td>{u.firstName}</td>
              <td>{u.aboutYourself || "-"}</td>
              <td>{u.documentUrl ? <a href={u.documentUrl} target="_blank" rel="noreferrer">View</a> : "No Document"}</td>
              <td>{u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}</td>
              <td>
                <button className="btn btn-success btn-sm me-2" onClick={() => handleActionApproved(u.id)}>Approve</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleActionReject(u.id)}>Reject</button>
              </td>
            </tr>
          ))}
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
}
