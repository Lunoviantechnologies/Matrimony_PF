import React, { useEffect, useState } from "react";
import "../styleSheets/ViewReport.css";
import { FaUsers, FaRupeeSign, } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, } from "recharts";
import api from "../api/axiosInstance";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

const ALL_PLANS = ["Gold", "Gold Plus", "Diamond", "Diamond Plus", "Platinum"];

const ViewReport = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [yearlyReport, setYearlyReport] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch Yearly Report
  useEffect(() => {
    const fetchYearlyReport = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/admin/yearly-dashboard?year=${selectedYear}`
        );
        setYearlyReport(res.data);
      } catch (err) {
        console.error("Error fetching yearly report:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchYearlyReport();
  }, [selectedYear]);

  const normalizedPlans = ALL_PLANS.map((planName) => {
    const existingPlan = yearlyReport?.plans?.find(
      (p) => p.planType.toLowerCase() === planName.toLowerCase()
    );

    return {
      planType: planName,
      totalMembers: existingPlan?.totalMembers || 0,
      totalRevenue: existingPlan?.totalRevenue || 0,
    };
  });

  return (
    <div className="viewreport-container">
      <div className="banner">
        <div className="overlay">
          <h1>Vivahjeevan Matrimony Report - {selectedYear}</h1>
          <p>Bringing hearts together through love and trust</p>
        </div>
      </div>

      {/* Year Selector */}
      <div className="year-select" style={{width: "150px"}}>
        <label>Select Year: </label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {Array.from({ length: 10 }, (_, i) => currentYear - i).map(
            (year) => (
              <option key={year} value={year}>
                {year}
              </option>
            )
          )}
        </select>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="card blue">
          <FaRupeeSign className="icon" />
          <h2>
            {loading ? "Loading..." : `₹${(yearlyReport?.totalRevenue || 0).toLocaleString("en-IN")}`}
          </h2>
          <p>Total Revenue</p>
        </div>

        {normalizedPlans.map((plan) => (
          <div key={plan.planType} className="card pink">
            <FaUsers className="icon" />
            <h2>{loading ? "Loading..." : plan.totalMembers}</h2>
            <p>{plan.planType} Members</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-section">

        {/* Membership Distribution Pie */}
        <div className="chart-box">
          <h3>Membership Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={normalizedPlans}
                dataKey="totalMembers"
                nameKey="planType"
                outerRadius={100}
                label
              >
                {normalizedPlans.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Plan Bar */}
        <div className="chart-box">
          <h3>Revenue by Plan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={normalizedPlans}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="planType" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalRevenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default ViewReport;