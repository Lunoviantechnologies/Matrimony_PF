import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProfiles } from "../redux/thunk/profileThunk";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";

export default function AdminApprovals() {
  const dispatch = useDispatch();
  const { role } = useSelector(state => state.auth);
  const { adminProfiles = [], totalPages = 1, adminloading } = useSelector((state) => state.profiles);

  const [actionLoading, setActionLoading] = useState({ id: null, type: null, });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Fetch profiles on mount
  useEffect(() => {
    if (role?.[0]?.toUpperCase() === "ADMIN") {
      dispatch(
        fetchAdminProfiles({ page: page - 1, size: pageSize, accountStatus: "PENDING VERIFICATION" })
      );
    }
  }, [dispatch, role, page]);

  // Approve
  const handleActionApproved = async (userId) => {
    console.log("approving userId :", typeof userId);
    try {
      setActionLoading({ id: userId, type: "approve" });
      await api.post(`/admin/profiles/approve/${userId}`);

      toast.success("User profile approved successfully!");
      dispatch(fetchAdminProfiles({ page: page - 1, size: pageSize, accountStatus: "PENDING VERIFICATION" }));
    } catch (error) {
      toast.error("Approval failed!");
    } finally {
      setActionLoading({ id: null, type: null });
    };
  };

  // Reject
  const handleActionReject = async (userId) => {
    try {
      setActionLoading({ id: userId, type: "reject" });
      await api.post(`/admin/profiles/reject/${userId}`);
      toast.success("User profile rejected successfully!");
      dispatch(fetchAdminProfiles({ page: page - 1, size: pageSize, accountStatus: "PENDING VERIFICATION" }));
    } catch (error) {
      toast.error("Rejection failed!");
    } finally {
      setActionLoading({ id: null, type: null });
    };
  };

  const openDocument = async (fileName) => {
    const res = await api.get(`/profiles/view-document/${fileName}`, {
      responseType: "blob",
    });

    const fileURL = URL.createObjectURL(res.data);
    window.open(fileURL, "_blank");
  };

  // Pagination
  const totalPagesCount = totalPages || 1;
  const paginatedData = adminProfiles;

  useEffect(() => {
    if (page > totalPagesCount) {
      setPage(totalPagesCount);
    }
  }, [totalPagesCount, page]);

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-3" style={{ color: "#00695C" }}>Admin Approvals</h2>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th className="approveHeader text-center">S.No</th>
            <th className="approveHeader text-center">User ID</th>
            <th className="approveHeader text-center">User</th>
            <th className="approveHeader text-center">Phone Number</th>
            <th className="approveHeader text-center">Email</th>
            <th className="approveHeader text-center">Date Of Birth</th>
            <th className="approveHeader text-center">Document</th>
            <th className="approveHeader text-center">Requested On</th>
            <th className="approveHeader text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {!adminloading && paginatedData.map((u, index) => {
            return (
              <tr key={u.id} className="text-center">
                <td>{(page - 1) * pageSize + index + 1}</td>
                <td>{u.id}</td>
                <td>{u.firstName + " " + u.lastName}</td>
                <td>{u.mobileNumber || "-"}</td>
                <td>{u.emailId || "-"}</td>
                <td>{u.dateOfBirth || "-"}</td>
                <td>
                  {u.documentFile ? (
                    <button className="btn btn-outline-primary" onClick={() => openDocument(u.documentFile)}>
                      View
                    </button>
                  ) : "No Document"}
                </td>

                <td>{u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}</td>
                
                <td>
                  <button
                    className="btn btn-success btn-sm me-2"
                    disabled={actionLoading.id === u.id && actionLoading.type === "approve"}
                    onClick={() => handleActionApproved(u.id)}
                  >
                    {actionLoading.id === u.id && actionLoading.type === "approve"
                      ? "Processing..."
                      : "Approve"}
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    disabled={actionLoading.id === u.id && actionLoading.type === "reject"}
                    onClick={() => handleActionReject(u.id)}
                  >
                    {actionLoading.id === u.id && actionLoading.type === "reject"
                      ? "Processing..."
                      : "Reject"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <span className="text-muted">
          Page {page} of {totalPages}
        </span>

        <div className="mu-pagination mt-3">
          <button
            className="pagination_btn"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>

          <span className="mm-page-number">{page}</span>

          <button
            className="pagination_btn"
            disabled={page === totalPagesCount}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};