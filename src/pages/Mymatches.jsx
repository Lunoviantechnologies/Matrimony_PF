import React, { useEffect, useState, useMemo } from "react";
import "../styleSheets/ProfileCard.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfiles } from "../redux/thunk/profileThunk";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import ViewProfileModal from "../components/ViewProfileModal";
import { useOutletContext, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { FaCrown, FaUser } from "react-icons/fa";
import { MatchCalculation } from "../utils/MatchCalculation";
import { toast } from "react-toastify";

const MyMatches = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { profiles } = useSelector((state) => state.profiles);
  const { id, myProfile, role } = useSelector((state) => state.auth);
  const { filters, sortBy } = useOutletContext();
const maskName = (name = "") => {
  if (!name) return "-";
  return name.charAt(0).toUpperCase() + "*****";
};

const getDisplayName = (first, last) => {
  if (myProfile?.premium) {
    return `${first || ""} ${last || ""}`.trim();   // ✅ full name
  }

  return `${maskName(first)} ${maskName(last)}`.trim(); // ✅ masked
};
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [acceptedList, setAcceptedList] = useState([]);
  const [rejectedList, setRejectedList] = useState([]);

  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [anchorRect, setAnchorRect] = useState(null);

  useEffect(() => {
    if (role[0].toUpperCase() === "USER") {
      dispatch(fetchUserProfiles());
    };
    dispatch(fetchMyProfile(id));

    // 1️⃣ Sent Requests
    api.get(`/friends/sent/${id}`)
      .then(res => setSentRequests(res.data))
      .catch(err => console.error(err));

    // 2️⃣ Received Requests
    api.get(`/friends/received/${id}`)
      .then(res => setReceivedRequests(res.data))
      .catch(err => console.error(err));

    // 3️⃣ Accepted Requests
    const fetchAcceptedRequests = async () => {
      try {
        const receivedAccepted = await api.get(`/friends/accepted/received/${id}`);
        const sentAccepted = await api.get(`/friends/accepted/sent/${id}`);
        setAcceptedList([...receivedAccepted.data, ...sentAccepted.data]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAcceptedRequests();

    // 4️⃣ Rejected Requests
    const fetchRejectedRequests = async () => {
      try {
        const receivedRejected = await api.get(`/friends/rejected/received/${id}`);
        const sentRejected = await api.get(`/friends/rejected/sent/${id}`);
        setRejectedList([...receivedRejected.data, ...sentRejected.data]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRejectedRequests();
  }, [dispatch, id, role]);

  const handleSendRequest = (receiverId) => {
    api.post(`/friends/send/${id}/${receiverId}`)
      .then(() => {
        toast.success("Request sent successfully");
        setSentRequests(prev => [...prev, { senderId: id, receiverId }]);
      })
      .catch(err => console.error(err));
  };

  // ---- Convert lists to ID arrays ----
  const sentIds = sentRequests.map(r => r.receiverId);
  const receivedIds = receivedRequests.map(r => r.senderId);
  const acceptedIds = acceptedList.map(r => r.receiverId === id ? r.senderId : r.receiverId);
  const rejectedIds = rejectedList.map(r => r.receiverId === id ? r.senderId : r.receiverId);

  const allHiddenIds = [...sentIds, ...receivedIds, ...acceptedIds, ...rejectedIds];

  // Helper to calculate age from dateOfBirth
  const getAge = (dob) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    return Math.floor(ageDifMs / (365.25 * 24 * 60 * 60 * 1000));
  };

  const matchWithOther = (selected, otherValue, profileValue) => {
    if (!selected.length) return true;

    if (selected.includes("Other")) {
      return (
        selected.includes(profileValue) ||
        profileValue?.toLowerCase() === otherValue?.toLowerCase()
      );
    }

    return selected.includes(profileValue);
  };

  // ---- Filter profiles ----
  const filteredProfiles = useMemo(() => {
    return profiles
      .filter(p => p.id !== id)
      .filter(p => p.gender !== myProfile?.gender)
      .filter(p => !allHiddenIds.includes(p.id))
      .filter(p => {
        const age = getAge(p.dateOfBirth);

        const matchAge = !filters.age.length || filters.age.some(range => {
          const [min, max] = range.split("-").map(Number);
          return age >= min && age <= max;
        });

          const matchprofileFor = !filters.profileFor.length || filters.profileFor.includes(p.profileFor || "");
        const matchMaritalStatus = !filters.maritalStatus.length || filters.maritalStatus.includes(p.maritalStatus || "");
        const matchReligion = matchWithOther(filters.religion, filters.otherValues?.religion, p.religion);
        const matchCaste = matchWithOther(filters.caste, filters.otherValues?.caste, p.subCaste);
        const matchCountry = matchWithOther(filters.country, filters.otherValues?.country, p.country);
        const matchProfession = matchWithOther(filters.profession, filters.otherValues?.profession, p.occupation);
        const matchEducation = matchWithOther(filters.education, filters.otherValues?.education, p.highestEducation);
        const matchLifestyle = !filters.lifestyle.length || filters.lifestyle.includes(p.vegiterian || "");
        const matchhabbits = !filters.habbits.length || filters.habbits.includes(p.habbits || "");

        const passedFilters =
          matchAge && matchMaritalStatus && matchReligion &&
          matchCaste && matchCountry && matchEducation &&
          matchProfession && matchLifestyle && matchprofileFor && matchhabbits;

        if (!passedFilters) return false;

        // ✅ MATCH % FILTER
        const matchPercent = MatchCalculation(myProfile, p);
        return matchPercent >= 70;
      });
  }, [profiles, filters, allHiddenIds, myProfile, id]);

  const sortedProfiles = useMemo(() => {
    let list = [...filteredProfiles];

    switch (sortBy) {

      case "relevance":
        return list.sort((a, b) =>  MatchCalculation(myProfile, b) -  MatchCalculation(myProfile, a));

      case "newest":
        return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      case "active":
        return list.sort((a, b) => new Date(b.lastActiveAt) - new Date(a.lastActiveAt));

      case "premium":
        return list.sort((a, b) => b.premium - a.premium);

      case "free":
        return list.sort((a, b) => a.premium - b.premium);

      default:
        return list;
    }
  }, [filteredProfiles, sortBy]);

  const handleProfileCount = (userId) => {
    api.post(`profiles/record/${userId}/${id}`).then(res => {
      console.log("count res : ", res.data);
    })
  };

  return (
    <div className="profile-main-container">
      <h2 className="profile-title">Top Matches For You</h2>

      <div className="profile-cards-wrapper">
        {sortedProfiles.map((p) => {
          const isSent = sentIds.includes(p.id);
          return (
            <article className="profile-card" key={p.id}>
              <div className="image-box">
                <img src={p.updatePhoto ? p.updatePhoto : p.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png"}
                  alt={`${p.firstName} ${p.lastName}`}
                  className={`profile-img ${!myProfile?.premium ? "blur-image" : ""}`}
                  onError={(e) => {
                    e.target.src = p.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png";
                  }}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />

                <div className="premium-badge">
                  {p.premium ? (
                    <span className="premium-icon"> <FaCrown /> </span>
                  ) : (
                    <span className="free-icon"> <FaUser /> free</span>
                  )}
                </div>

                {!myProfile?.premium && (
                  <div className="premium-overlay" onClick={() => navigate("/dashboard/premium")}>
                    🔒 Upgrade to Premium
                  </div>
                )}

                <div className="match-circle">
                  {MatchCalculation(myProfile, p)}%
                </div>
              </div>

              <div className="profile-details">
                <h3 className="name">{getDisplayName(p.firstName , p.lastName)}</h3>
                <span className="meta">{p.age} yrs • {p.height}</span>
                <p className="line">{p.occupation} • {p.highestEducation}</p>
                <p className="line">{p.city}</p>
                <p className="line">{p.religion} | {p.subCaste}</p>

                <div className="btn-row">
                  <button
                    className="btn btn-view"
                    onClick={(e) => {
                      handleProfileCount(p.id);
                      setSelectedProfile(p);
                      // setAnchorRect(e.target.getBoundingClientRect());
                      setShowModal(true);
                    }}
                  >
                    View Profile
                  </button>

                  <button
                    className={`btn ${isSent ? "btn-sent" : "btn-send"}`}
                    disabled={isSent}
                    onClick={() => handleSendRequest(p.id)}
                  >
                    {isSent ? "Sent" : "Send Request"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {showModal && (
        <ViewProfileModal
          premium={myProfile.premium}
          profile={selectedProfile}
          anchorRect={anchorRect}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default MyMatches;