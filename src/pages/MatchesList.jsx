import React, { useEffect } from "react";
import "../styleSheets/ProfileCard.css";
import { useDispatch, useSelector } from "react-redux";
import { setMatchType, setPage } from "../redux/slices/matchesSlice";
import { fetchMatches } from "../redux/thunk/matchesThunk";
import { useNavigate } from "react-router-dom";
import { FaCrown, FaUser } from "react-icons/fa";
import ViewProfileModal from "../components/ViewProfileModal";
import MatchesImageCarousel from "./MatchesImageCarousel";
import { sendFriendRequest } from "../redux/thunk/friendRequestsThunk";
import api from "../api/axiosInstance";
import { fetchProfileById } from "../redux/thunk/profileThunk";

const MatchesList = ({ type, title }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { items, loading, page, totalPages, } = useSelector((state) => state.matches);
    const { myProfile, id } = useSelector((state) => state.auth);
    const { sentRequestIds, sendingRequestIds } = useSelector((state) => state.matches);
    const { selectedProfile, profileLoading } = useSelector(state => state.profiles);

    const [showModal, setShowModal] = React.useState(false);

    // Set match type when component mounts or type changes
    useEffect(() => {
        if (!myProfile?.id) return;

        dispatch(setMatchType(type));
        dispatch(fetchMatches());
    }, [dispatch, type]);

    const handlePageChange = (newPage) => {
        dispatch(setPage(newPage));
        dispatch(fetchMatches());
    };

    // console.log("myProfile in MatchesList:", myProfile); // debug
    console.log("matches state in MatchesList:", { items, loading, page, totalPages }); // debug

    const handleProfileCount = (userId) => {
        api.post(`profiles/record/${id}/${userId}`);
    };

    const maskName = (name = "") => {
        if (!name) return "-";
        return name.charAt(0).toUpperCase() + "*****";
    };

    const getDisplayName = (first, last) => {
        if (myProfile?.premium) {
            return `${first || ""} ${last || ""}`.trim();
        }
        return `${maskName(first)} ${maskName(last)}`.trim();
    };

    const handleSendRequest = (receiverId) => {
        dispatch(sendFriendRequest({ senderId: myProfile.id, receiverId }));
    };

    return (
        <div className="profile-main-container">
            <h2 className="profile-title">{title}</h2>

            {loading ? (
                <div>Loading matches...</div>
            ) : items.length === 0 ? (
                <p className="empty-state">
                    No profiles found matching your criteria.
                </p>
            ) : (
                <div className="profile-cards-wrapper">
                    {items.map((p) => (
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

                                {Number.isFinite(p.matchScore) && (
                                    <div className="match-circle">
                                        {p.matchScore}%
                                    </div>
                                )}
                            </div>

                            <div className="profile-details">
                                <h3 className="name">
                                    {getDisplayName(p.firstName, p.lastName)}
                                </h3>

                                <span className="meta">
                                    {p.age} yrs • {p.height} height
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
                                        onClick={() => {
                                            handleProfileCount(p.id);
                                            dispatch(fetchProfileById({ myId: id, userId: p.id }));
                                            setShowModal(true);
                                        }}
                                    >
                                        View Profile
                                    </button>

                                    <button
                                        className={`btn ${sentRequestIds.includes(p.id) ? "btn-sent" : "btn-send"}`}
                                        disabled={sentRequestIds.includes(p.id) || sendingRequestIds.includes(p.id)}
                                        onClick={() => handleSendRequest(p.id)}
                                    >
                                        {sendingRequestIds.includes(p.id) ?
                                            "Sending..." : sentRequestIds.includes(p.id) ?
                                                "Sent" : "Send Request"}
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 0}
                    >
                        Prev
                    </button>

                    <span>{Number.isFinite(page) ? page + 1 : 1}</span>

                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page + 1 >= totalPages}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                profileLoading ? (
                    <p className="no-requests-message">Loading profile...</p>
                ) : (
                    selectedProfile && (
                        <ViewProfileModal
                            premium={myProfile?.premium}
                            profile={selectedProfile}
                            onClose={() => setShowModal(false)}
                        />
                    )
                )
            )}
        </div>
    );
};

export default MatchesList;