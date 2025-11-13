import React from "react";
import "../styleSheets/contactUs.css";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaTwitter, FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";

const ContactUs = () => {
  return (
    <div className="contact-container">
      {/* Banner Section */}
      <section className="contact-banner">
        <div className="banner-overlay">
          <h1>CONTACT US</h1>
          <p>
            We’d love to help you find your perfect match. Reach out to start your journey today.
          </p>
        </div> 
      </section>

      {/* Main Content */}
      <section className="contact-content">
        {/* Left: Form */}
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form>
            <label>Name</label>
            <input type="text" placeholder="Enter your name" required />

            <label>Email</label>
            <input type="email" placeholder="Enter your email" required />

            <label>Phone Number</label>
            <input type="tel" placeholder="Enter your phone number" required />

            <label>Message</label>
            <textarea placeholder="Type your message..." rows="4" required></textarea>

            <button type="submit">Send Message</button>
          </form>
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

          {/* Social Links Section */}
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
