import React from "react";

const ChatReportModal = ({ report }) => {

    if (!report) return null;

    return (
        <div className="modal fade" id="viewModal" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">

                    <div className="modal-header bg-primary">
                        <h5 className="modal-title text-white">Chat Report Details</h5>
                        <button className="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div className="modal-body">
                        <p className="fw-bold">Chat Content</p>
                        <div className="border p-3 rounded bg-light">
                            {report.chatMessage || "Chat data not available"}
                        </div>
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