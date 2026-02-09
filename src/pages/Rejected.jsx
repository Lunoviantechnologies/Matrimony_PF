import React, { useEffect, useMemo, useState } from "react";
import "../styleSheets/requests/profileRequest.css";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axiosInstance";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import { fetchUserProfiles } from "../redux/thunk/profileThunk";

const Rejected = () => {

  const [rejectedRequests, setRejectedRequests] = useState([]);
  const { id, myProfile, role } = useSelector(state => state.auth);
  const { profiles } = useSelector(state => state.profiles);
  const dispatch = useDispatch();
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

    if (role[0].toUpperCase() === "USER") {
      dispatch(fetchUserProfiles());
    };
  }, [id, dispatch, role]);

  useEffect(() => {
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

  const receivedWithImages = useMemo(() => {
    if (!rejectedRequests.length || !profiles.length) return [];

    return rejectedRequests.map(req => {
      const otherUserId = req.senderId === id ? req.receiverId : req.senderId;
      const profile = profiles.find(p => p.id === otherUserId);

      return {
        ...req,
        hideProfilePhoto: profile.hideProfilePhoto,
        image: profile?.updatePhoto ? profile.updatePhoto : profile?.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png",
      };
    });
  }, [rejectedRequests, profiles, id]);

  return (
    <div className="received-container">
      {
        receivedWithImages.length === 0 ? (
          <p className="no-requests-message">No rejected requests</p>
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
                    {getDisplayName(
                      user.senderId === id ? user.receiverName : user.senderName
                    )}
                  </h3>
                  <p className="details" style={{ color: "#d62828", fontWeight: 600 }}>
                    {user.senderId === id ? "They rejected your request" : "You rejected their request"}
                  </p>
                </div>
              </div>

              <div className="btn-section">
                <button className="accept" disabled>Denied</button>
              </div>

            </div>
          ))
        )
      }
    </div>
  );
};

export default Rejected;
