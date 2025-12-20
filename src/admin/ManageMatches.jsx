import React, { useState, useEffect } from "react";
import "../styleSheets/ManageMatches.css";
import { TbHeartHandshake } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfiles } from "../redux/thunk/profileThunk";

// --- MOCK USERS & MATCHES ---
const USERS = {
  u1: {
    id: "u1",
    name: "Aarushi Sharma",
    age: 24,
    gender: "Female",
    height: `5'4"`,
    city: "Hyderabad",
    community: "Hindu | Brahmin",
    job: "Software Engineer",
    education: "B.Tech",
    image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    bio: "Loves cooking and travelling.",
  },
  u2: {
    id: "u2",
    name: "Arjun Reddy",
    age: 27,
    gender: "Male",
    height: `5'9"`,
    city: "Bangalore",
    community: "Hindu | Reddy",
    job: "Business Analyst",
    education: "MBA",
    image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
    bio: "Enjoys hiking and reading.",
  },
  u3: {
    id: "u3",
    name: "Sneha Patil",
    age: 25,
    gender: "Female",
    height: `5'5"`,
    city: "Pune",
    community: "Hindu | Maratha",
    job: "Doctor",
    education: "MBBS",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    bio: "Cooking and sports lover.",
  },
  u4: {
    id: "u4",
    name: "Rohit Verma",
    age: 29,
    gender: "Male",
    height: `6'0"`,
    city: "Delhi",
    community: "Hindu | Kayastha",
    job: "Civil Engineer",
    education: "M.Tech",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    bio: "Travels and photography.",
  },
};

const MATCHES = [
  { id: 1, a: "u1", b: "u2", note: "High compatibility" },
  { id: 2, a: "u3", b: "u4", note: "Good location & career match" },
];

export default function ManageMatches() {
  // const [matches] = useState(MATCHES);
  const [activeProfile, setActiveProfile] = useState(null);
  const [anchorRect, setAnchorRect] = useState(null);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const { profiles } = useSelector((state) => state.profiles);
  const dispatch = useDispatch();

  // 🔹 Fetch accepted matches
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get(`${backendIP}/friends/all`);
        setMatches(res.data || []);
        console.log("Fetched matches: ", res.data);
      } catch (err) {
        console.error("Error fetching matches", err);
      }
    };

    fetchMatches();
  }, []);

  // 🔹 Fetch all profiles (for images)
  useEffect(() => {
    dispatch(fetchUserProfiles());
    setLoading(false);
  }, []);

  useEffect(() => {
    const update = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const findUser = (id) => USERS[id] || null;

  const openAt = (userId, e) => {
    e.stopPropagation();
    const u = findUser(userId);
    if (!u) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setAnchorRect(rect);
    setActiveProfile(u);
  };

  const closePopover = () => {
    setActiveProfile(null);
    setAnchorRect(null);
  };

  const getPopoverStyle = () => {
    if (!anchorRect) return { display: "none" };
    const popupW = 380;
    const popupH = 300;
    const pad = 8;
    const vw = viewport.w || window.innerWidth;
    const vh = viewport.h || window.innerHeight;

    let left = anchorRect.right + pad;
    let top = anchorRect.top;

    if (left + popupW > vw - 12) left = anchorRect.left - popupW - pad;
    if (top + popupH > vh - 12) top = Math.max(12, vh - popupH - 12);

    left = Math.max(8, Math.min(left, vw - popupW - 8));
    top = Math.max(8, Math.min(top, vh - popupH - 8));

    return {
      position: "fixed",
      left,
      top,
      width: popupW,
      maxHeight: popupH,
      zIndex: 3000,
      background: "#fff",
      borderRadius: 10,
      padding: 12,
      boxShadow: "0 12px 30px rgba(0,0,0,0.14)",
      overflow: "auto",
      border: "1px solid #eee",
    };
  };

  const handleMessage = (user) => {
    alert(`Open chat with ${user.name} (mock)`);
  };

  return (
    <div className="mm-container">
      <h2 className="mm-title">Matched Profiles</h2>

      <div className="mm-list">
        {matches.map((m) => {
          const A = findUser(m.a);
          const B = findUser(m.b);
          return (
            <div key={m.id} className="mm-pair-card">
              {/* Left user */}
              <div className="mm-user">
                <img
                  src={A.image}
                  alt={A.name}
                  className="mm-img"
                  onClick={(e) => openAt(A.id, e)}
                />
                <div className="mm-info">
                  <h4>{A.name}</h4>
                  <p>
                    {A.age} yrs • {A.height}
                  </p>
                  <p>{A.city}</p>
                </div>
              </div>

              {/* center note + heart */}
              <div className="mm-center">
                <div className="mm-note">{m.note}</div>
                <div className="mm-heart text-danger"><TbHeartHandshake /></div>
              </div>

              {/* Right user */}
              <div className="mm-user mm-user-right">
                <div className="mm-info">
                  <h4>{B.name}</h4>
                  <p>
                    {B.age} yrs • {B.height}
                  </p>
                  <p>{B.city}</p>
                </div>
                <img
                  src={B.image}
                  alt={B.name}
                  className="mm-img"
                  onClick={(e) => openAt(B.id, e)}
                />
              </div>

              {/* actions column: 3 equal curved buttons */}
              <div className="mm-actions">
                <span className="mm-matched-tag">Matched ✓</span>
                <button
                  className="mm-view-btn"
                  onClick={(e) => openAt(A.id, e)}
                >
                  View Aarushi Sharma
                </button>
                <button
                  className="mm-view-btn"
                  onClick={(e) => openAt(B.id, e)}
                >
                  View Arjun Reddy
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* popover */}
      {activeProfile && (
        <>
          <div
            onClick={closePopover}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 2500,
              background: "transparent",
            }}
          />
          <div style={getPopoverStyle()} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={closePopover}
                style={{
                  border: "none",
                  background: "#222",
                  color: "#fff",
                  borderRadius: 6,
                  width: 28,
                  height: 28,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: "0 0 120px" }}>
                <img
                  src={activeProfile.image}
                  alt={activeProfile.name}
                  style={{
                    width: 120,
                    height: 140,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: 8,
                  }}
                >
                  <h3 style={{ margin: 0 }}>{activeProfile.name}</h3>
                  <div style={{ color: "#666" }}>
                    {activeProfile.age ? `${activeProfile.age} yrs` : ""}
                  </div>
                </div>

                <div style={{ marginTop: 8, color: "#333" }}>
                  <div>
                    <strong>Gender:</strong> {activeProfile.gender || "—"}
                  </div>
                  <div>
                    <strong>Religion / Community:</strong>{" "}
                    {activeProfile.community || "—"}
                  </div>
                  <div>
                    <strong>Mother Tongue:</strong> —
                  </div>
                </div>

                <div style={{ marginTop: 10, color: "#333" }}>
                  <div>
                    <strong>Education:</strong>{" "}
                    {activeProfile.education || "—"}
                  </div>
                  <div>
                    <strong>Occupation:</strong> {activeProfile.job || "—"}
                  </div>
                  <div>
                    <strong>Location:</strong> {activeProfile.city || "—"}
                  </div>
                </div>

                {activeProfile.bio && (
                  <div style={{ marginTop: 10 }}>
                    <strong>About:</strong>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#444",
                        marginTop: 6,
                      }}
                    >
                      {activeProfile.bio}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: 12 }}>
                  <button
                    onClick={() => handleMessage(activeProfile)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#2563eb",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// import { useEffect, useState } from "react";
// import axios from "axios";
// import backendIP from "../api/api";
// import "../styleSheets/ManageMatches.css";

// export default function ManageMatches() {
//   const [matches, setMatches] = useState([]);
//   const [profiles, setProfiles] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 🔹 Fetch accepted matches
//   useEffect(() => {
//     const fetchMatches = async () => {
//       try {
//         const res = await axios.get(`${backendIP}/friends/all`);
//         setMatches(res.data || []);
//       } catch (err) {
//         console.error("Error fetching matches", err);
//       }
//     };

//     fetchMatches();
//   }, []);

//   // 🔹 Fetch all profiles (for images)
//   useEffect(() => {
//     const fetchProfiles = async () => {
//       try {
//         const res = await axios.get(`${backendIP}/admin/profiles`);
//         setProfiles(res.data || []);
//       } catch (err) {
//         console.error("Error fetching profiles", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfiles();
//   }, []);

//   // 🔹 Create image map (name -> image)
//   const profileImageMap = {};
//   profiles.forEach(p => {
//     profileImageMap[p.name] = p.image;
//   });

//   // 🔹 Only ACCEPTED matches
//   const acceptedMatches = matches.filter(
//     m => m.status?.toUpperCase() === "ACCEPTED"
//   );

//   if (loading) return <p>Loading matches...</p>;

//   return (
//     <div className="mm-container">
//       <h2 className="mm-title">Matched Profiles</h2>

//       {acceptedMatches.length === 0 && (
//         <p>No accepted matches found</p>
//       )}

//       <div className="mm-list">
//         {acceptedMatches.map(match => (
//           <div key={match.requestId} className="mm-pair-card">

//             {/* 🔹 Sender */}
//             <div className="mm-user">
//               <img
//                 src={
//                   profileImageMap[match.senderName] ||
//                   "/default-user.png"
//                 }
//                 alt={match.senderName}
//                 className="mm-img"
//               />
//               <div className="mm-info">
//                 <h4>{match.senderName}</h4>
//                 <p>{match.profile}</p>
//               </div>
//             </div>

//             <div className="mm-heart">matched</div>

//             {/* 🔹 Receiver */}
//             <div className="mm-user">
//               <img
//                 src={
//                   profileImageMap[match.receiverName] ||
//                   "/default-user.png"
//                 }
//                 alt={match.receiverName}
//                 className="mm-img"
//               />
//               <div className="mm-info">
//                 <h4>{match.receiverName}</h4>
//               </div>
//             </div>

//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }