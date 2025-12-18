import React, { useEffect, useState } from "react";
import "../styleSheets/profileCard.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfiles } from "../redux/thunk/profileThunk";
import axios from "axios";
import backendIP from "../api/api";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import ViewProfileModal from "../components/ViewProfileModal";
import { useNavigate } from "react-router-dom";

const MyMatches = () => {
  const navigate = useNavigate();
  const { profiles } = useSelector((state) => state.profiles);
  const { id, myProfile } = useSelector((state) => state.auth);

  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [acceptedList, setAcceptedList] = useState([]);
  const [rejectedList, setRejectedList] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [anchorRect, setAnchorRect] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserProfiles());
    dispatch(fetchMyProfile(id));

    // 1️⃣ Sent Requests
    axios.get(`${backendIP}/friends/sent/${id}`)
      .then(res => setSentRequests(res.data))
      .catch(err => console.error(err));

    // 2️⃣ Received Requests
    axios.get(`${backendIP}/friends/received/${id}`)
      .then(res => setReceivedRequests(res.data))
      .catch(err => console.error(err));

    // 3️⃣ Accepted Requests
    const fetchAcceptedRequests = async () => {
      try {
        const receivedAccepted = await axios.get(`${backendIP}/friends/accepted/received/${id}`);
        const sentAccepted = await axios.get(`${backendIP}/friends/accepted/sent/${id}`);
        setAcceptedList([...receivedAccepted.data, ...sentAccepted.data]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAcceptedRequests();

    // 4️⃣ Rejected Requests
    const fetchRejectedRequests = async () => {
      try {
        const receivedRejected = await axios.get(`${backendIP}/friends/rejected/received/${id}`);
        const sentRejected = await axios.get(`${backendIP}/friends/rejected/sent/${id}`);
        setRejectedList([...receivedRejected.data, ...sentRejected.data]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRejectedRequests();
  }, [dispatch, id]);

  const handleSendRequest = (receiverId) => {
    axios.post(`${backendIP}/friends/send/${id}/${receiverId}`)
      .then(() => {
        setSentRequests(prev => [...prev, { senderId: id, receiverId }]);
      })
      .catch(err => console.error(err));
  };

  // ---- Convert lists to ID arrays ----
  const sentIds = sentRequests.map(r => r.receiverId);
  const receivedIds = receivedRequests.map(r => r.senderId);
  const acceptedIds = acceptedList.map(r => r.receiverId === id ? r.senderId : r.receiverId);
  const rejectedIds = rejectedList.map(r => r.receiverId === id ? r.senderId : r.receiverId);

  const allHiddenIds = [...sentIds, ...receivedIds, ...acceptedIds, ...rejectedIds];

  // ---- Filter profiles ----
  const filteredProfiles = profiles
    .filter(p => p.id !== id)
    .filter(p => p.gender !== myProfile?.gender)
    .filter(p => !allHiddenIds.includes(p.id));

  const getImageUrl = (photo, gender) => {
    if (!photo) {
      return gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png";
    }

    if (photo.startsWith("blob:") || photo.startsWith("http")) {
      return photo;
    }

    // filename from backend → /uploads/
    return `${backendIP.replace("/api", "")}/profile-photos/${photo}`;
  };

  return (
    <div className="profile-main-container">
      <h2 className="profile-title">Top Matches For You</h2>

      <div className="profile-cards-wrapper">
        {filteredProfiles.map((p) => {
          const isSent = sentIds.includes(p.id);

          return (
            <article className="profile-card" key={p.id}>
              <div className="image-box">
                <img src={getImageUrl(p.updatePhoto, p.gender)}
                  alt={`${p.firstName} ${p.lastName}`}
                  className={`profile-img ${!myProfile?.premium ? "blur-image" : ""}`}
                  onError={(e) => {
                    e.target.src = p.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png";
                  }}
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
        })}
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

export default MyMatches;