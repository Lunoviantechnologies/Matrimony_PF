import React, { useEffect, useState } from "react";
import axios from "axios";
import backendIP from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfiles } from "../redux/thunk/profileThunk";

export default function AdminApprovals() {
  const { profiles : pending, loading } = useSelector((state) => state.profiles);
  const dispatch = useDispatch();

  // Pagination states
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    dispatch(fetchUserProfiles());
  }, [dispatch]);
  // console.log("profiles : ", profiles);

const handleActionApproved = async (userId) => {
  console.log(userId)
  try {
    await axios.post(`${backendIP}/admin/profiles/${userId}/approve`, {
      userId,
      status: "Approved"
    });
    alert("approve");
  } catch (error) {
    console.error(error.response || error);
    alert("Approval failed!");
  }
  fetchPendingApprovals();
};

const handleActionReject = async (userId) => {
  try {
    await axios.post(`${backendIP}/admin/profiles/${userId}/reject`, {
      userId,
      status: "Rejected"
    });
    alert("Rejection success!");
  } catch (error) {
    console.error(error.response || error);
    alert("Rejection failed!");
  }
  fetchPendingApprovals();
};

  // Pagination logic
  const totalPages = Math.ceil(pending.length / pageSize) || 1;
  const paginatedData = pending.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold">Admin Approvals</h2>

      <table className="table table-bordered table-striped mt-3">
        <thead>
          <tr>
            <th className="text-center">S.No</th>
            <th className="text-center">User ID</th>
            <th className="text-center">User</th>
            <th className="text-center">Bio/Profile</th>
            <th className="text-center">Document</th>
            <th className="text-center">Requested On</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          { loading ? (
              <p>Loading...</p>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No approvals pending
                </td>
              </tr>
            ) : (
              paginatedData.map((u, i) => (
                <tr key={u.id} className="text-center">
                  <td>{(page - 1) * pageSize + i + 1}</td>
                  <td>{u.id}</td>
                  <td>{u.firstName}</td>
                  <td>{u.aboutYourself}</td>

                  <td>
                    {u.documentUrl ? (
                      <a href={u.documentUrl} target="_blank" rel="noreferrer">
                        View Document
                      </a>
                    ) : (
                      "No Document"
                    )}
                  </td>

                  <td>{new Date(u.createdAt).toLocaleString()}</td>

                  <td>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleActionApproved(u.id, "Approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleActionReject(u.id, "Rejected")}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )
          }
        </tbody>
      </table>

      {/* PAGINATION CONTROL */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <span className="text-muted">
          Showing {(page - 1) * pageSize + 1}–
          {Math.min(page * pageSize, pending.length)} of {pending.length}
        </span>

        <nav>
          <ul className="pagination mb-0">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => changePage(page - 1)}>
                Prev
              </button>
            </li>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <li
                key={num}
                className={`page-item ${page === num ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => changePage(num)}>
                  {num}
                </button>
              </li>
            ))}

            <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => changePage(page + 1)}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
