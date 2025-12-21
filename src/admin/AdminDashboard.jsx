import React, { useEffect, useState } from "react";
import { FaUsers, FaHeart, FaCheckCircle, FaRupeeSign, FaTimesCircle, FaHeadset, } from "react-icons/fa";
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

  const activeUsers = profiles.filter((u) => u.active === true);
  const inactiveUsers = profiles.filter((u) => u.active === false);

  const activeCount = activeUsers.length;
  const inactiveCount = inactiveUsers.length;

  const today = new Date().toISOString().split("T")[0];

  const revenue = profiles.reduce((total, user) => {
    if (!Array.isArray(user.payments)) return total;

    const todayPaidAmount = user.payments
      .filter(
        (p) =>
          p.status === "PAID" &&
          p.createdAt?.split("T")[0] === today
      )
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    return total + todayPaidAmount;
  }, 0);
  console.log("revenue : ", revenue);
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
            <h5>Total Users</h5>
            <p>{loading ? "Loading..." : totalUsers}</p>
          </div>

          <div className="stat-card green">
            <div className="icon"><FaCheckCircle /></div>
            <h5>Active Profiles</h5>
            <p>{loading ? "Loading..." : activeCount}</p>
          </div>

          <div className="stat-card red">
            <div className="icon"><FaTimesCircle /></div>
            <h5>Inactive Profiles</h5>
            <p>{loading ? "Loading..." : inactiveCount}</p>
          </div>

          <div className="stat-card blue">
            <div className="icon"><FaRupeeSign /></div>
            <h5>Daily Revenue</h5>
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
                  <th className="text-center">User</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Payment</th>
                  <th className="text-center">Plan</th>
                  <th className="text-center">Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {profiles.slice(0, 5).map((p) => (
                  <tr key={p.id} className="text-center">
                    <td>{p.firstName} {p.lastName}</td>
                    <td>{p.active ? "Active" : "Inactive"}</td>
                    <td>
                      {p.payments?.length
                        ? p.payments.map(pay => (
                          <div key={pay.id}>
                            ₹ {pay.amount}
                          </div>
                        ))
                        : "Not Paid"}
                    </td>
                    <td>
                      {p.payments?.length
                        ? p.payments.map(pay => (
                          <div key={pay.id}>
                            {pay.planCode}
                          </div>
                        ))
                        : " - "}
                    </td>
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
