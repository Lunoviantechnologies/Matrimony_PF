import React, { useState, useEffect, useMemo } from "react";
import "../styleSheets/dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import { fetchUserProfiles } from "../redux/thunk/profileThunk";
import { FaCrown } from "react-icons/fa";
import { RiSecurePaymentFill } from "react-icons/ri";
import api from "../api/axiosInstance";
import DashboardAds from "./DashboardAds";

const Dashboard = () => {

  const navigate = useNavigate();
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const { id, myProfile, role } = useSelector(state => state.auth);
  const { profiles } = useSelector(state => state.profiles);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMyProfile(id));

    if (role[0].toUpperCase() === "USER") {
      dispatch(fetchUserProfiles());
    };
  }, [id, dispatch, role]);
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
  // console.log("filtered Profiles in Dashboard:", filteredProfiles);

  const premiumFilteredProfiles = profiles.filter(p => p.id !== id)
    .filter(p => p.gender !== myProfile?.gender)
    .filter(p => p.premium)
    .slice(0, 5);
  // console.log("Premium filtered Profiles in Dashboard:", premiumFilteredProfiles);

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
        image: profile?.updatePhoto ? profile.updatePhoto : profile?.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png",
      };
    });
  }, [receivedRequests, profiles, id]);

  return (
    <div className="dashboard_body">
      {/* ====== Matches Section ====== */}

      <section className="matchSection">
        <h2 style={{ color: "#695019", marginBottom: 15 }}>
          New Profile Matches
        </h2>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
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
                    className={`profile-img ${!isPremiumActive ? "blur-image" : ""}`}
                    onError={(e) => {
                      e.target.src = i.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png";
                    }}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  {!isPremiumActive && (
                    <div className="premium-overlay" onClick={() => navigate("/dashboard/premium")}>
                      🔒 Upgrade to Premium
                    </div>
                  )}
                  <div
                    style={{ position: "absolute", bottom: 15, left: 0, right: 0, textAlign: "center", color: "#fff", }}>
                    <div style={{ fontWeight: "bold", fontSize: 18 }}>{i.firstName}</div>
                    <div style={{ fontSize: 14 }}>{i.city} • {i.age} Years old</div>
                  </div>
                  {/* Online Indicator */}
                  <div
                    style={{
                      position: "absolute", top: 10, right: 10, width: 14, height: 14, borderRadius: "50%", background: "#2ECC71",
                      border: "2px solid #fff",
                    }}
                  ></div>
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

        <div style={{ display: "flex", gap: 15, marginBottom: 20 }}>
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
          <div
            key={req.requestId}
            style={{ display: "flex", alignItems: "center", marginBottom: 22, background: "#fff", padding: 10, borderRadius: 10, boxShadow: "0 1px 6px #ddd", }}
          >
            <div>
              <img
                src={req.image}
                alt={req.senderName}
                className={`request-img ${!myProfile?.premium ? "requestblur-image" : ""}`}
                style={{ width: 110, height: 90, borderRadius: 15, marginRight: 22, objectFit: "cover", }}
                onError={(e) => {
                  e.target.src = req.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png";
                }}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", fontSize: 20 }}>{req.senderName}</div>
            </div>
            <div>
              <button onClick={() => { handleAccept(req.requestId) }}
                style={{ marginRight: 8, background: "#117A65", color: "#fff", border: "none", borderRadius: 8, padding: "7px 18px", }}>
                Accept
              </button>
              <button onClick={() => { handleReject(req.requestId) }}
                style={{ background: "#F25C5C", color: "#fff", border: "none", borderRadius: 8, padding: "7px 18px", }}>
                Deny
              </button>
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
                className={`premium-img ${!isPremiumActive ? "premiumblur-image" : ""}`}
                style={{ width: 60, height: 60, borderRadius: 15, objectFit: "cover", marginRight: 15, }} />
              <div>
                <div style={{ fontWeight: "bold", fontSize: 18, color: "#5C4218", }}>
                  {i.firstName} {i.lastName}
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