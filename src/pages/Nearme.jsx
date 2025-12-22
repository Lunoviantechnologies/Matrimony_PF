import React, { useEffect, useState, useMemo } from "react";
import "../styleSheets/profileCard.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfiles } from "../redux/thunk/profileThunk";
import axios from "axios";
import backendIP from "../api/api";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import ViewProfileModal from "../components/ViewProfileModal";
import { useOutletContext, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

const Nearme = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { profiles } = useSelector((state) => state.profiles);
  const { id, myProfile } = useSelector((state) => state.auth);
  const { filters } = useOutletContext();

  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [acceptedList, setAcceptedList] = useState([]);
  const [rejectedList, setRejectedList] = useState([]);

  const [anchorRect, setAnchorRect] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfiles());
    dispatch(fetchMyProfile(id));

    api.get(`/friends/sent/${id}`)
      .then(res => setSentRequests(res.data))
      .catch(err => console.error(err));

    api.get(`/friends/received/${id}`)
      .then(res => setReceivedRequests(res.data))
      .catch(err => console.error(err));

    const fetchAcceptedRequests = async () => {
      try {
        const receivedAccepted = await api.get(`/friends/accepted/received/${id}`);
        const sentAccepted = await api.get(`/friends/accepted/sent/${id}`);
        setAcceptedList([...receivedAccepted.data, ...sentAccepted.data]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAcceptedRequests();

    const fetchRejectedRequests = async () => {
      try {
        const receivedRejected = await api.get(`/friends/rejected/received/${id}`);
        const sentRejected = await api.get(`/friends/rejected/sent/${id}`);
        setRejectedList([...receivedRejected.data, ...sentRejected.data]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRejectedRequests();
  }, [dispatch, id]);

  // ---- Combine all hidden IDs ----
  const sentIds = sentRequests.map(r => r.receiverId);
  const receivedIds = receivedRequests.map(r => r.senderId);
  const acceptedIds = acceptedList.map(r => r.receiverId === id ? r.senderId : r.receiverId);
  const rejectedIds = rejectedList.map(r => r.receiverId === id ? r.senderId : r.receiverId);

  const allHiddenIds = [...sentIds, ...receivedIds, ...acceptedIds, ...rejectedIds];

  const handleSendRequest = (receiverId) => {
    api.post(`/friends/send/${id}/${receiverId}`)
      .then(() => {
        alert("Request sent successfully");
        setSentRequests(prev => [...prev, { senderId: id, receiverId }]);
      })
      .catch(err => console.error(err));
  };

  // Helper to calculate age from dateOfBirth
  const getAge = (dob) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    return Math.floor(ageDifMs / (365.25 * 24 * 60 * 60 * 1000));
  };

  // ---- Filter profiles ----
  const filteredProfiles = useMemo(() => {
    return profiles
      .filter(p => p.id !== id)
      .filter(p => p.gender !== myProfile?.gender)
      .filter(p => !allHiddenIds.includes(p.id))
      .filter(p => p.city === myProfile?.city)
      .filter(p => {
        const age = getAge(p.dateOfBirth);

        const matchAge = !filters.age.length || filters.age.some(range => {
          const [min, max] = range.split("-").map(Number);
          return age >= min && age <= max;
        });

        const matchReligion = !filters.religion.length || filters.religion.includes(p.religion || "");
        const matchCaste = !filters.caste.length || filters.caste.includes(p.subCaste || "");
        const matchCountry = !filters.country.length || filters.country.includes(p.country || "");
        const matchEducation = !filters.education.length || filters.education.includes(p.highestEducation || "");
        const matchProfession = !filters.profession.length || filters.profession.includes(p.occupation || "");
        const matchLifestyle = !filters.lifestyle.length || (p.yourHobbies ? filters.lifestyle.some(f => p.yourHobbies.includes(f)) : false);

        return matchAge && matchReligion && matchCaste && matchCountry && matchEducation && matchProfession && matchLifestyle;
      });
  }, [profiles, filters, allHiddenIds, myProfile, id]);

  return (
    <div className="profile-main-container">
      <h2 className="profile-title">Near Matches For You</h2>

      <div className="profile-cards-wrapper">
        {
          filteredProfiles.length === 0 ? (
            <p className="empty-state">No profiles found matching your criteria.</p>
          ) : (
            filteredProfiles.map((p) => {
              const isSent = sentIds.includes(p.id);
              return (
                <article className="profile-card" key={p.id}>
                  <div className="image-box">
                    <img src={p.updatePhoto ? p.updatePhoto : p.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png"}
                      alt={`${p.firstName} ${p.lastName}`}
                      className={`profile-img ${!myProfile?.premium ? "blur-image" : ""}`}
                      onError={(e) => {
                        e.target.src = p.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png";
                      }}
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                    />

                    {!myProfile?.premium && (
                      <div className="premium-overlay" onClick={() => navigate("/premium")}>
                        🔒 Upgrade to Premium
                      </div>
                    )}
                  </div>

                  <div className="profile-details">
                    <h3 className="name">{p.firstName + " " + p.lastName}</h3>
                    <span className="meta">{p.age} yrs • {p.height}</span>
                    <p className="line">{p.occupation} • {p.highestEducation}</p>
                    <p className="line">{p.city}</p>
                    <p className="line">{p.religion} | {p.subCaste}</p>

                    <div className="btn-row">
                      <button
                        className="btn btn-view"
                        onClick={(e) => {
                          setSelectedProfile(p);
                          setAnchorRect(e.target.getBoundingClientRect());
                          setShowModal(true);
                        }}
                      >
                        View Profile
                      </button>

                      <button
                        className={`btn ${isSent ? "btn-sent" : "btn-send"}`}
                        disabled={isSent}
                        onClick={() => handleSendRequest(p.id)}
                      >
                        {isSent ? "Sent" : "Send Request"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )
        }
      </div>

      {showModal && (
        <ViewProfileModal
          profile={selectedProfile}
          anchorRect={anchorRect}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Nearme;