import React, { useState, useEffect, useMemo } from "react";
import "../styleSheets/ManageMatches.css";
import { TbHeartHandshake } from "react-icons/tb";
import api from "../api/axiosInstance";
import serverURL from "../api/server";

export default function ManageMatches() {
  const [matches, setMatches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  /* -----------------------------------
     Fetch ACCEPTED friends
  ----------------------------------- */
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get(`/friends/all`);
        setMatches(res.data || []);
      } catch (err) {
        console.error("Error fetching matches", err);
      }
    };

    fetchMatches();
  }, []);

  /* -----------------------------------
     Transform Data
  ----------------------------------- */
  const friendPairs = useMemo(() => {
    return matches
      .filter((m) => m.status?.toUpperCase() === "ACCEPTED")
      .map((m) => ({
        id: m.requestId,
        a: {
          id: m.senderId,
          name: m.senderName,
          age: m.senderAge,
          city: m.senderCity,
          photo: m.senderPhoto,
          gender: m.senderGender,
        },
        b: {
          id: m.receiverId,
          name: m.receiverName,
          age: m.receiverAge,
          city: m.receiverCity,
          photo: m.receiverPhoto,
          gender: m.receiverGender,
        },
      }));
  }, [matches]);

  /* -----------------------------------
     Pagination
  ----------------------------------- */
  const totalPages = Math.max(1, Math.ceil(friendPairs.length / pageSize));

  const paginatedPairs = friendPairs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  const getImage = (photo, gender) => {
    if (!photo) return null;

    if (photo && typeof photo === "string" && photo.trim() !== "") {
      photo = photo.trim();

      if (photo.includes("/profile-photos/")) {
        return `${serverURL}${photo}`;
      }

      return `${serverURL}/profile-photos/${photo}`;
    }

    // Fallback to frontend placeholder
    return gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png";
  };

  return (
    <div className="mm-container">
      <h2 className="mm-title">Matched Profiles</h2>

      <div className="mm-list">
        {paginatedPairs.map((m) => (
          <div key={m.id} className="mm-pair-card">

            {/* Left user */}
            <div className="mm-user">
              <img
                src={getImage(m.a.photo, m.a.gender)}
                alt={m.a.name}
                className="mm-img"
              />
              <div className="mm-info">
                <h4>{m.a.name}</h4>
                <p>{m.a.age} yrs</p>
                <p>{m.a.city}</p>
              </div>
            </div>

            {/* Center */}
            <div className="mm-center">
              <div className="mm-note">Matched</div>
              <div className="mm-heart text-danger">
                <TbHeartHandshake />
              </div>
            </div>

            {/* Right user */}
            <div className="mm-user mm-user-right">
              <div className="mm-info">
                <h4>{m.b.name}</h4>
                <p>{m.b.age} yrs</p>
                <p>{m.b.city}</p>
              </div>
              <img
                src={getImage(m.b.photo, m.b.gender)}
                alt={m.b.name}
                className="mm-img"
              />
            </div>

          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mm-pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="pagination_btn"
        >
          Prev
        </button>

        <span className="mm-page-number">{currentPage}</span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="pagination_btn"
        >
          Next
        </button>
      </div>
    </div>
  );
}