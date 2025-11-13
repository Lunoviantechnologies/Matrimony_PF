import React from "react";
import { FaUsers, FaHeart, FaUserPlus, FaRupeeSign, FaChartLine, FaFileAlt, FaCheckCircle, FaHeadset, } from "react-icons/fa";
import "../stylesheets/adminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="sidebar-logo">SJ</div>
        <nav className="sidebar-nav">
          <button><FaChartLine /><span>Dashboard</span></button>
          <button><FaHeart /><span>Matches</span></button>
          <button><FaUserPlus /><span>New Profiles</span></button>
          <button><FaRupeeSign /><span>Payments</span></button>
          <button><FaFileAlt /><span>Reports</span></button>
          <button><FaCheckCircle /><span>Approvals</span></button>
          <button><FaHeadset /><span>Support</span></button>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Overview and management tools</p>
          </div>
          <img
            src="https://i.pravatar.cc/50"
            alt="Admin Avatar"
            className="admin-avatar"
          />
        </header>

        <section className="stats-section">
          <div className="stat-card pink">
            <div className="icon"><FaUsers /></div>
            <h3>Total Users</h3>
            <p>1,240</p>
          </div>
          <div className="stat-card green">
            <div className="icon"><FaCheckCircle /></div>
            <h3>Active Profiles</h3>
            <p>780</p>
          </div>
          <div className="stat-card yellow">
            <div className="icon"><FaHeart /></div>
            <h3>Matches</h3>
            <p>320</p>
          </div>
          <div className="stat-card blue">
            <div className="icon"><FaRupeeSign /></div>
            <h3>Revenue</h3>
            <p>₹1,85,000</p>
          </div>
        </section>

        <section className="activity-section">
          <h2>Recent Activity</h2>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Priya Sharma</td>
                <td>Profile Approved</td>
                <td>Today</td>
              </tr>
              <tr>
                <td>Ravi Kumar</td>
                <td>Payment Received</td>
                <td>Yesterday</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions">
            <button className="action-btn"><FaCheckCircle /> Approve</button>
            <button className="action-btn"><FaHeadset /> Support</button>
          </div>
        </section>

        <footer className="admin-footer">© 2025 SaathJanam Admin • All Rights Reserved</footer>
      </main>
    </div>
  );
};

export default AdminDashboard;