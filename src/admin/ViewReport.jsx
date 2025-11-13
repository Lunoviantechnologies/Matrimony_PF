import React from "react";
import "../stylesheets/ViewReport.css";

import { FaUsers, FaHeart, FaRupeeSign, FaChartPie, FaChartLine, FaEnvelope, FaTwitter, FaFacebookF, FaLinkedinIn, FaInstagram,} from "react-icons/fa";

const ViewReport = () => {
  return (
    <div className="viewreport-container">
      {/* Banner Section */}
      <div className="banner">
        <div className="overlay">
          <h1>SaathJanam Matrimony Report - 2025</h1>
          <p>Bringing hearts together through love and trust 💞</p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="stats-grid">
        <div className="card pink">
          <FaUsers className="icon" />
          <h2>520</h2>
          <p>Free Members</p>
        </div>

        <div className="card green">
          <FaUsers className="icon" />
          <h2>230</h2>
          <p>Premium Members</p>
        </div>

        <div className="card yellow">
          <FaUsers className="icon" />
          <h2>85</h2>
          <p>Elite Members</p>
        </div>

        <div className="card blue">
          <FaRupeeSign className="icon" />
          <h2>₹85,000</h2>
          <p>Monthly Revenue</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-box">
          <FaChartLine className="chart-icon" />
          <h3>Monthly Growth</h3>
          <p>Track new joins & successful matches.</p>
        </div>
        <div className="chart-box">
          <FaChartPie className="chart-icon" />
          <h3>Gender Ratio</h3>
          <p>60% Male • 40% Female</p>
        </div>
        <div className="chart-box">
          <FaChartPie className="chart-icon" />
          <h3>Membership Plans</h3>
          <p>Free / Premium / Elite</p>
        </div>
      </div>

      {/* Engagement Summary */}
      <div className="summary">
        <h2>Overall Engagement Insights</h2>
        <ul>
          <li>✅ 85% Active Members</li>
          <li>💬 72% Response Rate</li>
          <li>📅 Avg 3 logins/day</li>
          <li>🌍 Top Cities: Hyderabad, Chennai, Mumbai</li>
        </ul>
      </div>

      {/* Contact Section */}
      <div className="contact-info">
        <h2>Get in Touch</h2>
        <p>Have questions or suggestions? Reach us anytime!</p>

        <div className="social-links">
          <a href="mailto:support@saathjanam.com">
            <FaEnvelope /> support@saathjanam.com
          </a>
          <a href="#">
            <FaTwitter /> Twitter
          </a>
          <a href="#">
            <FaFacebookF /> Facebook
          </a>
          <a href="#">
            <FaLinkedinIn /> LinkedIn
          </a>
          <a href="#">
            <FaInstagram /> Instagram
          </a>
        </div>
      </div>
    </div>
  );
};

export default ViewReport;
