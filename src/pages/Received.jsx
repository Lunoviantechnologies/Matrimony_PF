import React, { useEffect, useMemo, useState } from "react";
import "../styleSheets/requestCSS/profileRequest.css"
import axios from "axios";
import backendIP from "../api/api";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfiles } from "../redux/thunk/profileThunk";
import api from "../api/axiosInstance";

const Received = () => {

  const { id } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { profiles } = useSelector(state => state.profiles);
  const [receivedRequests, setReceivedRequests] = useState([]);

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
      alert("Request accepted successfully");
      setReceivedRequests(receivedRequests.filter(req => req.requestId !== requestId));
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await api.post(`/friends/respond/${requestId}?accept=false`);
      console.log("Request rejected:", response.data);
      alert("Request rejected successfully");
      setReceivedRequests(receivedRequests.filter(req => req.requestId !== requestId));
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  useEffect(() => {
    dispatch(fetchUserProfiles());
  }, [dispatch]);

  const receivedWithImages = useMemo(() => {
    if (!receivedRequests.length || !profiles.length) return [];

    return receivedRequests.map(req => {
      const otherUserId =
        req.senderId === id ? req.receiverId : req.senderId;

      const profile = profiles.find(p => p.id === otherUserId);

      return {
        ...req,
        image: profile?.updatePhoto ? `${backendIP.replace("/api", "")}/profile-photos/${profile.updatePhoto}` : "/default-user.png",
      };
    });
  }, [receivedRequests, profiles, id]);

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
                  <img src={user.image} alt="profile" className="profile-img" />
                </div>

                <div className="text-section">
                  <h3 className="name">{user.senderName}</h3>
                </div>
              </div>

              <div className="btn-section">
                <button className="accept" onClick={() => { handleAccept(user.requestId) }}>Accept</button>
                <button className="reject" onClick={() => { handleReject(user.requestId) }}>Reject</button>
              </div>
            </div>
          ))
        )
      }
    </div>
  );
};

export default Received;