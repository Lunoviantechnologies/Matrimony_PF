import React, { useEffect, useState } from "react";
import "../styleSheets/requestCSS/profileRequest.css";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axiosInstance";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";

const Rejected = () => {

  const [rejectedRequests, setRejectedRequests] = useState([]);
  const { id, myProfile } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const maskName = (name = "") => {
  if (!name) return "-";
  return name.charAt(0).toUpperCase() + "*****";
};

const getDisplayName = (name) => {
  if (myProfile?.premium) return name || "-";
  return maskName(name);
};
  useEffect( () => {
    dispatch(fetchMyProfile(id));
  }, [id])

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

  return (
    <div className="received-container">
      {
        rejectedRequests.length === 0 ? (
          <p className="no-requests-message">No rejected requests</p>
        ) : (
          rejectedRequests.map((user) => (
            <div className="received-card" key={user.requestId}>

              <div className="left-section">
                <div className="img-box">
                  <img src={user.image} alt="profile"
                    className={`profile-img ${!myProfile?.premium ? "blur-image" : ""}`}
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
