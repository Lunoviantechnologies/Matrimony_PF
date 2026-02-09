import React, { useEffect, useMemo, useState } from "react";
import "../styleSheets/requests/profileRequest.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserProfiles } from "../redux/thunk/profileThunk";
import api from "../api/axiosInstance";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import ViewProfileModal from "../components/ViewProfileModal";

const Accepted = () => {
  const [acceptedRequests, setAcceptedRequests] = useState([]);

  const { id, role, myProfile } = useSelector(state => state.auth);
  const { profiles } = useSelector(state => state.profiles);
  const [showModal, setShowModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  // console.log("User ID in Accepted component:", profiles);
  const maskName = (name = "") => {
    if (!name) return "-";
    return name.charAt(0).toUpperCase() + "*****";
  };

  const getDisplayName = (name) => {
    if (myProfile?.premium) return name || "-";
    return maskName(name);
  };
  useEffect(() => {
    dispatch(fetchMyProfile(id));
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

  const acceptedWithImages = useMemo(() => {
    if (!acceptedRequests.length || !profiles.length) return [];

    return acceptedRequests.map(req => {
      const otherUserId = req.senderId === id ? req.receiverId : req.senderId;
      const profile = profiles.find(p => p.id === otherUserId);
      return {
        ...req,
        profile,
        hideProfilePhoto: profile.hideProfilePhoto,
        image: profile?.updatePhoto ? profile.updatePhoto : profile?.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png",
      };
    });
  }, [acceptedRequests, profiles, id]);

  // console.log("acceptedWithImages : ", acceptedRequests);
  // console.log("selectedP: ", selectedProfile);

  const handleProfile = (user) => {
    // console.log("user: ", user);
    setSelectedProfile(user.profile)
    setShowModal(true);
  };

  return (
    <div className="received-container">
      {acceptedWithImages.length === 0 ? (
        <p className="no-requests-message">No accepted requests</p>
      ) : (
        acceptedWithImages.map(user => (
          <div className="received-card" key={user.requestId}>
            <div className="left-section">
              <div className="img-box">
                <img src={user.image} alt="profile"
                  className={`profile-img ${user?.hideProfilePhoto ? "blur-image" : ""}`}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onError={(e) => {
                    e.target.src = "/default-user.png";
                  }}
                />
              </div>

              <div className="text-section">
                <h3 className="name">
                  {getDisplayName(
                    user.senderId === id ? user.receiverName : user.senderName
                  )}
                </h3>

                <p className="request-status">
                  {user.senderId === id ? "They accepted your request" : "You accepted their request"}
                </p>
              </div>
            </div>

            <div className="btn-section">
              <button
                className="accept"
                onClick={() => navigate(`/dashboard/messages/${user.senderId === id ? user.receiverId : user.senderId}`)}
              >
                Message
              </button>

              <button className="accept" onClick={() => handleProfile(user)} >
                View Profile
              </button>
            </div>
          </div>
        ))
      )}

      {showModal && selectedProfile && (
        <ViewProfileModal
          premium={myProfile.premium}
          profile={selectedProfile}
          // anchorRect={anchorRect}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Accepted;