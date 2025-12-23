import React, { useState, useEffect } from "react";
import "../styleSheets/ManageMatches.css";
import { TbHeartHandshake } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProfiles } from "../redux/thunk/profileThunk";
import axios from "axios";
import backendIP from "../api/api";
import api from "../api/axiosInstance";

export default function ManageMatches() {
  const dispatch = useDispatch();

  const { profiles } = useSelector((state) => state.profiles);
  const { id: myId, role } = useSelector((state) => state.auth);

  const [matches, setMatches] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const [anchorRect, setAnchorRect] = useState(null);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  /* -----------------------------------
     Fetch ACCEPTED friends
  ----------------------------------- */
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get(`/friends/all`);

        const accepted = res.data.filter(
          (m) => m.status?.toUpperCase() === "ACCEPTED"
        );

        setMatches(accepted || []);
      } catch (err) {
        console.error("Error fetching matches", err);
      }
    };

    fetchMatches();
  }, []);

  /* -----------------------------------
     Fetch all profiles
  ----------------------------------- */
  useEffect(() => {
    if (role[0].toUpperCase() === "ADMIN") {
      dispatch(fetchAdminProfiles());
    };
  }, [dispatch, role]);

  /* -----------------------------------
     Viewport for popover positioning
  ----------------------------------- */
  useEffect(() => {
    const update = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight });

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* -----------------------------------
     Helpers
  ----------------------------------- */
  const getProfileById = (id) =>
    profiles.find((p) => p.id === id);

  const friendPairs = matches
    .map((m) => {
      const userA = getProfileById(m.senderId);
      const userB = getProfileById(m.receiverId);

      if (!userA || !userB) return null;

      return {
        id: m.id,
        a: userA,
        b: userB,
      };
    })
    .filter(Boolean);
    // console.log("friendPairs : ", friendPairs);

  /* -----------------------------------
     Popover handlers
  ----------------------------------- */
  const openAt = (profile, e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setAnchorRect(rect);
    setActiveProfile(profile);
  };

  const closePopover = () => {
    setActiveProfile(null);
    setAnchorRect(null);
  };

  const getPopoverStyle = () => {
    if (!anchorRect) return { display: "none" };

    const popupW = 380;
    const popupH = 320;
    const pad = 8;

    let left = anchorRect.right + pad;
    let top = anchorRect.top;

    if (left + popupW > viewport.w)
      left = anchorRect.left - popupW - pad;

    if (top + popupH > viewport.h)
      top = viewport.h - popupH - pad;

    return {
      position: "fixed",
      left,
      top,
      width: popupW,
      zIndex: 3000,
      background: "#fff",
      borderRadius: 10,
      padding: 12,
      boxShadow: "0 12px 30px rgba(0,0,0,0.14)",
    };
  };

  return (
    <div className="mm-container">
      <h2 className="mm-title">Matched Profiles</h2>

      <div className="mm-list">
        {friendPairs.map((m, index) => (
          <div key={index} className="mm-pair-card">

            {/* Left user */}
            <div className="mm-user">
              <img
                src={m.a.updatePhoto ? m.a.updatePhoto : m.a.gender === "Female" ? "placeholder_girl.png" : "placeholder_boy.png"}
                alt={m.a.firstName}
                className="mm-img"
                onClick={(e) => openAt(m.a, e)}
              />
              <div className="mm-info">
                <h4>{m.a.firstName} {m.a.lastName}</h4>
                <p>{m.a.age} yrs</p>
                <p>{m.a.city}</p>
              </div>
            </div>

            {/* Center */}
            <div className="mm-center">
              <div className="mm-note">Matched</div>
              <div className="mm-heart text-danger">
                <TbHeartHandshake />
              </div>
            </div>

            {/* Right user */}
            <div className="mm-user mm-user-right">
              <div className="mm-info">
                <h4>{m.b.firstName} {m.b.lastName}</h4>
                <p>{m.b.age} yrs</p>
                <p>{m.b.city}</p>
              </div>
              <img
                src={m.b.updatePhoto ? m.b.updatePhoto : m.b.gender === "Female" ? "placeholder_girl.png" : "placeholder_boy.png"}
                alt={m.b.firstName}
                className="mm-img"
                onClick={(e) => openAt(m.b, e)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Popover */}
      {activeProfile && (
        <>
          <div
            onClick={closePopover}
            style={{ position: "fixed", inset: 0, zIndex: 2500 }}
          />

          <div style={getPopoverStyle()} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: "right" }}>
              <button onClick={closePopover}>✕</button>
            </div>

            <img
              src={activeProfile.profileImage}
              style={{ width: "100%", borderRadius: 8 }}
              alt=""
            />

            <h3>{activeProfile.firstName} {activeProfile.lastName}</h3>
            <p>{activeProfile.age} yrs • {activeProfile.city}</p>
            <p><b>Gender:</b> {activeProfile.gender}</p>
            <p><b>Education:</b> {activeProfile.education}</p>
            <p><b>Occupation:</b> {activeProfile.occupation}</p>

            <button className="mm-message-btn">Message</button>
          </div>
        </>
      )}
    </div>
  );
};