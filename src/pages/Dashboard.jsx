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

  const navigate = useNavigate();
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [referSummary, setReferSummary] = useState(null);
  const [showReferBanner, setShowReferBanner] = useState(false);
  const { id, myProfile, role } = useSelector(state => state.auth);
  const { profiles } = useSelector(state => state.profiles);
  const dispatch = useDispatch();

  console.log("profiles: ", profiles);

  useEffect(() => {
    dispatch(fetchMyProfile(id));

    if (role[0].toUpperCase() === "USER") {
      dispatch(fetchUserProfiles());
    };
  }, [id, dispatch, role]);

  useEffect(() => {
    const loadReferral = async () => {
      try {
        const res = await api.get("/referrals/me");
        const data = res.data;
        setReferSummary(data);
        if (data && data.completedReferrals < data.totalReferralsNeeded) {
          setShowReferBanner(true);
        }
      } catch (e) {
        // ignore referral errors
      }
    };
    if (id) {
      loadReferral();
    }
  }, [id]);
  console.log("My Profile in Dashboard:", myProfile);

  const now = new Date();
  // Date 4 days ago (including today)
  const fourDaysAgo = new Date();
  fourDaysAgo.setDate(now.getDate() - 4);

  const filteredProfiles = profiles.filter(p => p.id !== id)
    .filter(p => p.gender !== myProfile?.gender)
    .filter(p => {
      if (!p.createdAt) return false;
      const createdDate = new Date(p.createdAt);
      return createdDate >= fourDaysAgo && createdDate <= now;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  console.log("filtered Profiles in Dashboard:", filteredProfiles);

  const premiumFilteredProfiles = profiles.filter(p => p.id !== id)
    .filter(p => p.gender !== myProfile?.gender)
    .filter(p => p.premium)
    .slice(0, 5);
  console.log("Premium filtered Profiles in Dashboard:", premiumFilteredProfiles);

  // ---------- PREMIUM HELPERS ----------
  const sortedPayments = useMemo(() => {
    return [...(myProfile?.payments || [])].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [myProfile]);

  const getPaymentStatus = (payment) => {
    if (!payment) return "UNKNOWN";
    const status = payment.status?.toUpperCase();
    if (status === "FAILED") return "FAILED";
    if (status === "PENDING") return "PENDING";
    if (status === "PAID") {
      const end = payment.premiumEnd ? new Date(payment.premiumEnd) : null;

      return end && end >= new Date() ? "ACTIVE" : "EXPIRED";
    }
    return "UNKNOWN";
  };

  const currentPlan = useMemo(() => {
    return sortedPayments.find((p) => getPaymentStatus(p) === "ACTIVE");
  }, [sortedPayments]);

  const isPremiumActive = !!currentPlan;
  const maskName = (name = "") => {
    if (!name) return "—";
    return name.charAt(0).toUpperCase() + "*****";
  };

  const getDisplayName = (first, last) => {
    if (isPremiumActive) return `${first || ""} ${last || ""}`.trim();

    return `${maskName(first)} ${maskName(last)}`.trim();
  };

  useEffect(() => {
    const fetchAcceptedRequests = async () => {
      try {
        // 1) Requests YOU accepted (receiver = you)
        const receivedAccepted = await api.get(`/friends/accepted/received/${id}`);

        // 2) Requests THEY accepted (sender = you)
        const sentAccepted = await api.get(`/friends/accepted/sent/${id}`);

        // Combine both
        const merged = [...receivedAccepted.data, ...sentAccepted.data];
        setAcceptedRequests(merged);

        console.log("Accepted requests:", merged);
      } catch (error) {
        console.error("Error fetching accepted requests:", error);
      }
    };

    fetchAcceptedRequests();

    api.get(`/friends/received/${id}`).then((response) => {
      console.log("Received requests:", response.data);
      setReceivedRequests(response.data);
    }).catch((error) => {
      console.error("Error fetching received requests:", error);
    });

    const fetchRejectedRequests = async () => {
      try {
        // 1) Requests YOU rejected (receiver = you)
        const receivedRejected = await api.get(`/friends/rejected/received/${id}`);

        // 2) Requests THEY rejected (sender = you)
        const sentRejected = await api.get(`/friends/rejected/sent/${id}`);

        // Combine both
        const merged = [...receivedRejected.data, ...sentRejected.data];
        setRejectedRequests(merged);

        console.log("Rejected requests:", merged);
      } catch (error) {
        console.error("Error fetching accepted requests:", error);
      }
    };

    fetchRejectedRequests();
  }, [id]);

  const handleAccept = async (requestId) => {
    try {
      const response = await api.post(`/friends/respond/${requestId}?accept=true`);
      console.log("Request accepted:", response.data);
      alert("Request accepted successfully");
      setReceivedRequests(receivedRequests.filter(req => req.requestId !== requestId));
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await api.post(`/friends/respond/${requestId}?accept=false`);
      console.log("Request rejected:", response.data);
      alert("Request rejected successfully");
      setReceivedRequests(receivedRequests.filter(req => req.requestId !== requestId));
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const receivedWithImages = useMemo(() => {
    if (!receivedRequests.length || !profiles.length) return [];

    return receivedRequests.map(req => {
      const otherUserId =
        req.senderId === id ? req.receiverId : req.senderId;

      const profile = profiles.find(p => p.id === otherUserId);

      return {
        ...req,
        hideProfilePhoto: profile.hideProfilePhoto,
        image: profile?.updatePhoto ? profile.updatePhoto : profile?.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png",
      };
    });
  }, [receivedRequests, profiles, id]);

  const isRecentlyActive = (lastActive) => {
    if (!lastActive) return false;

    const last = new Date(lastActive.replace(" ", "T"));
    const now = new Date();

    const diffMinutes = (now - last) / 1000 / 60;

    return diffMinutes <= 5; // change threshold if needed
  };

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
                    style={{
                      width: `${(referSummary.completedReferrals /
                        referSummary.totalReferralsNeeded) *
                        100
                        }%`,
                    }}
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
                    src={i.updatePhoto ? i.updatePhoto : i.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png"} alt={i.firstName}
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
                      {getDisplayName(i.firstName, i.lastName)}
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
            New Requests <span style={{ backgroundColor: 'red', color: "white", borderRadius: '50%', padding: '2px 5px' }}>{receivedRequests.length}</span>
          </button>

          <button onClick={() => { navigate('/dashboard/requests/accepted') }}
            style={{ fontWeight: "bold", color: "#000", background: "#F8F6F1", border: "none", padding: "10px 20px", borderRadius: 25, }}>
            Accepted <span style={{ backgroundColor: 'red', color: "white", borderRadius: '50%', padding: '2px 5px' }}>{acceptedRequests.length}</span>
          </button>

          <button onClick={() => { navigate('/dashboard/requests/rejected') }}
            style={{ fontWeight: "bold", color: "#000", background: "#F8F6F1", border: "none", padding: "10px 20px", borderRadius: 25, }}>
            Denied <span style={{ backgroundColor: 'red', color: "white", borderRadius: '50%', padding: '2px 5px' }}>{rejectedRequests.length}</span>
          </button>
        </div>

        {receivedWithImages.map((req) => (
          <div key={req.requestId} className="request-row">
            <div className="request-left">
              <img
                src={req.image}
                alt={req.senderName}
                className={`request-img ${req?.hideProfilePhoto ? "requestblur-image" : ""}`}
                onError={(e) => {
                  e.target.src =
                    req.gender === "Female"
                      ? "/placeholder_girl.png"
                      : "/placeholder_boy.png";
                }}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />

              <div className="request-info">
                <div className="request-name">
                  {isPremiumActive ? req.senderName : maskName(req.senderName)}
                </div>

                <div className="request-actions">
                  <button className="accept-btn" onClick={() => handleAccept(req.requestId)}>
                    Accept
                  </button>

                  <button className="deny-btn" onClick={() => handleReject(req.requestId)}>
                    Deny
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ====== Plan and Chat Section ====== */}
      <section style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        {/* Plan Details */}
        <div className="planSection">
          <h3 style={{ color: "#695019", marginBottom: 15 }}>
            <RiSecurePaymentFill /> My Subscription Plan
          </h3>

          {!currentPlan ? (
            <p style={{ color: "#999", fontStyle: "italic" }}>
              No active subscription plan
            </p>
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
                alt={i.firstName}
                className={`premium-img ${i.hideProfilePhoto ? "premiumblur-image" : ""}`}
                style={{ width: 60, height: 60, borderRadius: 15, objectFit: "cover", marginRight: 15, }} />
              <div>
                <div style={{ fontWeight: "bold", fontSize: 18, color: "#5C4218" }}>
                  {getDisplayName(i.firstName, i.lastName)}
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