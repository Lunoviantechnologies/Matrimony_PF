import React, { useEffect, useMemo, useState } from "react";
import "../styleSheets/requests/profileRequest.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfiles } from "../redux/thunk/profileThunk";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import ViewProfileModal from "../components/ViewProfileModal";

const Received = () => {

  const { id, role, myProfile } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { profiles } = useSelector(state => state.profiles);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

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
    api.get(`/friends/received/${id}`).then((response) => {
      console.log("Received requests:", response.data);
      setReceivedRequests(response.data);
    }).catch((error) => {
      console.error("Error fetching received requests:", error);
    });
  }, []);

  const handleAccept = async (requestId) => {
    try {
      const response = await api.post(`/friends/respond/${requestId}?accept=true`);
      console.log("Request accepted:", response.data);
      toast.success("Request accepted successfully");
      setReceivedRequests(receivedRequests.filter(req => req.requestId !== requestId));
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Failed to accept request");
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await api.post(`/friends/respond/${requestId}?accept=false`);
      console.log("Request rejected:", response.data);
      toast.success("Request rejected successfully");
      setReceivedRequests(receivedRequests.filter(req => req.requestId !== requestId));
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject request");
    }
  };

  useEffect(() => {
    if (role[0].toUpperCase() === "USER") {
      dispatch(fetchUserProfiles());
    };
  }, [dispatch, role]);

  const receivedWithImages = useMemo(() => {
    if (!receivedRequests.length || !profiles.length) return [];

    return receivedRequests.map(req => {
      const otherUserId = req.senderId === id ? req.receiverId : req.senderId;
      const profile = profiles.find(p => p.id === otherUserId);

      return {
        ...req,
        profile,
        hideProfilePhoto: profile.hideProfilePhoto,
        image: profile?.updatePhoto ? profile.updatePhoto : profile?.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png",
      };
    });
  }, [receivedRequests, profiles, id]);

  console.log("receivedWithImages: ", receivedWithImages);

  const handleProfile = (user) => {
    // console.log("user: ", user);
    setSelectedProfile(user.profile)
    setShowModal(true);
  };

  return (
    <div className="received-container">
      {
        receivedWithImages.length === 0 ? (
          <p className="no-requests-message">No received requests</p>
        ) : (
          receivedWithImages.map((user) => (
            <div className="received-card" key={user.requestId}>
              <div className="left-section">
                <div className="img-box">
                  <img src={user.image} alt="profile"
                    className={`profile-img ${user?.hideProfilePhoto ? "blur-image" : ""}`}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>

                <div className="text-section">
                  <h3 className="name">
                    {getDisplayName(user.senderName)}
                  </h3>
                </div>
              </div>

              <div className="btn-section">
                <button className="accept" onClick={() => handleProfile(user)} >
                  View Profile
                </button>
                <button className="accept" onClick={() => { handleAccept(user.requestId) }}>Accept</button>
                <button className="reject" onClick={() => { handleReject(user.requestId) }}>Reject</button>
              </div>
            </div>
          ))
        )
      }

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

export default Received;