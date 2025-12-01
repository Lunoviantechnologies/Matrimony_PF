import React, { useEffect, useState } from "react";
import "../styleSheets/requestCSS/profileRequest.css"
import axios from "axios";
import backendIP from "../api/api";
import { useSelector } from "react-redux";

const Received = () => {

  const { id } = useSelector(state => state.auth);
  const [receivedRequests, setReceivedRequests] = useState([]);

  useEffect(() => {
    axios.get(`${backendIP}/friends/received/${id}`).then((response) => {
      console.log("Received requests:", response.data);
      setReceivedRequests(response.data);
    }).catch((error) => {
      console.error("Error fetching received requests:", error);
    });
  }, []);

  const handleAccept = async (requestId) => {
    try {
      const response = await axios.post(`${backendIP}/friends/respond/${requestId}?accept=true`);
      console.log("Request accepted:", response.data);
      alert("Request accepted successfully");
      setReceivedRequests(receivedRequests.filter(req => req.requestId !== requestId));
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await axios.post(`${backendIP}/friends/respond/${requestId}?accept=false`);
      console.log("Request rejected:", response.data);
      alert("Request rejected successfully");
      setReceivedRequests(receivedRequests.filter(req => req.requestId !== requestId));
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <div className="received-container">
      {
        receivedRequests.length === 0 ? (
          <p className="no-requests-message">No received requests</p>
        ) : (
          receivedRequests.map((user) => (
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