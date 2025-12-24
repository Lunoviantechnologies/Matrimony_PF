import React, { useState } from "react";
import axios from "axios";
import "../styleSheets/contactUs.css";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaTwitter, FaFacebookF, FaLinkedinIn, FaInstagram, } from "react-icons/fa";
import backendIP from "../api/api";
import { toast } from "react-toastify";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");

    const payload = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phone,
      message: formData.message,

      // Also keep these if backend uses them in future
      // fullName: formData.name,
      // phoneNumber: formData.phone,
      // description: formData.message,
    };

    console.log("Sending payload:", payload);

    try {
      const res = await axios.post(`${backendIP}/contact/send`, payload,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Response:", res.data);
      setStatus("✅ Message sent successfully");
      toast.success("Message sent successfully");

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      toast.error("Message sent failed");
      setError(err.response?.data?.message || "Something went wrong");
    }
  };


  return (
    <div className="contact-container">
      {/* Banner Section */}
      <section className="contact-banner">
        <div className="banner-overlay">
          <h1>CONTACT US</h1>
          <p>
            We’d love to help you find your perfect match. Reach out to start
            your journey today.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="contact-content">
        {/* Left: Form */}
        <div className="contact-form">
          <h2>Send Us a Message</h2>

          <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Phone Number</label>
            <input
              type="number"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <label>Message</label>
            <textarea
              name="message"
              placeholder="Type your message..."
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit">Send Message</button>
          </form>

          {/* Success Message */}
          {status && <p style={{ color: "green", marginTop: "10px" }}>{status}</p>}

          {/* Error Message */}
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </div>

        {/* Right: Contact Details */}
        <div className="contact-details">
          <h2>Get in Touch</h2>
          <p className="company-name">SaathJanam Matrimony</p>

          <div className="detail-item">
            <FaMapMarkerAlt className="icon" />
            <span>123 Love Street, Hyderabad, India</span>
          </div>

          <div className="detail-item">
            <FaEnvelope className="icon" />
            <span>support@saathjanam.com</span>
          </div>

          <div className="detail-item">
            <FaPhoneAlt className="icon" />
            <span>+91 98765 43210</span>
          </div>

          {/* Social Links */}
          <div className="social-section">
            <h3>Connect With Us</h3>
            <ul className="social-list">
              <li>
                <FaEnvelope className="social-icon email" />
                <a href="mailto:support@saathjanam.com">support@saathjanam.com</a>
              </li>
              <li>
                <FaTwitter className="social-icon twitter" />
                <a href="#">Twitter</a>
              </li>
              <li>
                <FaFacebookF className="social-icon facebook" />
                <a href="#">Facebook</a>
              </li>
              <li>
                <FaLinkedinIn className="social-icon linkedin" />
                <a href="#">LinkedIn</a>
              </li>
              <li>
                <FaInstagram className="social-icon instagram" />
                <a href="#">Instagram</a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
