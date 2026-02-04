import React, { useEffect, useMemo, useState } from "react";
import "../styleSheets/requestCSS/profileRequest.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserProfiles } from "../redux/thunk/profileThunk";
import api from "../api/axiosInstance";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";

const Accepted = () => {
  const [acceptedRequests, setAcceptedRequests] = useState([]);

  const { id, role, myProfile } = useSelector(state => state.auth);
  const { profiles } = useSelector(state => state.profiles);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // console.log("User ID in Accepted component:", profiles);

  useEffect( () => {
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
      const otherUserId =
        req.senderId === id ? req.receiverId : req.senderId;

      const profile = profiles.find(p => p.id === otherUserId);

      return {
        ...req,
        image: profile?.updatePhoto ? profile.updatePhoto : profile?.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png",
      };
    });
  }, [acceptedRequests, profiles, id]);

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
                  className={`profile-img ${!myProfile?.premium ? "blur-image" : ""}`}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onError={(e) => {
                    e.target.src = "/default-user.png";
                  }}
                />
              </div>

              <div className="text-section">
                <h3 className="name">
                  {user.senderId === id ? user.receiverName : user.senderName}
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
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Accepted;