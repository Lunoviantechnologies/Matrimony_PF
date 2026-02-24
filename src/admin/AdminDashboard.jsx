import React, { useEffect, useState } from "react";
import { FaUsers, FaHeart, FaCheckCircle, FaRupeeSign, FaTimesCircle, FaHeadset, FaCrown, FaTag} from "react-icons/fa";
import "../styleSheets/AdminDashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProfiles } from "../redux/thunk/profileThunk";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [dashboardStats, setDashboardStats] = useState(null);
  const { role } = useSelector((state) => state.auth);
  // const { profiles } = useSelector((state) => state.profiles);
  const { adminProfiles, adminloading } = useSelector((state) => state.profiles);

  useEffect(() => {
    if (role?.[0]?.toUpperCase() === "ADMIN") {
      dispatch(fetchAdminProfiles({ page: 0, size: 50}));
    };
  }, [dispatch, role]);
  console.log("adminProfiles : ", adminProfiles);

  useEffect(() => {
    const dashboardData = async () => {
      try {
        const res = await api.get("/admin/dashboard-stats");
        setDashboardStats(res.data);
        console.log("Dashboard stats : ", res.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    dashboardData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "--";

    return new Date(
      dateStr.replace(/\.\d+/, "")
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="admin-container">
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Overview and management tools</p>
          </div>
          <img src="vivahjeevan_logo.png" alt="Admin Avatar" className="admin-avatar" />
        </header>

        <section className="stats-section">

          <div className="stat-card pink">
            <div className="icon"><FaUsers /></div>
            <h5>Total Users</h5>
            <p>{dashboardStats?.totalUsers ?? 0}</p>
          </div>

          <div className="stat-card green">
            <div className="icon"><FaCheckCircle /></div>
            <h5>Active Profiles</h5>
            <p>{dashboardStats?.activeUsers ?? 0}</p>
          </div>

          <div className="stat-card red">
            <div className="icon"><FaTimesCircle /></div>
            <h5>Inactive Profiles</h5>
            <p>{dashboardStats?.inactiveUsers ?? 0}</p>
          </div>

          <div className="stat-card red">
            <div className="icon"><FaCrown /></div>
            <h5>Premium Profiles</h5>
            <p>{dashboardStats?.premiumUsers ?? 0}</p>
          </div>

          <div className="stat-card red">
            <div className="icon"><FaTag  /></div>
            <h5>Free Profiles</h5>
            <p>{dashboardStats?.nonPremiumUsers ?? 0}</p>
          </div>

          <div className="stat-card blue">
            <div className="icon"><FaRupeeSign /></div>
            <h5>Today Revenue</h5>
            <p>
              ₹{dashboardStats?.todayRevenue?.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) ?? "0.00"}
            </p>
          </div>

          <div className="stat-card purple">
            <div className="icon"><FaRupeeSign /></div>
            <h5>Total Revenue</h5>
            <p>
              ₹{dashboardStats?.totalRevenue?.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) ?? "0.00"}
            </p>
          </div>

        </section>

        <section className="activity-section">
          <h2>Recent Activity</h2>

          {adminloading ? (
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
                {adminProfiles.slice(0, 5).map((p) => (
                  <tr key={p.id} className="text-center">
                    <td>{p.firstName} {p.lastName}</td>
                    <td>{p.active ? "Active" : "Inactive"}</td>
                    <td>
                      {p.payments?.length
                        ? p.payments.map(pay => (
                          <div key={pay.id}>
                            ₹{Number(pay.amount).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
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
                    <td>{formatDate(p.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions w-50 mx-auto">
            <button className="action-btn" onClick={() => navigate("/admin/aprovals")}><FaCheckCircle /> Approvals</button>
            <button className="action-btn" onClick={() => navigate("/admin/admin_support")}><FaHeadset /> Support</button>
          </div>
        </section>

        <footer className="admin-footer">
          © 2025 VivahJeevan Admin • All Rights Reserved
        </footer>
      </main>
    </div>
  );
};

export default AdminDashboard;
