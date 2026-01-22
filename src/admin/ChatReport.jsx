import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import ChatReportModal from "./ChatReportModal";
import { toast } from "react-toastify";

const ChatReport = () => {

    const [chatReport, setChatReport] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = () => {
        api.get("/admin/reports/GetAll")
            .then(res => setChatReport(res.data))
            .catch(err => console.error(err));
    };

    const handleApprove = async (id) => {
        try {
            await api.delete(`/admin/delete-profile/${id}`, {status: "APPROVED"});

            setChatReport(prev =>
                prev.map(r =>
                    r.id === id ? { ...r, status: "APPROVED" } : r
                )
            );
            toast.success(`Report approved`);
        } catch (error) {
            console.error(error);
            toast.error("Approval failed");
        }
    };

    return (
        <div className="container mt-4">

            <h2 className="fw-bold mb-3">User Chat Report</h2>

            <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle text-center">
                    <thead>
                        <tr>
                            <th style={{backgroundColor: "#00695C", color: "white", textAlign: "center"}}>S.No</th>
                            <th style={{backgroundColor: "#00695C", color: "white", textAlign: "center"}}>Reason</th>
                            <th style={{backgroundColor: "#00695C", color: "white", textAlign: "center"}}>Description</th>
                            <th style={{backgroundColor: "#00695C", color: "white", textAlign: "center"}}>Reported User</th>
                            <th style={{backgroundColor: "#00695C", color: "white", textAlign: "center"}}>Reporter</th>
                            <th style={{backgroundColor: "#00695C", color: "white", textAlign: "center"}}>Status</th>
                            <th style={{backgroundColor: "#00695C", color: "white", textAlign: "center"}}>Reported At</th>
                            <th style={{backgroundColor: "#00695C", color: "white", textAlign: "center"}}>Chat</th>
                            <th style={{backgroundColor: "#00695C", color: "white", textAlign: "center"}}>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {chatReport.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td className="text-danger fw-semibold">{item.reason}</td>
                                <td>{item.description}</td>

                                <td>
                                    {item.reportedUser.firstName} {item.reportedUser.lastName}
                                    <br />
                                    <small className="text-muted">id: {item.reportedUser.id}</small>
                                </td>
                                <td>
                                    {item.reporter.firstName} {item.reporter.lastName}
                                    <br />
                                    <small className="text-muted">id: {item.reporter.id}</small>
                                </td>

                                <td>
                                    <span className={`badge ${item.status === "PENDING" ? "bg-warning text-dark"
                                            : item.status === "APPROVED" ? "bg-success"
                                                : "bg-danger"
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>

                                <td>{new Date(item.reportedAt).toLocaleString()}</td>

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

                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-success me-2"
                                        disabled={item.status !== "PENDING"}
                                        onClick={() => handleApprove(item.id)}
                                    >
                                        Approve
                                    </button>

                                    <button
                                        className="btn btn-sm btn-danger"
                                        disabled={item.status !== "PENDING"}
                                        onClick={() => handleReject(item.id)}
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Component */}
            <ChatReportModal report={selectedReport} />

        </div>
    );
};

export default ChatReport;