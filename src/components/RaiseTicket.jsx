import React, { useState } from "react";
import "./RaiseTicket.css";

const RaiseTicket = () => {
  const [form, setForm] = useState({
    category: "",
    name: "",
    email: "",
    phone: "",
    message: "",
    memberId: "",
  });

  const categories = [
    "Profile Approval Issue",
    "Premium Membership",
    "Login / Account Recovery",
    "Report Fake / Fraud Profile",
    "Payment Issue",
    "Profile Privacy & Safety",
    "Matchmaking Assistance",
    "Other Queries"
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted successfully! (Frontend only)");
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

          <button type="submit" className="ticket-btn">
            Submit Ticket
          </button>
        </form>
      </div>
    </div>
  );
};

export default RaiseTicket;
