import React, { useState, useEffect, useRef } from "react";
import '../styleSheets/ProfileView.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, } from "recharts";
import { FiCamera, FiUpload, FiEdit, FiChevronDown } from "react-icons/fi";
import { FaHeart, FaEye, FaHandshake, FaMousePointer } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { fetchUserProfiles } from "../redux/thunk/profileThunk";

const PROFILE_FIELDS = [
  "firstName",
  "lastName",
  "gender",
  "dateOfBirth",
  "age",
  "height",
  "weight",
  "city",
  "state",
  "country",
  "religion",
  "caste",
  "education",
  "occupation",
  "companyName",
  "annualIncome",
  "aboutYourself",
  "updatePhoto",
  "maritalStatus",
  "motherTongue",
  "familyType",
  "familyStatus",
];

const calculateProfileCompletion = (profile) => {
  if (!profile) return 0;

  const filled = PROFILE_FIELDS.filter((field) => {
    const value = profile[field];
    return value !== null && value !== undefined && value !== "";
  });

  return Math.round((filled.length / PROFILE_FIELDS.length) * 100);
};

const initialProfile = {
  completion: 0,
  metrics: {
    // likes: 234,
    views: 0,
    interests: 0,
    clicks: 0,
  },
};

export default function ProfileView() {
  const navigate = useNavigate();
  const { id, myProfile, role } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  // profile / modal state
  const [profile, setProfile] = useState(initialProfile);
  const [chartData, setChartData] = useState([]);
  const [profileView, setProfileView] = useState(0);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchMyProfile(id));
  }, [id]);
  // console.log("myProfile in ProfileView:", myProfile);

  useEffect(() => {
    api.get(`/profiles/views/${id}`).then(res => {
      const text = res.data;
      const number = Number(text.match(/\d+/)?.[0] || 0);
      console.log("id count : ", number);
      setProfileView(number);
      setChartData(generateChartDataFromCount(number));
    })
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchAcceptedRequests = async () => {
      try {
        const receivedAccepted = await api.get(`/friends/accepted/received/${id}`);

        const sentAccepted = await api.get(`/friends/accepted/sent/${id}`);

        const merged = [...receivedAccepted.data, ...sentAccepted.data];

        setAcceptedRequests(merged);
        console.log("Accepted requests:", merged);
      } catch (error) {
        console.error("Error fetching accepted requests:", error);
      }
    };

    fetchAcceptedRequests();
  }, [id]);

  useEffect(() => {
    if (role[0].toUpperCase() === "USER") {
      dispatch(fetchUserProfiles());
    };
  }, [dispatch, role]);

  useEffect(() => {
    setProfile((prev) => ({ ...prev, metrics: { ...prev.metrics, interests: acceptedRequests.length, }, }));
  }, [acceptedRequests]);

  useEffect(() => {
    if (!myProfile) return;

    const completionPercent = calculateProfileCompletion(myProfile);

    setProfile((prev) => ({
      ...prev,
      completion: completionPercent,
    }));
  }, [myProfile]);

  // helpers
  const percentage = profile.completion;
  const circumference = 2 * Math.PI * 44; // r=44
  const offset = circumference - (percentage / 100) * circumference;

  const generateChartDataFromCount = (count) => {
    const days = 7; // last 7 days
    const avg = Math.max(1, Math.floor(count / days));

    return Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      views: avg + Math.floor(Math.random() * 2),
    }));
  };

  return (
    <div className="pv-container">
      <div className="pv-top">
        <div className="pv-header">
          <h2>Profiles views</h2>
        </div>

        <div className="pv-chart-card">
          <div className="pv-chart-left">
            <div className="pv-chart-stats">
              <div className="pv-stat-number">
                {profileView}
              </div>
              <div className="pv-stat-label">Total profile views</div>
              <div className="pv-stat-month">Today</div>
            </div>
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
              {myProfile?.updatePhoto ? (
                // blurred photo for privacy in main card
                <img
                  src={myProfile?.updatePhoto ? myProfile.updatePhoto : myProfile?.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png"}
                  alt={myProfile?.firstName}
                  className="pv-profile-photo"
                  onError={(e) => {
                    e.currentTarget.src =
                      myProfile?.gender === "Female"
                        ? "/placeholder_girl.png"
                        : "/placeholder_boy.png";
                  }}
                />
              ) : (
                <div className="pv-profile-placeholder">
                  <span>Photo</span>
                </div>
              )}
            </div>

            <div className="pv-profile-actions">
              <h3 className="pv-profile-name">{myProfile?.firstName + " " + myProfile?.lastName}</h3>
              <button className="pv-edit-btn" onClick={() => { navigate("/dashboard/editProfile") }}>
                <FiEdit /> EDIT PROFILE
              </button>
            </div>
          </div>

          <div className="pv-profile-body">
            <p className="pv-profile-desc">
              {myProfile?.aboutYourself || "No description provided."}
            </p>
            <div className="pv-profile-footer">
              <div className="pv-small-metric">
                <strong>{profileView}</strong>
                <span>Profile Views</span>
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
                  Complete your profile 100% to get more matches and views
                </div>
              </div>
            </div>
          </div>

          <div className="pv-metrics-list">
            <div className="pv-metric-row">
              <div className="pv-metric-icon views">
                <FaEye />
              </div>
              <div className="pv-metric-meta">
                <div className="pv-metric-title">Views</div>
                <div className="pv-metric-value">{profileView}</div>
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
          </div>
        </div>
      </div>
    </div>
  );
};
