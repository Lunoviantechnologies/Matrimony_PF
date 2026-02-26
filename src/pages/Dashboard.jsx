import React, { useState, useEffect, useMemo } from "react";
import "../styleSheets/dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import { fetchUserProfiles } from "../redux/thunk/profileThunk";
import { FaCrown, FaUser } from "react-icons/fa";
import { RiSecurePaymentFill } from "react-icons/ri";
import api from "../api/axiosInstance";
import DashboardAds from "./DashboardAds";
import { FaGift } from "react-icons/fa6";

const Dashboard = () => {

  const [showReferBanner, setShowReferBanner] = useState(false);
  const { id, myProfile, role } = useSelector(state => state.auth);
  const [summary, setSummary] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(fetchMyProfile(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await api.get("/dashboard/summary");
        setSummary(res.data);

        if (res.data?.referral && res.data.referral.completedReferrals < res.data.referral.totalReferralsNeeded) {
          setShowReferBanner(true);
        }
      } catch (e) {
        console.error("Error fetching dashboard summary:", e);
      }
    };

    if (id) {
      loadDashboard();
    }
  }, [id]);

  // console.log("My Profile in Dashboard:", myProfile);

  const maskName = (name = "") => {
    if (!name) return "—";
    return name.charAt(0).toUpperCase() + "*****";
  };

  const getDisplayName = (name) => {
    if (isPremiumActive) return name || "—";
    return maskName(name);
  };

  const isRecentlyActive = (lastActive) => {
    if (!lastActive) return false;
    const last = new Date(lastActive);
    const now = new Date();
    const diffMinutes = (now - last) / 1000 / 60;
    return diffMinutes <= 5; // change threshold if needed
  };

  const newMatches = summary?.newMatches || [];
  const premiumFilteredProfiles = summary?.premiumMatches || [];
  const acceptedRequests = summary?.acceptedCount || 0;
  const receivedRequests = summary?.receivedCount || 0;
  const rejectedRequests = summary?.rejectedCount || 0;
  const referSummary = summary?.referral || null;
  const currentPlan = summary?.subscription || null;

  const filteredProfiles = newMatches.slice(0, 6);
  const isPremiumActive = !!currentPlan;

  console.log("Dashboard Summary:", summary);

  return (
    <div className="dashboard_body">
      {showReferBanner && referSummary && (
        <div className="refer-banner">
          <div className="refer-left">
            <div className="refer-icon">
              <FaGift />
            </div>

            <div className="refer-content">
              <div className="refer-title-row">
                <h3>Refer & Earn</h3>
                <span className="refer-badge">NEW</span>
              </div>

              <p>
                Invite 2 friends and get <b>₹100 instant reward</b> on your next upgrade.
              </p>

              <div className="refer-progress-row">
                <div className="refer-progress-bar">
                  <div
                    className="refer-progress-fill"
                    style={{ width: `${referSummary.totalReferralsNeeded ? (referSummary.completedReferrals / referSummary.totalReferralsNeeded) * 100 : 0}%` }}
                  />
                </div>

                <span className="refer-progress-text">
                  {referSummary.completedReferrals}/
                  {referSummary.totalReferralsNeeded} done
                </span>
              </div>
            </div>
          </div>

          <div className="refer-actions">
            <button
              className="refer-primary-btn"
              onClick={() => {
                setShowReferBanner(false);
                navigate("/dashboard/settings?tab=refer");
              }}
            >
              Invite Now
            </button>

            <button
              className="refer-secondary-btn"
              onClick={() => setShowReferBanner(false)}
            >
              Maybe later
            </button>

            <span className="refer-balance">
              Reward balance: <b>₹{referSummary.rewardBalance ?? 0}</b>
            </span>
          </div>
        </div>
      )}

      {/* ====== Matches Section ====== */}

      <section className="matchSection">
        <h2 style={{ color: "#695019", marginBottom: 15 }}>
          New Profile Matches
        </h2>

        <div className="matchGrid">
          {
            filteredProfiles.length === 0 ? (
              <div className="no-profiles">
                <h4>No New Profiles Available</h4>
                <p>
                  Check back later or update your preferences to see more matches.
                </p>
              </div>
            ) : (
              filteredProfiles.map((i) => (
                <div className="matchSection_map" key={i.id}>
                  <img
                    src={i.updatePhoto ? i.updatePhoto : i.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png"} alt={i.id}
                    style={{ objectFit: "cover", }}
                    className={`profile-img ${i.hideProfilePhoto ? "blur-image" : ""}`}
                    onError={(e) => {
                      e.target.src = i.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png";
                    }}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  <div className="premium-badge">
                    {i.premium ? (
                      <span className="premium-icon"><FaCrown /></span>
                    ) : (
                      <span className="free-icon"><FaUser /> free</span>
                    )}
                  </div>
                  <div
                    style={{ position: "absolute", bottom: 15, left: 0, right: 0, textAlign: "center", color: "#fff", }}>
                    <div style={{ fontWeight: "bold", fontSize: 18, color: "#f7f6f6" }}>
                      {getDisplayName(i.name)}
                    </div>
                    <div style={{ fontSize: 14 }}>{i.city} • {i.age} Years old</div>
                  </div>
                  {/* Online Indicator */}
                  <div className={`status-dot ${isRecentlyActive(i.lastActive) ? "online" : "offline"}`} />
                </div>
              ))
            )
          }
        </div>
      </section>
      <div>
        <DashboardAds /><br />
      </div>

      {/* ====== Request Section ====== */}
      <section
        style={{ background: "#fff", borderRadius: 15, padding: 24, marginBottom: 32, boxShadow: "0 1px 6px #ddd", }}>
        <h2 style={{ color: "#695019", marginBottom: 15 }}>Interest Requests</h2>

        <div className="interest-tabs" style={{ display: "flex", gap: 15, marginBottom: 20 }}>
          <button onClick={() => { navigate('/dashboard/requests/received') }}
            style={{ fontWeight: "bold", color: "green", background: "#e8fff2", border: "none", padding: "10px 20px", borderRadius: 25, }}>
            New Requests <span style={{ backgroundColor: 'red', color: "white", borderRadius: '50%', padding: '2px 5px' }}>{receivedRequests}</span>
          </button>

          <button onClick={() => { navigate('/dashboard/requests/accepted') }}
            style={{ fontWeight: "bold", color: "#000", background: "#F8F6F1", border: "none", padding: "10px 20px", borderRadius: 25, }}>
            Accepted <span style={{ backgroundColor: 'red', color: "white", borderRadius: '50%', padding: '2px 5px' }}>{acceptedRequests}</span>
          </button>

          <button onClick={() => { navigate('/dashboard/requests/rejected') }}
            style={{ fontWeight: "bold", color: "#000", background: "#F8F6F1", border: "none", padding: "10px 20px", borderRadius: 25, }}>
            Denied <span style={{ backgroundColor: 'red', color: "white", borderRadius: '50%', padding: '2px 5px' }}>{rejectedRequests}</span>
          </button>
        </div>
      </section>

      {/* ====== Plan and Chat Section ====== */}
      <section style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        {/* Plan Details */}
        <div className="planSection">
          <h3 style={{ color: "#695019", marginBottom: 15 }}>
            <RiSecurePaymentFill /> My Subscription Plan
          </h3>

          {!currentPlan ? (
            <div>
              <p style={{ color: "#999", fontStyle: "italic" }}>
                No active subscription plan
              </p>
              <button className="planBtn" onClick={() => navigate("/dashboard/premium")}>Upgrade</button>
            </div>
          ) : (
            <div className="planSection">

              <p style={{ fontWeight: "bold" }}>
                Plan Name: {currentPlan.planName}
              </p>

              <p>
                Amount: {currentPlan.currency} {currentPlan.amount}
              </p>

              <p>
                Valid From:{" "}
                {new Date(currentPlan.premiumStart).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              <p>
                Valid Till:{" "}
                {new Date(currentPlan.premiumEnd).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              {currentPlan.expiryMessage && (
                <p style={{ color: "#888" }}>
                  {currentPlan.expiryMessage}
                </p>
              )}

            </div>
          )}
        </div>

        {/* Premium Members */}
        <div className="chatList">
          <h3 style={{ color: "#695019", marginBottom: 20 }}>
            <FaCrown /> Premium Members
          </h3>

          {premiumFilteredProfiles.map((i) => (
            <div className="chatList_map" key={i.id}>
              <img
                src={i.updatePhoto ? i.updatePhoto : i.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png"}
                alt={i.id}
                className={`premium-img ${i.hideProfilePhoto ? "premiumblur-image" : ""}`}
                style={{ width: 60, height: 60, borderRadius: 15, objectFit: "cover", marginRight: 15, }} />
              <div>
                <div style={{ fontWeight: "bold", fontSize: 18, color: "#5C4218" }}>
                  {getDisplayName(i.name)}
                </div>
                <div style={{ color: "#8A6F47" }}>{i.city}, {i.country} || {i.age} years || {i.motherTongue}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;