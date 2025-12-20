import React, { useEffect, useState, useMemo } from "react";
import "../styleSheets/profileCard.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfiles } from "../redux/thunk/profileThunk";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import axios from "axios";
import backendIP from "../api/api";
import ViewProfileModal from "../components/ViewProfileModal";
import { useOutletContext, useNavigate } from "react-router-dom";

const NewMatches = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profiles } = useSelector((state) => state.profiles);
  const { id, myProfile } = useSelector((state) => state.auth);
  const { filters } = useOutletContext();

  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [acceptedList, setAcceptedList] = useState([]);
  const [rejectedList, setRejectedList] = useState([]);

  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [anchorRect, setAnchorRect] = useState(null);

  useEffect(() => {
    dispatch(fetchUserProfiles());
    dispatch(fetchMyProfile(id));

    axios.get(`${backendIP}/friends/sent/${id}`)
      .then(res => setSentRequests(res.data))
      .catch(err => console.error(err));

    axios.get(`${backendIP}/friends/received/${id}`)
      .then(res => setReceivedRequests(res.data))
      .catch(err => console.error(err));

    const fetchAccepted = async () => {
      try {
        const [receivedAccepted, sentAccepted] = await Promise.all([
          axios.get(`${backendIP}/friends/accepted/received/${id}`),
          axios.get(`${backendIP}/friends/accepted/sent/${id}`)
        ]);
        setAcceptedList([...receivedAccepted.data, ...sentAccepted.data]);
      } catch (err) { console.error(err); }
    };
    fetchAccepted();

    const fetchRejected = async () => {
      try {
        const [receivedRejected, sentRejected] = await Promise.all([
          axios.get(`${backendIP}/friends/rejected/received/${id}`),
          axios.get(`${backendIP}/friends/rejected/sent/${id}`)
        ]);
        setRejectedList([...receivedRejected.data, ...sentRejected.data]);
      } catch (err) { console.error(err); }
    };
    fetchRejected();
  }, [dispatch, id]);

  // Send friend request
  const handleSendRequest = (receiverId) => {
    axios.post(`${backendIP}/friends/send/${id}/${receiverId}`)
      .then(() => {
        alert("Request sent successfully");
        setSentRequests(prev => [...prev, { senderId: id, receiverId }]);
      })
      .catch(err => console.error("Error sending request:", err));
  };

  // Convert lists to ID arrays
  const sentIds = sentRequests.map(r => r.receiverId);
  const receivedIds = receivedRequests.map(r => r.senderId);
  const acceptedIds = acceptedList.map(r => r.receiverId === id ? r.senderId : r.receiverId);
  const rejectedIds = rejectedList.map(r => r.receiverId === id ? r.senderId : r.receiverId);

  const allHiddenIds = [...sentIds, ...receivedIds, ...acceptedIds, ...rejectedIds];

  // Helper to calculate age from dateOfBirth
  const getAge = (dob) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    return Math.floor(ageDifMs / (365.25 * 24 * 60 * 60 * 1000));
  };

  // Helper to get profile image
  const getImageUrl = (photo, gender) => {
    if (!photo) return gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png";
    if (photo.startsWith("blob:") || photo.startsWith("http")) return photo;
    return `${backendIP.replace("/api", "")}/profile-photos/${photo}`;
  };

  // Filtered profiles (friend request + sidebar filters)
  const filteredProfiles = useMemo(() => {
    return profiles
      .filter(p => p.id !== id)
      .filter(p => p.gender !== myProfile?.gender)
      .filter(p => !allHiddenIds.includes(p.id))
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
      <h2 className="profile-title">New Matches For You</h2>

      <div className="profile-cards-wrapper">
        {filteredProfiles.map((p) => {
          const isSent = sentIds.includes(p.id);

          return (
            <article className="profile-card" key={p.id}>
              <div className="image-box">
                <img
                  src={getImageUrl(p.updatePhoto, p.gender)}
                  alt={`${p.firstName || ""} ${p.lastName || ""}`}
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
                <h3 className="name">{p.firstName + " " + (p.lastName || "")}</h3>
                <span className="meta">{getAge(p.dateOfBirth)} yrs • {p.height || "-"}</span>
                <p className="line">{p.occupation || "-"} • {p.highestEducation || "-"}</p>
                <p className="line">{p.city || "-"}</p>
                <p className="line">{p.religion || "-"} | {p.subCaste || "-"}</p>

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
        })}

        {filteredProfiles.length === 0 && (
          <p className="no-profiles-msg">No profiles match your filters.</p>
        )}
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

export default NewMatches;