import React, { useEffect, useState } from "react";
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

  const [loading, setLoading] = useState(false);

  // ✅ UI Categories (user friendly)
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

  // ✅ Backend Enum Mapping
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ✅ Convert UI selection to backend Enum
    const payload = {
      issueCategory: categoryMap[form.category] || "OTHER",
      name: form.name,
      email: form.email,
      phoneNumber: form.phone,
      description: form.message,
      memberId: form.memberId
    };

    console.log("Sending fixed payload:", payload);

    try {
      await api.post(`/tickets`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      }
      );

      toast.success("Ticket raised successfully");

      // ✅ Reset form after success
      setForm({
        category: "",
        name: "",
        email: "",
        phone: "",
        message: "",
        memberId: "",
      });

    } catch (error) {
      console.log("Backend error:", error.response?.data);
      toast.error("Ticket raised Failed");
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
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <label>Your Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Registered Email *</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            disabled
            onChange={handleChange}
            required
          />

          <label>Phone Number *</label>
          <input
            type="text"
            name="phone"
            placeholder="Enter your phone number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <label>SaathJanam Member ID (Optional)</label>
          <input
            type="text"
            name="memberId"
            disabled
            placeholder="Example: SJ123456"
            value={form.memberId}
            onChange={handleChange}
          />

          <label>Describe the Issue *</label>
          <textarea
            name="message"
            placeholder="Tell us what went wrong..."
            value={form.message}
            onChange={handleChange}
            required
          />

          <button type="submit" className="ticket-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RaiseTicket;
