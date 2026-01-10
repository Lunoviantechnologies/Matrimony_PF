import React from "react";
import "../styleSheets/chatWindow.css";

const categories = [
    "ABUSE",
    "SPAM",
    "FAKE_PROFILE",
    "INAPPROPRIATE_MESSAGES",
    "HARASSMENT",
    "OTHER"
];

const ReportUserModal = ({ show, onClose, reason, setReason, category, setCategory, onSubmit }) => {
    if (!show) return null;

    return (
        <div className="modal-backdrop-custom" onClick={onClose}>
            <div
                className="report-modal"
                onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
            >
                <h3>Report User</h3>

                {/* Category Dropdown */}
                <select
                    className="report-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                        <option key={c} value={c}>
                            {c.replace(/_/g, " ")}
                        </option>
                    ))}
                </select>

                <textarea
                    placeholder="Why are you reporting this user?"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    maxLength={300}
                />

                <div className="char-count">{reason.length}/300</div>

                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button>

                    <button className="submit-btn" onClick={onSubmit}>
                        Submit Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportUserModal;