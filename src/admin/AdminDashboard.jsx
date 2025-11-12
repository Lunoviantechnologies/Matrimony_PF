import React from "react";
import "../stylesheets/adminDashboard.css";
import {
  FaUsers,
  FaHeart,
  FaUserPlus,
  FaRupeeSign,
  FaChartLine,
  FaCog,
  FaFileAlt,
  FaCheckCircle,
  FaHeadset,
} from "react-icons/fa";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <h1>SaathJanam Admin Dashboard</h1>
        <p>Manage users, reports & activities</p>
        <img
          src="https://i.pravatar.cc/40?img=13"
          alt="Admin Avatar"
          className="admin-avatar"
        />
      </header>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-card pink">
          <FaUsers className="icon" />
          <h2>3,540</h2>
          <p>Total Members</p>
        </div>
        <div className="stat-card green">
          <FaHeart className="icon" />
          <h2>780</h2>
          <p>Total Matches</p>
        </div>
        <div className="stat-card yellow">
          <FaUserPlus className="icon" />
          <h2>56</h2>
          <p>New Profiles Today</p>
        </div>
        <div className="stat-card blue">
          <FaRupeeSign className="icon" />
          <h2>₹2.4L</h2>
          <p>Total Income</p>
        </div>
        <div className="stat-card violet">
          <FaChartLine className="icon" />
          <h2>88%</h2>
          <p>Active Users</p>
        </div>
      </section>

      {/* Recent Activities */}
      <section className="activity-section">
        <h2>Recent Activities</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Action</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ravi Kumar</td>
              <td>Male</td>
              <td>Joined</td>
              <td>Nov 4, 2025</td>
            </tr>
            <tr>
              <td>Aisha Begum</td>
              <td>Female</td>
              <td>Matched</td>
              <td>Nov 4, 2025</td>
            </tr>
            <tr>
              <td>Vikram Reddy</td>
              <td>Male</td>
              <td>Upgraded Plan</td>
              <td>Nov 3, 2025</td>
            </tr>
            <tr>
              <td>Sneha Sharma</td>
              <td>Female</td>
              <td>Verified Profile</td>
              <td>Nov 3, 2025</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions">
          <button className="action-btn">
            <FaFileAlt /> View Reports
          </button>
          <button className="action-btn">
            <FaUsers /> Manage Members
          </button>
          <button className="action-btn">
            <FaCheckCircle /> Approve Profiles
          </button>
          <button className="action-btn">
            <FaHeadset /> Customer Support
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="admin-footer">
        © 2025 SaathJanam Matrimony | support@saathjanam.com
      </footer>
    </div>
  );
};

export default AdminDashboard;
