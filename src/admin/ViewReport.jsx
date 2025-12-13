import React, { useEffect, useState } from "react";
import "../stylesheets/ViewReport.css";
import { FaUsers, FaRupeeSign, FaChartPie, FaChartLine, FaEnvelope, FaTwitter, FaFacebookF, FaLinkedinIn, FaInstagram,} from "react-icons/fa";
import axios from "axios";
import backendIP from "../api/api";

const ViewReport = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch payments
  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendIP}/payment/successful`);
      const data = res.data || [];
      console.log("Fetched profiles:", data);

      // Convert backend → UI model
      const converted = data.map((p) => ({
        userId: p.userId,          // IMPORTANT FOR UNIQUE COUNT
        planCode: p.planCode,      
        amount: p.amount,          // paise
        status: p.status,
        name: p.name || "",
        city: p.city || "N/A",
        isActive: p.status === "SUCCESS",
        createdAt: new Date(p.createdAt),
      }));

      setProfiles(converted);

    } catch (error) {
      console.error("Error while loading profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Count plans
  const GOLD_3M = profiles.filter((p) => p.planCode === "GOLD_3").length;
  const GOLD_PLUS_3M = profiles.filter((p) => p.planCode === "GOLDPLUS_3").length;
  const DIAMOND_6M = profiles.filter((p) => p.planCode === "DIAMOND_6").length;
  const DIAMOND_PLUS_6M = profiles.filter((p) => p.planCode === "DIAMONDPLUS_6").length;
  const PLATINUM_12M = profiles.filter((p) => p.planCode === "PLATINUM_12").length;

  const revenue = profiles
  .reduce((sum, p) => sum + p.amount, 0).toFixed(2);

  const activeMembers = profiles.filter((p) => p.isActive).length;

  const topCities = ["Hyderabad", "Bangalore", "Mumbai"];
  console.log(profiles)

  return (
    <div className="viewreport-container">
      <div className="banner">
        <div className="overlay">
          <h1>SaathJanam Matrimony Report - 2025</h1>
          <p>Bringing hearts together through love and trust </p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="card pink">
          <FaUsers className="icon" />
          <h2>{loading ? "Loading..." : GOLD_3M}</h2>
          <p>Gold Members</p>
        </div>

        <div className="card green">
          <FaUsers className="icon" />
          <h2>{loading ? "Loading..." : GOLD_PLUS_3M}</h2>
          <p>Gold Plus Members</p>
        </div>

        <div className="card yellow">
          <FaUsers className="icon" />
          <h2>{loading ? "Loading..." :  DIAMOND_6M}</h2>
          <p>Diamond Members</p>
        </div>

        <div className="card green">
          <FaUsers className="icon" />
          <h2>{loading ? "Loading..." : DIAMOND_PLUS_6M}</h2>
          <p>Diamond Plus Members</p>
        </div>

        <div className="card yellow">
          <FaUsers className="icon" />
          <h2>{loading ? "Loading..." : PLATINUM_12M}</h2>
          <p>Platinum Members</p>
        </div>

        <div className="card blue">
          <FaRupeeSign className="icon" />
          <h2>{loading ? "Loading..." : `₹${revenue}`}</h2>
          <p>Total Revenue</p>
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

      {/* Summary */}
      <div className="summary">
        <h2>Overall Engagement Insights</h2>
        <ul>
          <li>✅ Active Members: {activeMembers}</li>
          <li>💬 72% Response Rate</li>
          <li>📅 Avg 3 logins/day</li>
          <li>🌍 Top Cities:</li>
          {topCities.map((city, i) => (
            <li key={i}>🏙 {city}</li>
          ))}
        </ul>
      </div>

      {/* Contact */}
      <div className="contact-info">
        <h2>Get in Touch</h2>
        <p>Have questions or suggestions? Reach us anytime!</p>
        <div className="social-links">
          <a href="mailto:support@saathjanam.com">
            <FaEnvelope /> support@saathjanam.com
          </a>
          <a href="#"><FaTwitter /> Twitter</a>
          <a href="#"><FaFacebookF /> Facebook</a>
          <a href="#"><FaLinkedinIn /> LinkedIn</a>
          <a href="#"><FaInstagram /> Instagram</a>
        </div>
      </div>
    </div>
  );
};

export default ViewReport;
