import React, { useState, useEffect, useRef } from "react";
import '../styleSheets/ProfileView.css';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FiCamera, FiUpload, FiEdit, FiChevronDown } from "react-icons/fi";
import { FaHeart, FaEye, FaHandshake, FaMousePointer } from "react-icons/fa";

/**
 * Notes:
 * - Requires `recharts` and `react-icons` packages:
 *   npm install recharts react-icons
 *
 * - Plant decoration:
 *   Place the plant image at public/images/plant.png or import it and use as below.
 *   See the "How to connect plant decoration images" note at the end.
 */

const MONTHS = [
  "September 2025",
  "August 2025",
  "July 2025",
  "June 2025",
  "May 2025",
  "April 2025",
  "March 2025",
  "February 2025",
  "January 2025",
  "December 2024",
];

const SAMPLE_DATA = {
  // each month maps to an array of objects for the line chart
  "September 2025": [
    { day: "1", views: 40 },
    { day: "5", views: 50 },
    { day: "10", views: 55 },
    { day: "15", views: 70 },
    { day: "20", views: 60 },
    { day: "25", views: 80 },
    { day: "30", views: 95 },
  ],
  "August 2025": [
    { day: "1", views: 30 },
    { day: "5", views: 32 },
    { day: "10", views: 42 },
    { day: "15", views: 58 },
    { day: "20", views: 52 },
    { day: "25", views: 68 },
    { day: "31", views: 80 },
  ],
  "July 2025": [
    { day: "1", views: 20 },
    { day: "7", views: 35 },
    { day: "14", views: 45 },
    { day: "21", views: 60 },
    { day: "28", views: 50 },
  ],
  "June 2025": [
    { day: "1", views: 22 },
    { day: "8", views: 28 },
    { day: "16", views: 26 },
    { day: "24", views: 35 },
  ],
  "May 2025": [
    { day: "1", views: 10 },
    { day: "10", views: 18 },
    { day: "20", views: 22 },
    { day: "31", views: 30 },
  ],
  "April 2025": [
    { day: "1", views: 8 },
    { day: "10", views: 12 },
    { day: "20", views: 15 },
    { day: "30", views: 20 },
  ],
  "March 2025": [
    { day: "1", views: 20 },
    { day: "10", views: 35 },
    { day: "20", views: 25 },
    { day: "31", views: 40 },
  ],
  "February 2025": [
    { day: "1", views: 15 },
    { day: "8", views: 20 },
    { day: "16", views: 24 },
    { day: "24", views: 30 },
  ],
  "January 2025": [
    { day: "1", views: 12 },
    { day: "10", views: 18 },
    { day: "20", views: 22 },
    { day: "31", views: 28 },
  ],
  "December 2024": [
    { day: "1", views: 5 },
    { day: "10", views: 8 },
    { day: "20", views: 12 },
    { day: "31", views: 16 },
  ],
};

const initialProfile = {
  name: "Bhavya Sri",
  photoUrl: null, // default null -> use placeholder
  completion: 90,
  metrics: {
    likes: 234,
    views: 1234,
    interests: 98,
    clicks: 420,
  },
};

export default function ProfileView() {
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0]);
  const [chartData, setChartData] = useState(SAMPLE_DATA[MONTHS[0]]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // profile / modal state
  const [profile, setProfile] = useState(initialProfile);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [uploadPreview, setUploadPreview] = useState(profile.photoUrl);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // update chart data when selectedMonth changes
    setChartData(SAMPLE_DATA[selectedMonth] || []);
  }, [selectedMonth]);

  // when month is switched, we might update metrics or completion (sample)
  useEffect(() => {
    // sample: slightly vary the metrics by month (for visual change)
    const base = initialProfile.metrics;
    const variation = selectedMonth.length % 7;
    setProfile((p) => ({
      ...p,
      metrics: {
        likes: base.likes + variation * 3,
        views: base.views + variation * 40,
        interests: base.interests + variation,
        clicks: base.clicks + variation * 6,
      },
      completion: Math.min(100, initialProfile.completion + variation),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth]);

  function toggleDropdown() {
    setDropdownOpen((s) => !s);
  }
  function selectMonth(month) {
    setSelectedMonth(month);
    setDropdownOpen(false);
  }

  // Modal handlers
  function openEditModal() {
    setEditName(profile.name);
    setUploadPreview(profile.photoUrl);
    setIsModalOpen(true);
  }
  function closeModal() {
    setIsModalOpen(false);
    // clear temporary upload preview? keep it as is
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadPreview(url);
    // store file in a temp ref if needed; here we just preview
  }

  function handleSaveProfile() {
    setProfile((p) => ({
      ...p,
      name: editName || p.name,
      photoUrl: uploadPreview,
    }));
    setIsModalOpen(false);
  }

  function triggerFileInput() {
    if (fileInputRef.current) fileInputRef.current.click();
  }

  // helpers
  const percentage = profile.completion;
  const circumference = 2 * Math.PI * 44; // r=44
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="pv-container">
      <div className="pv-top">
        <div className="pv-header">
          <h2>Profiles views</h2>
          <div className="pv-month-dropdown">
            <button
              className="pv-dropdown-toggle"
              onClick={toggleDropdown}
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
            >
              <span>{selectedMonth}</span>
              <FiChevronDown className="pv-chevron" />
            </button>

            {dropdownOpen && (
              <ul className="pv-dropdown-list" role="listbox">
                {MONTHS.map((m) => (
                  <li
                    key={m}
                    className={`pv-dropdown-item ${
                      m === selectedMonth ? "selected" : ""
                    }`}
                    onClick={() => selectMonth(m)}
                  >
                    {m}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="pv-chart-card">
          <div className="pv-chart-left">
            <div className="pv-chart-stats">
              <div className="pv-stat-number">
                {chartData.reduce((acc, cur) => acc + cur.views, 0)}
              </div>
              <div className="pv-stat-label">Total profile views</div>
              <div className="pv-stat-month">{selectedMonth}</div>
            </div>
          </div>

          <div className="pv-chart-right">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#2e7d32"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* plant decoration image bottom-right */}
          <img
            src="/images/plant.png"
            alt="plant decoration"
            className="pv-plant"
            onError={(e) => {
              // fallback: hide if not present
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>

      <div className="pv-bottom">
        <div className="pv-profile-card">
          <div className="pv-profile-top">
            <div className="pv-profile-photo-wrap">
              {profile.photoUrl ? (
                // blurred photo for privacy in main card
                <img
                  src={profile.photoUrl}
                  alt="profile"
                  className="pv-profile-photo blurred"
                />
              ) : (
                <div className="pv-profile-placeholder blurred">
                  <span>Photo</span>
                </div>
              )}
            </div>

            <div className="pv-profile-actions">
              <h3 className="pv-profile-name">{profile.name}</h3>
              <button className="pv-edit-btn" onClick={openEditModal}>
                <FiEdit /> EDIT PROFILE
              </button>
            </div>
          </div>

          <div className="pv-profile-body">
            <p className="pv-profile-desc">
              Short bio or status — keep it concise. This matches the screenshot
              style.
            </p>
            <div className="pv-profile-footer">
              <div className="pv-small-metric">
                <strong>{profile.metrics.views}</strong>
                <span>Profile Views</span>
              </div>
              <div className="pv-small-metric">
                <strong>{profile.metrics.likes}</strong>
                <span>Likes</span>
              </div>
              <div className="pv-small-metric">
                <strong>{profile.metrics.interests}</strong>
                <span>Interests</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pv-status-card">
          <div className="pv-completion-row">
            <div className="pv-completion-left">
              <div className="pv-circle-wrap">
                <svg className="pv-circle" width="110" height="110">
                  <defs>
                    <linearGradient id="grad" x1="0" x2="1">
                      <stop offset="0%" stopColor="#8fd19e" />
                      <stop offset="100%" stopColor="#2e7d32" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="55"
                    cy="55"
                    r="44"
                    stroke="#e6f4ea"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="55"
                    cy="55"
                    r="44"
                    stroke="url(#grad)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform="rotate(-90 55 55)"
                  />
                  <text
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    className="pv-percent-text"
                  >
                    {percentage}%
                  </text>
                </svg>
              </div>
              <div className="pv-completion-labels">
                <div className="pv-completion-title">Profile completion</div>
                <div className="pv-completion-sub">
                  Complete your profile to get more matches and views
                </div>
              </div>
            </div>
          </div>

          <div className="pv-metrics-list">
            <div className="pv-metric-row">
              <div className="pv-metric-icon likes">
                <FaHeart />
              </div>
              <div className="pv-metric-meta">
                <div className="pv-metric-title">Likes</div>
                <div className="pv-metric-value">{profile.metrics.likes}</div>
              </div>
            </div>

            <div className="pv-metric-row">
              <div className="pv-metric-icon views">
                <FaEye />
              </div>
              <div className="pv-metric-meta">
                <div className="pv-metric-title">Views</div>
                <div className="pv-metric-value">{profile.metrics.views}</div>
              </div>
            </div>

            <div className="pv-metric-row">
              <div className="pv-metric-icon interests">
                <FaHandshake />
              </div>
              <div className="pv-metric-meta">
                <div className="pv-metric-title">Interests</div>
                <div className="pv-metric-value">
                  {profile.metrics.interests}
                </div>
              </div>
            </div>

            <div className="pv-metric-row">
              <div className="pv-metric-icon clicks">
                <FaMousePointer />
              </div>
              <div className="pv-metric-meta">
                <div className="pv-metric-title">Clicks</div>
                <div className="pv-metric-value">{profile.metrics.clicks}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit profile modal */}
      {isModalOpen && (
        <div className="pv-modal-overlay" onClick={closeModal}>
          <div
            className="pv-modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
            role="dialog"
            aria-modal="true"
          >
            <h3>Edit profile</h3>
            <div className="pv-modal-body">
              <div className="pv-upload-column">
                <div className="pv-upload-preview">
                  {uploadPreview ? (
                    <img src={uploadPreview} alt="preview" />
                  ) : (
                    <div className="pv-upload-placeholder">No photo</div>
                  )}
                </div>

                <div className="pv-upload-actions">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <button className="pv-upload-btn" onClick={triggerFileInput}>
                    <FiCamera /> Camera / Upload
                  </button>
                </div>
              </div>

              <div className="pv-form-column">
                <label>
                  Full name
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </label>

                <div className="pv-modal-actions">
                  <button className="pv-btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button className="pv-btn-primary" onClick={handleSaveProfile}>
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
