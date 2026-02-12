import React, { useEffect, useState, useMemo } from "react";
import "../styleSheets/ProfileCard.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfiles } from "../redux/thunk/profileThunk";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import ViewProfileModal from "../components/ViewProfileModal";
import { useOutletContext, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { FaCrown, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import MatchesImageCarousel from "./MatchesImageCarousel";

const Nearme = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { profiles } = useSelector((state) => state.profiles);
  const { id, myProfile, role } = useSelector((state) => state.auth);

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
  const { filters, sortBy } = useOutletContext();

  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [acceptedList, setAcceptedList] = useState([]);
  const [rejectedList, setRejectedList] = useState([]);
  const [requestsLoaded, setRequestsLoaded] = useState(false);

  const [anchorRect, setAnchorRect] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        if (role[0].toUpperCase() === "USER") {
          dispatch(fetchUserProfiles());
        }

        dispatch(fetchMyProfile(id));

        const sent = await api.get(`/friends/sent/${id}`);
        const received = await api.get(`/friends/received/${id}`);
        const receivedAccepted = await api.get(`/friends/accepted/received/${id}`);
        const sentAccepted = await api.get(`/friends/accepted/sent/${id}`);
        const receivedRejected = await api.get(`/friends/rejected/received/${id}`);
        const sentRejected = await api.get(`/friends/rejected/sent/${id}`);

        setSentRequests(sent.data);
        setReceivedRequests(received.data);
        setAcceptedList([...receivedAccepted.data, ...sentAccepted.data]);
        setRejectedList([...receivedRejected.data, ...sentRejected.data]);

        setRequestsLoaded(true);
      } catch (err) {
        console.error(err);
      }
    };

    loadRequests();
  }, [dispatch, id, role]);

  // ---- Combine all hidden IDs ----
  const sentIds = sentRequests.map(r => r.receiverId);
  const receivedIds = receivedRequests.map(r => r.senderId);
  const acceptedIds = acceptedList.map(r => r.receiverId === id ? r.senderId : r.receiverId);
  const rejectedIds = rejectedList.map(r => r.receiverId === id ? r.senderId : r.receiverId);

  const allHiddenIds = [...sentIds, ...receivedIds, ...acceptedIds, ...rejectedIds];

  const handleSendRequest = (receiverId) => {
    api.post(`/friends/send/${id}/${receiverId}`)
      .then(() => {
        toast.success("Request sent successfully");
        setSentRequests(prev => [...prev, { senderId: id, receiverId }]);
      })
      .catch(err => console.error(err));
  };

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

  const heightToInches = (height) => {
    if (!height) return null;

    const match = height.match(/(\d+)'(\d+)"/);
    if (!match) return null;

    const feet = parseInt(match[1]);
    const inches = parseInt(match[2]);

    return feet * 12 + inches;
  };

  // ---- Filter profiles ----
  const filteredProfiles = useMemo(() => {
    if (!requestsLoaded || !myProfile?.city) return [];

    return profiles
      .filter(p => p.id !== id)
      .filter(p => p.gender !== myProfile.gender)
      .filter(p => !allHiddenIds.includes(p.id))
      .filter(p => p.city === myProfile.city)
      .filter(p => {
        const age = getAge(p.dateOfBirth);
        const matchAge =
          !filters.age.length ||
          filters.age.some(range => {
            if (range.includes("+")) {
              const min = parseInt(range);
              return age >= min;
            }

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

        const selectedHeight = filters.otherValues?.height;
        const matchHeight = !selectedHeight || heightToInches(p.height) === heightToInches(selectedHeight);

        return (matchprofileFor && matchAge && matchMaritalStatus && matchReligion && matchCaste && matchCountry && matchEducation && matchProfession && matchLifestyle && matchhabbits && matchHeight);
      });
  }, [profiles, filters, allHiddenIds, myProfile, id, requestsLoaded]);

  const sortedProfiles = useMemo(() => {
    let list = [...filteredProfiles];

    switch (sortBy) {

      case "newest":
        return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      case "active":
        return list.sort((a, b) => new Date(b.lastActiveAt) - new Date(a.lastActiveAt));

      case "premium":
        return list.sort((a, b) => b.premium - a.premium);

      case "free":
        return list.sort((a, b) => a.premium - b.premium);

      default:
        return list; // relevance
    }
  }, [filteredProfiles, sortBy]);

  const handleProfileCount = (userId) => {
    api.post(`profiles/record/${userId}/${id}`).then(res => {
      console.log("count res : ", res.data);
    })
  };

  useEffect(() => {
    setPage(1);
  }, [sortedProfiles.length]);

  const totalPages = Math.ceil(sortedProfiles.length / PAGE_SIZE);
  const paginatedProfiles = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedProfiles.slice(start, start + PAGE_SIZE);
  }, [sortedProfiles, page]);

  const goPrev = () => {
    setPage(p => Math.max(1, p - 1));
  };
  const goNext = () => {
    setPage(p => Math.min(totalPages, p + 1));
  };

  return (
    <div className="profile-main-container">
      <h2 className="profile-title">Near Matches For You</h2>

      <div className="profile-cards-wrapper">
        {!requestsLoaded ? (
          <p>Loading nearby matches...</p>
        ) : sortedProfiles.length === 0 ? (
          <p className="empty-state"> No profiles found matching your criteria. </p>
        ) : (
          paginatedProfiles.map((p) => {
            const isSent = sentIds.includes(p.id);
            return (
              <article className="profile-card" key={p.id}>
                <div className="image-box">
                  <MatchesImageCarousel
                    profile={p}
                    isPremiumUser={myProfile?.premium}
                    onUpgrade={() => navigate("/dashboard/premium")}
                  />

                  <div className="premium-badge">
                    {p.premium ? (
                      <span className="premium-icon"><FaCrown /></span>
                    ) : (
                      <span className="free-icon"><FaUser /> free</span>
                    )}
                  </div>
                </div>

                <div className="profile-details">
                  <h3 className="name">{getDisplayName(p.firstName, p.lastName)}</h3>
                  <span className="meta">{p.age} yrs • {p.height} ft height</span>
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
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={goPrev} disabled={page === 1}>
            Prev
          </button>

          <span>{page}</span>

          <button onClick={goNext} disabled={page === totalPages}>
            Next
          </button>
        </div>
      )}

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

export default Nearme;