import React, { useEffect, useState } from "react";
import "../styleSheets/requestCSS/profileRequest.css";
import axios from "axios";
import backendIP from "../api/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Accepted = () => {
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const { id } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAcceptedRequests = async () => {
      try {
        // 1) Requests YOU accepted (receiver = you)
        const receivedAccepted = await axios.get(`${backendIP}/friends/accepted/received/${id}`);

        // 2) Requests THEY accepted (sender = you)
        const sentAccepted = await axios.get(`${backendIP}/friends/accepted/sent/${id}`);

        // Combine both
        const merged = [...receivedAccepted.data, ...sentAccepted.data];
        setAcceptedRequests(merged);

        console.log("Accepted requests:", merged);
      } catch (error) {
        console.error("Error fetching accepted requests:", error);
      }
    };

    fetchAcceptedRequests();
  }, [id]);

  return (
    <div className="received-container">
      {acceptedRequests.length === 0 ? (
        <p className="no-requests-message">No accepted requests</p>
      ) : (
        acceptedRequests.map((user) => (
          <div className="received-card" key={user.requestId}>

            <div className="left-section">
              <div className="img-box">
                <img src={user.image || "/default-user.png"} alt="profile" className="profile-img"/>
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
                onClick={() => navigate(`/dashboard/messages/${user.senderId === id ? user.receiverId : user.senderId }`)}
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