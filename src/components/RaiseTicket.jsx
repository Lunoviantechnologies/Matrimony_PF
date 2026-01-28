import React, { useState } from "react";
import "../styleSheets/raiseTicket.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../api/axiosInstance";

const RaiseTicket = () => {
  const { id, email } = useSelector(state => state.auth);

  const [form, setForm] = useState({
    category: "",
    name: "",
    email: email,
    phone: "",
    message: "",
    memberId: id,
  });

  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Profile Request Issue",
    "Premium Membership",
    "Login / Account Recovery",
    "Report Fake / Fraud Profile",
    "Payment Issue",
    "Profile Privacy & Safety",
    "Matchmaking Assistance",
    "Other Queries"
  ];

  const categoryMap = {
    "Profile Request Issue": "Profile_Request_Issue",
    "Premium Membership": "Premium_Membership",
    "Login / Account Recovery": "Login_Account_Recovery",
    "Report Fake / Fraud Profile": "Report_Fraud_Profile",
    "Payment Issue": "Payment_Issue",
    "Profile Privacy & Safety": "Profile_Privacy_Safety",
    "Matchmaking Assistance": "Matchmaking_Assistance",
    "Other Queries": "OTHER"
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (form.category === "Payment Issue") {
        const formData = new FormData();
        formData.append("issueCategory", "Payment_Issue");
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("phoneNumber", form.phone);
        formData.append("description", form.message);
        formData.append("memberId", form.memberId);

        attachments.forEach(file =>
          formData.append("attachments", file)
        );

        await api.post("/tickets", formData);
      } else {
        await api.post("/tickets", {
          issueCategory: categoryMap[form.category] || "OTHER",
          name: form.name,
          email: form.email,
          phoneNumber: form.phone,
          description: form.message,
          memberId: form.memberId
        });
      }

      toast.success("Ticket raised successfully");

      setForm({
        category: "",
        name: "",
        email: email,
        phone: "",
        message: "",
        memberId: id,
      });
      setAttachments([]);

    } catch (err) {
      console.error(err);
      toast.error("Ticket raise failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ticket-container">
      <div className="ticket-card">
        <h2 className="ticket-title">Raise Support Ticket</h2>
        <p className="ticket-subtitle">
          Our team is here to help you find love without worries.
        </p>

        <form onSubmit={handleSubmit}>

          <label>Issue Category *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select an issue</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <label>Your Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Registered Email *</label>
          <input type="email" value={form.email} disabled />

          <label>Phone Number *</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <label>VivahJeevan Member ID</label>
          <input type="text" value={form.memberId} disabled />

          <label>Describe the Issue *</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
          />

          {/* ✅ PHOTO UPLOAD COMPONENT (ACTUALLY ADDED) */}
          <div className="upload-section">
            <label>
              Upload Payment Proof (Screenshots / Photos)
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              disabled={form.category !== "Payment Issue"}
              onChange={handleFileChange}
            />

            <small>
              Enabled only when <b>Payment Issue</b> is selected
            </small>
          </div>

          <button type="submit" className="ticket-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default RaiseTicket;