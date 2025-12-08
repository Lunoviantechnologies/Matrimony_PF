import React, { useEffect, useState } from "react";
import "../styleSheets/requestCSS/profileRequest.css";
import axios from "axios";
import backendIP from "../api/api";
import { useSelector } from "react-redux";

const SentRequests = () => {

  const [SentRequests, setSentRequests] = useState([]);
  const { id } = useSelector(state => state.auth);

  useEffect(() => {
    axios.get(`${backendIP}/friends/sent/${id}`).then((response) => {
      console.log("Sent requests:", response.data);
      setSentRequests(response.data);
    }).catch((error) => {
      console.error("Error fetching received requests:", error);
    });
  }, []);

  const handleCancelRequest = async (cancelRequestId) => {
    try {
      const response = await axios.delete(`${backendIP}/friends/sent/delete/${cancelRequestId}`);
      console.log("Request cancelled:", response.data);
      setSentRequests(SentRequests.filter(req => req.requestId !== cancelRequestId));
      alert("Request cancelled successfully");
    } catch (error) {
      console.error("Error cancelling request:", error);
    };
  };

  const filteredSent = SentRequests.filter(req => req?.status?.toLowerCase() === "pending");

  return (
    <div className="received-container">
      {
        filteredSent.length === 0 ? (
          <p className="no-requests-message">No sent requests</p>
        ) : (
          filteredSent.map((user) => (
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
