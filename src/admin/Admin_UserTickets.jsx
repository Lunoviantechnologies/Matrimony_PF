import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { toast } from "react-toastify"; 

export default function Admin_UserTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitBug = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${backendIP}/admin/bugs/report`, form, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Bug reported successfully");

      setForm({
        reportedBy: "Admin",
        title: "",
        severity: "MEDIUM",
        description: "",
      });
    } catch (err) {
      toast.error("Request blocked by backend (403)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-support-page">
      <div className="admin-support-container">
        {/* Header INSIDE container */}
        <div className="admin-support-header">
          <h2>Admin Support</h2>
          <p>Report application issues to the development team</p>
        </div>

        <form onSubmit={submitBug} className="admin-support-form">
          <div className="form-group">
            <label>Reported By</label>
            <input
              type="text"
              name="reportedBy"
              value={form.reportedBy}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Bug Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Short summary"
            />
          </div>

          <div className="form-group">
            <label>Severity</label>
            <select
              name="severity"
              value={form.severity}
              onChange={handleChange}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              rows="4"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Explain the issue clearly"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Bug"}
          </button>
        </form>
      </div>
    </div>
  );
}
