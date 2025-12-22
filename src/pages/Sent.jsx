import React, { useEffect, useMemo, useState } from "react";
import "../styleSheets/requestCSS/profileRequest.css";
import backendIP from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfiles } from "../redux/thunk/profileThunk";
import api from "../api/axiosInstance";

const SentRequests = () => {

  const [sentRequests, setSentRequests] = useState([]);
  const { id } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { profiles } = useSelector(state => state.profiles);

  useEffect(() => {
    api.get(`/friends/sent/${id}`).then((response) => {
      console.log("Sent requests:", response.data);
      setSentRequests(response.data);
    }).catch((error) => {
      console.error("Error fetching received requests:", error);
    });
  }, []);

  const handleCancelRequest = async (cancelRequestId) => {
    try {
      const response = await api.delete(`/friends/sent/delete/${cancelRequestId}`);
      console.log("Request cancelled:", response.data);
      setSentRequests(sentRequests.filter(req => req.requestId !== cancelRequestId));
      alert("Request cancelled successfully");
    } catch (error) {
      console.error("Error cancelling request:", error);
    };
  };

  const filteredSent = sentRequests.filter(req => req?.status?.toLowerCase() === "pending");
  console.log("Filtered Sent Requests:", filteredSent);

  useEffect(() => {
    dispatch(fetchUserProfiles());
  }, [dispatch]);

  const sentWithImages = useMemo(() => {
    if (!filteredSent.length || !profiles.length) return [];

    return filteredSent.map(req => {
      const otherUserId = req.senderId === id ? req.receiverId : req.senderId;

      const profile = profiles.find(p => p.id === otherUserId);

      return {
        ...req,
        image: profile?.updatePhoto ? `${backendIP.replace("/api", "")}/profile-photos/${profile.updatePhoto}` : "/default-user.png",
      };
    });
  }, [filteredSent, profiles, id]);

  return (
    <div className="received-container">
      {
        sentWithImages.length === 0 ? (
          <p className="no-requests-message">No sent requests</p>
        ) : (
          sentWithImages.map((user) => (
            <div className="received-card" key={user.requestId}>

              <div className="left-section">
                <div className="img-box">
                  <img src={user.image} alt="profile" className="profile-img" />
                </div>

                <div className="text-section">
                  <h3 className="name">{user.receiverName}</h3>
                </div>
              </div>

              <div className="btn-section">
                <button className="reject" onClick={() => { handleCancelRequest(user.requestId) }}>Cancel</button>
              </div>

            </div>
          ))
        )
      }
    </div>
  );
};

export default SentRequests;
