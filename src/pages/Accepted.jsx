import React, { useEffect, useState } from "react";
import "../styleSheets/requestCSS/profileRequest.css";
import axios from "axios";
import backendIP from "../api/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Accepted = () => {

  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const { id } = useSelector( state => state.auth);
  const navigate = useNavigate();

  // console.log("User ID:", id);

  useEffect(() => {
    axios.get(`${backendIP}/friends/accepted`).then((response) => {
      console.log("Accepted requests:", response.data);
      setAcceptedRequests(response.data);
    }).catch((error) => {
      console.error("Error fetching accepted requests:", error);
    });
  }, []);

  return (
    <div className="received-container">
      {
        acceptedRequests.length === 0 ? (
          <p className="no-requests-message">No accepted requests</p>
        ) : (
          acceptedRequests
            .filter( user => Number(user.receiverId) === Number(id))
            .map((user) => (
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
                  <button className="accept" onClick={ () => navigate(`/dashboard/messages/${user.senderId}`) }>Message</button>
                </div>

              </div>
            ))
        )
      }
    </div>
  );
};

export default Accepted;
