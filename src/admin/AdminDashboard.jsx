import React, { useEffect, useState } from "react";
import {FaUsers,FaHeart,FaCheckCircle, FaRupeeSign,FaTimesCircle, FaHeadset,} from "react-icons/fa";
import axios from "axios";
import "../stylesheets/adminDashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfiles } from "../redux/thunk/profileThunk";

const AdminDashboard = () => {
  // const [profiles, setProfiles] = useState([]);
  const { profiles } = useSelector((state) => state.profiles);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserProfiles());
  }, [dispatch]);
  console.log("profiles : ", profiles);

  const totalUsers = profiles.length;

  const activeUsers = profiles.filter((u) => u.activeFlag === true);
  const inactiveUsers = profiles.filter((u) => u.activeFlag === false);

  const activeCount = activeUsers.length;
  const inactiveCount = inactiveUsers.length;


  const revenue = profiles
    .filter((u) => u.latestPayment && u.latestPayment.status === "PAID")   
    .reduce((sum, user) => sum + (user.latestPayment.amount || 0), 0);
  // console.log("revenue : ", revenue);
  const matches = Math.floor(totalUsers * 0.25);

  return (
    <div className="admin-container">
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Overview and management tools</p>
          </div>
          <img
            src="saathjanam_logo.png"
            alt="Admin Avatar"
            className="admin-avatar"
          />
        </header>

        <section className="stats-section">

          <div className="stat-card pink">
            <div className="icon"><FaUsers /></div>
            <h3>Total Users</h3>
            <p>{loading ? "Loading..." : totalUsers}</p>
          </div>

          <div className="stat-card green">
            <div className="icon"><FaCheckCircle /></div>
            <h3>Active Profiles</h3>
            <p>{loading ? "Loading..." : activeCount}</p>
          </div>

          <div className="stat-card red">
            <div className="icon"><FaTimesCircle /></div>
            <h3>Inactive Profiles</h3>
            <p>{loading ? "Loading..." : inactiveCount}</p>
          </div>

          <div className="stat-card blue">
            <div className="icon"><FaRupeeSign /></div>
            <h3>Recent Revenue</h3>
            <p>₹{revenue}</p>
          </div>
        </section>

        <section className="activity-section">
          <h2>Recent Activity</h2>

          {loading ? (
            <p>Loading activity...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {profiles.slice(0, 5).map((p) => (
                  <tr key={p.id}>
                    <td>{p.firstName} {p.lastName}</td>
                    <td>{p.active ? "Active" : "Inactive"}</td>
                    <td>{p.payments || "Not Paid"}</td>
                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions">
            <button className="action-btn"><FaCheckCircle /> Approvals</button>
            <button className="action-btn"><FaHeadset /> Support</button>
          </div>
        </section>

        <footer className="admin-footer">
          © 2025 SaathJanam Admin • All Rights Reserved
        </footer>
      </main>
    </div>
  );
};

export default AdminDashboard;
