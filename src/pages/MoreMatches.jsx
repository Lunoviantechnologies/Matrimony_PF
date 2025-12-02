import React, { useEffect, useState } from "react";
import "../styleSheets/profileCard.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfiles } from "../redux/thunk/profileThunk";
import axios from "axios";
import backendIP from "../api/api";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";

const MoreMatches = () => {

  const { profiles, loading, error } = useSelector((state) => state.profiles);
  const { id, myProfile } = useSelector((state) => state.auth);
  const [SentRequests, setSentRequests] = useState([]);
  const dispatch = useDispatch();

  console.log("Profiles from Redux:", profiles);

  useEffect(() => {
    dispatch(fetchUserProfiles());
    dispatch(fetchMyProfile(id));

    axios
      .get(`${backendIP}/friends/sent/${id}`)
      .then((response) => {
        console.log("Sent requests:", response.data);
        setSentRequests(response.data); // array of objects
      })
      .catch((error) => {
        console.error("Error fetching sent requests:", error);
      });
  }, [dispatch, id]);

  const handleSendRequest = (receiverId) => {
    axios.post(`${backendIP}/friends/send/${id}/${receiverId}`).then((response) => {
      console.log("Request sent successfully:", response.data);
      alert("Request sent successfully");
    }).catch((error) => {
      console.error("Error sending request:", error);
    });
  };

  const sentReceiverIds = SentRequests.map((req) => req.receiverId);

  return (
    <div className="profile-main-container">
      <h2 className="profile-title">More Matches For You</h2>

      <div className="profile-cards-wrapper">
        {
          profiles
            .filter(p => p.id !== id)
            .filter(p => p.gender !== myProfile?.gender)
            .map((p) => (
              <article className="profile-card" key={p.id}>
                <div className="image-box">
                  <img src={p.image ? p.image : (p.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png")} alt={p.name} className="profile-img" />
                </div>

                <div className="profile-details">
                  <h3 className="name">{p.firstName + ' ' + p.lastName}</h3>
                  <span className="meta">{p.age} yrs • {p.height}</span>
                  <p className="line">{p.occupation} • {p.highestEducation}</p>
                  <p className="line">{p.city}</p>
                  <p className="line">{p.religion} | {p.subCaste} </p>

                  <div className="btn-row">
                    <button className="btn btn-view">View Profile</button>

                    <button
                      className={`btn ${sentReceiverIds.includes(p.id) ? "btn-sent" : "btn-send"}`}
                      disabled={sentReceiverIds.includes(p.id)}
                      onClick={() => handleSendRequest(p.id)}
                    >
                      {sentReceiverIds.includes(p.id) ? "Sent" : "Send Request"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
      </div>
    </div>
  );
};

export default MoreMatches;