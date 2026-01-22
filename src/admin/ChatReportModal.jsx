import React, { useEffect, useRef, useState } from "react";
import api from "../api/axiosInstance";

const ChatReportModal = ({ report }) => {

    const [chatData, setChatData] = useState(null);
    const [pageNo, setPage] = useState(0);
    const chatRef = useRef(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chatData]);

    useEffect(() => {
        if (report?.reporter && report?.reportedUser) {
            api.get(`/admin/conversation/${report.reporter.id}/${report.reportedUser.id}?page=${pageNo}&size=20`)
                .then(response => setChatData(response.data))
                .catch(error => console.error("Error fetching chat data:", error));
        }
    }, [report, pageNo]);

    console.log("Fetched chat data:", chatData);

    return (
        <div className="modal fade" id="viewModal" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">

                    <div className="modal-header bg-primary">
                        <h5 className="modal-title text-white">Chat Report Details</h5>
                        <button className="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div className="modal-body">
                        {!report ? (
                            <p className="text-muted text-center">Select a report to view</p>
                        ) : (
                            <>
                                <p className="fw-bold">Chat Content</p>
                                <div ref={chatRef} className="border p-3 rounded bg-light" style={{ maxHeight: "400px", overflowY: "auto" }}>

                                    {!chatData ? (
                                        <p className="text-center text-muted">Loading chat...</p>
                                    ) : chatData.content.length === 0 ? (
                                        <p className="text-center text-muted">No messages</p>
                                    ) : (
                                        [...chatData.content].reverse().map(msg => (
                                            <div
                                                key={msg.id}
                                                className={`d-flex mb-2 ${msg.senderId === report.reporter.id ? "justify-content-end" : "justify-content-start"}`}
                                            >
                                                <div
                                                    className={`p-2 rounded ${msg.senderId === report.reporter.id
                                                        ? "bg-primary text-white"
                                                        : "bg-secondary text-white"
                                                        }`}
                                                    style={{ maxWidth: "75%" }}
                                                >
                                                    <div>{msg.message}</div>
                                                    <small className="d-block text-end opacity-75">
                                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                                    </small>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="d-flex justify-content-between mt-2">

                                    <button
                                        className="btn btn-outline-primary btn-sm px-2 py-1"
                                        style={{ fontSize: "12px", width: "75px" }}
                                        disabled={pageNo === 0}
                                        onClick={() => setPage(pageNo - 1)}
                                    >
                                        ◀ Prev
                                    </button>

                                    <span style={{ fontSize: "12px" }} className="align-self-center text-muted">
                                        Page {pageNo + 1} / {chatData?.totalPages || 1}
                                    </span>

                                    <button
                                        className="btn btn-outline-primary btn-sm px-2 py-1"
                                        style={{ fontSize: "12px", width: "75px" }}
                                        disabled={chatData?.last}
                                        onClick={() => setPage(pageNo + 1)}
                                    >
                                        Next ▶
                                    </button>

                                </div>
                            </>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" data-bs-dismiss="modal">
                            Close
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ChatReportModal;