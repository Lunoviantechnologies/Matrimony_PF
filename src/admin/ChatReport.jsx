import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import ChatReportModal from "./ChatReportModal";
import { toast } from "react-toastify";

const PAGE_SIZE = 10;

const ChatReport = () => {
    const [chatReport, setChatReport] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);

    const [activeTab, setActiveTab] = useState("PENDING");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = () => {
        api
            .get("/admin/reports/GetAll")
            .then((res) => setChatReport(res.data))
            .catch((err) => console.error(err));
    };

    console.log("chat report: ", chatReport);

    const pendingReports = chatReport.filter((r) => r.status === "PENDING");
    const bannedReports = chatReport.filter( (r) => r.status === "APPROVED" || r.status === "BANNED" );
    const rejectedReports = chatReport.filter((r) => r.status === "REJECTED");

    const activeData =
        activeTab === "PENDING"
            ? pendingReports
            : activeTab === "BANNED"
                ? bannedReports
                : rejectedReports;

    const totalPages = Math.max(1, Math.ceil(activeData.length / PAGE_SIZE));
    const paginatedData = activeData.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const handleApprove = async (reportedUserId, reason) => {
        const adminReason = prompt("Enter reason for banning the user:");
        console.log("Reported User ID:", reportedUserId, "Reason:", reason);
        if (!adminReason) {
            toast.error("Approval cancelled: Admin reason is required");
            return;
        }

        try {
            await api.put(`/admin/banuser/${reportedUserId}`, {
                reason: reason,
                adminComment: adminReason,
            });

            toast.success("Report approved");
            fetchReports();
        } catch (error) {
            console.error(error);
            toast.error("Approval failed");
        }
    };

    const handleReject = (id) => {
        api
            .put(`/admin/reports/${id}/reject`)
            .then(() => {
                toast.success("Report rejected");
                fetchReports();
            })
            .catch((err) => {
                console.error(err);
                toast.error("Rejection failed");
            });
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    console.log("selected chat: ", selectedReport);

    return (
        <div className="container mt-4">
            <h2 className="fw-bold mb-3">User Chat Report</h2>

            {/* Toggle Buttons */}
            <div className="mb-3 d-flex gap-2 justify-content-center">
                <button
                    className={`btn ${activeTab === "PENDING" ? "btn-warning" : "btn-outline-warning"
                        }`}
                    onClick={() => setActiveTab("PENDING")}
                >
                    Pending
                </button>

                <button
                    className={`btn ${activeTab === "BANNED" ? "btn-danger" : "btn-outline-danger"}`}
                    onClick={() => setActiveTab("BANNED")}
                >
                    Banned / Approved
                </button>

                <button
                    className={`btn ${activeTab === "REJECTED" ? "btn-info" : "btn-outline-info"}`}
                    onClick={() => setActiveTab("REJECTED")}
                >
                    Rejected
                </button>
            </div>

            {/* Table */}
            <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle text-center">
                    <thead>
                        <tr>
                            <th style={{ backgroundColor: "#00695C", color: "white", textAlign: "center" }}> S.No </th>
                            <th style={{ backgroundColor: "#00695C", color: "white", textAlign: "center" }}> Reason </th>
                            <th style={{ backgroundColor: "#00695C", color: "white", textAlign: "center" }}> Description </th>
                            <th style={{ backgroundColor: "#00695C", color: "white", textAlign: "center" }}> Reported User </th>
                            <th style={{ backgroundColor: "#00695C", color: "white", textAlign: "center" }}> Reporter </th>
                            <th style={{ backgroundColor: "#00695C", color: "white", textAlign: "center" }}> Status </th>
                            <th style={{ backgroundColor: "#00695C", color: "white", textAlign: "center" }}> Reported At </th>
                            <th style={{ backgroundColor: "#00695C", color: "white", textAlign: "center" }}> Chat </th>
                            <th style={{ backgroundColor: "#00695C", color: "white", textAlign: "center" }}> Admin Comment </th>
                            {activeTab === "PENDING" && (
                                <th style={{ backgroundColor: "#00695C", color: "white", textAlign: "center" }}>
                                    Action
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={activeTab === "PENDING" ? 10 : 9}>
                                    No records found.
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((item, index) => (
                                <tr key={item.id}>
                                    <td>
                                        {(currentPage - 1) * PAGE_SIZE + index + 1}
                                    </td>
                                    <td className="text-danger fw-semibold">{item.reason}</td>
                                    <td>{item.description}</td>

                                    <td>
                                        {item?.reportedUserName || "N/A"}
                                        <br />
                                        <small className="text-muted">
                                            id: {item?.reportedUserId || "-"}
                                        </small>
                                    </td>

                                    <td>
                                        {item?.reporterName || "N/A"}
                                        <br />
                                        <small className="text-muted">
                                            id: {item?.reporterId || "-"}
                                        </small>
                                    </td>

                                    <td>
                                        <span
                                            className={`badge ${item.status === "PENDING"
                                                ? "bg-warning text-dark"
                                                : item.status === "APPROVED"
                                                    ? "bg-success"
                                                    : item.status === "REJECTED"
                                                        ? "bg-info"
                                                        : "bg-danger"
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>

                                    <td>
                                        {new Date(item.reportedAt).toLocaleString()}
                                    </td>

                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            data-bs-toggle="modal"
                                            data-bs-target="#viewModal"
                                            onClick={() => setSelectedReport(item)}
                                        >
                                            View
                                        </button>
                                    </td>

                                    <td>{item.adminComment || "-"}</td>

                                    {activeTab === "PENDING" && (
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-success me-2"
                                                onClick={() =>
                                                    item.reportedUser?.id &&  handleApprove(item.reportedUser.id, item.reason)
                                                }
                                            >
                                                Approve
                                            </button>

                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleReject(item.id)}
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                        className="page-link"
                        onClick={() => setCurrentPage((p) => p - 1)}
                    >
                        Prev
                    </button>
                </li>

                <li className="page-item active">
                    <span className="page-link">{currentPage}</span>
                </li>

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button
                        className="page-link"
                        onClick={() => setCurrentPage((p) => p + 1)}
                    >
                        Next
                    </button>
                </li>
            </ul>

            {/* Modal */}
            <ChatReportModal report={selectedReport} />
        </div>
    );
};

export default ChatReport;