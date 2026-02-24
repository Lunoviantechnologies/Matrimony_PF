import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ViewProfileModal from "./ViewProfileModal";
import "../styleSheets/searchpage.css";
import { FaCrown, FaUser } from "react-icons/fa";
import MatchesImageCarousel from "../pages/MatchesImageCarousel";
import { setPage } from "../redux/slices/searchSlice";
import api from "../api/axiosInstance";

const SearchProfiles = () => {

    const dispatch = useDispatch();
    const { id, myProfile } = useSelector(state => state.auth);
    const { results, loading, page, totalPages } = useSelector(state => state.search);

    const [selectedProfile, setSelectedProfile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [anchorRect, setAnchorRect] = useState(null);

    const handleSendRequest = (receiverId) => {
        api.post(`/friends/send/${id}/${receiverId}`)
            .then(() => {
                alert("Request sent successfully");
            })
            .catch(err => console.error("Error sending request:", err));
    };

    const handleProfileCount = (userId) => {
        api.post(`profiles/record/${id}/${userId}`);
    };

    const maskName = (name = "") => {
        if (!name) return "—";
        return name.charAt(0).toUpperCase() + "*****";
    };

    const getDisplayName = (first, last) => {
        if (myProfile?.premium) return `${first || ""} ${last || ""}`.trim();
        return `${maskName(first)} ${maskName(last)}`.trim();
    };

    const handlePageChange = (newPage) => {
        if (newPage < 0 || newPage >= totalPages) return;
        dispatch(setPage(newPage));
    };

    console.log("Search results : ", results);

    return (
        <div className="search-page">
            <h1>Search Profiles</h1>

            <div>
                {loading ? (
                    <h3>Loading...</h3>
                ) : results.length === 0 ? (
                    <h3>
                        Search by name, location, profession, religion, or interests to find matches
                    </h3>
                ) : (
                    <div className="profile-cards-wrapper">
                        {results.map((p) => (
                            <article className="profile-card" key={p.id}>
                                <div className="image-box">
                                    <MatchesImageCarousel
                                        profile={p}
                                        isPremiumUser={myProfile?.premium}
                                        onUpgrade={() => navigate("/dashboard/premium")}
                                    />

                                    <div className="premium-badge">
                                        {p.premium ? (
                                            <span className="premium-icon">
                                                <FaCrown />
                                            </span>
                                        ) : (
                                            <span className="free-icon">
                                                <FaUser /> free
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="profile-details">
                                    <h3 className="name">
                                        {getDisplayName(p.firstName, p.lastName)}
                                    </h3>
                                    <span className="meta">
                                        {p.age} yrs • {p.height}
                                    </span>
                                    <p className="line">
                                        {p.occupation} • {p.highestEducation}
                                    </p>
                                    <p className="line">{p.city}</p>
                                    <p className="line">
                                        {p.religion} | {p.subCaste}
                                    </p>

                                    <div className="btn-row">
                                        <button
                                            className="btn btn-view"
                                            onClick={(e) => {
                                                handleProfileCount(p.id);
                                                setSelectedProfile(p);
                                                setAnchorRect(e.target.getBoundingClientRect());
                                                setShowModal(true);
                                            }}
                                        >
                                            View Profile
                                        </button>

                                        <button
                                            className="btn btn-send"
                                            onClick={() => handleSendRequest(p.id)}
                                        >
                                            Send Request
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="pagination-container">
                    <button
                        disabled={page === 0}
                        onClick={() => handlePageChange(page - 1)}
                    >
                        Previous
                    </button>

                    <span>
                        Page {page + 1} of {totalPages}
                    </span>

                    <button
                        disabled={page === totalPages - 1}
                        onClick={() => handlePageChange(page + 1)}
                    >
                        Next
                    </button>
                </div>
            )}

            {showModal && (
                <ViewProfileModal
                    premium={myProfile?.premium}
                    profile={selectedProfile}
                    anchorRect={anchorRect}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default SearchProfiles;