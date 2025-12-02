import React, { useEffect, useState } from "react";
import "../styleSheets/requestCSS/profileRequest.css";
import axios from "axios";
import backendIP from "../api/api";
import { useSelector } from "react-redux";

const Rejected = () => {

  const [rejectedRequests, setRejectedRequests] = useState([]);
  const { id } = useSelector(state => state.auth);

  useEffect(() => {
    axios.get(`${backendIP}/friends/rejected`).then((response) => {
      console.log("Rejected requests:", response.data);
      setRejectedRequests(response.data);
    }).catch((error) => {
      console.error("Error fetching rejected requests:", error);
    });
  }, []);

  return (
    <div className="received-container">
      {
        rejectedRequests.length === 0 ? (
          <p className="no-requests-message">No rejected requests</p>
        ) : (
          rejectedRequests
            .filter(user => Number(user.receiverId) === Number(id))
            .map((user) => (
              <div className="received-card" key={user.requestId}>

                <div className="left-section">
                  <div className="img-box">
                    <img src={user.image} alt="profile" className="profile-img" />
                  </div>

                  <div className="text-section">
                    <h3 className="name">{user.senderName}</h3>
                    <p className="details" style={{ color: "#d62828", fontWeight: 600 }}>
                      Rejected
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
