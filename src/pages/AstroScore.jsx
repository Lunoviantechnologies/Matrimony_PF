import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import "../styleSheets/astroScore.css";
import { getProfileImage } from "../utils/profileImage";

const AstroScore = () => {
    const navigate = useNavigate();
    const { myProfile, id } = useSelector(state => state.auth);

    const [friends, setFriends] = useState([]);
    const [scores, setScores] = useState({});
    const [loadingId, setLoadingId] = useState(null);

    // ⭐ PLAN CHECK
    const canUseAstroScore =
        myProfile?.membershipType.toUpperCase() === "PLATINUM" ||
        myProfile?.membershipType.toUpperCase() === "DIAMOND" ||
        myProfile?.membershipType.toUpperCase() === "DIAMOND PLUS";

    useEffect(() => {
        const fetchAcceptedFriends = async () => {
            try {
                const res = await api.get(`/friends/accepted/all/${id}`);
                console.log("Accepted friends response: ", res.data);
                setFriends(Array.isArray(res?.data) ? res.data : []);
            } catch (err) {
                console.error("Friends fetch error:", err);
                setFriends([]);
            }
        };

        fetchAcceptedFriends();
    }, []);

    const handleGetScore = async (friendId) => {
        try {
            setLoadingId(friendId);

            const res = await api.post(`/astrology/match/${id}/${friendId}`);
            setScores(prev => ({ ...prev, [friendId]: res.data.score, message: res.data.message }));
            console.log(`Astro score for friendId ${friendId}: `, res.data);
        } catch (err) {
            console.error("Astro score error:", err);
        } finally {
            setLoadingId(null);
        }
    };
    console.log("myProfile : ", myProfile, scores);

    return (
        <div className="container py-4 astro-score-wrapper">
            <h3 className="fw-bold mb-4 text-center">
                Astro Compatibility
            </h3>

            {friends.length === 0 && (
                <div className="alert alert-info text-center">
                    No accepted matches found.
                </div>
            )}

            {friends.map(friend => {
                const score = scores[friend.friendId];

                return (
                    <div key={friend.friendId} className="card shadow-sm border-0 mb-4">
                        <div className="card-body astro-score-body">

                            {/* LEFT — YOU */}
                            <div className="astro-user">
                                <img
                                    src={getProfileImage(myProfile)}
                                    alt="You"
                                />
                                <span>You</span>
                            </div>

                            {/* CENTER — SCORE */}
                            <div className="astro-score-center">

                                <button
                                    className="astro-score-btn"
                                    disabled={!canUseAstroScore || loadingId === friend.friendId}
                                    onClick={() => handleGetScore(friend.friendId)}
                                >
                                    {loadingId === friend.friendId ?
                                        "Calculating..." : score !== undefined ? `${score}% Match` : "Check Score"}
                                </button>

                                {!canUseAstroScore && (
                                    <div
                                        className="astro-upgrade-text"
                                        onClick={() => navigate("/dashboard/premium")}
                                    >
                                        Upgrade plan for astro score
                                    </div>
                                )}

                                {/* <div>
                                    <b>{scores.message}</b>
                                </div> */}
                            </div>

                            {/* RIGHT — FRIEND */}
                            <div className="astro-user">
                                <img
                                    src={getProfileImage(friend)}
                                    alt={friend.friendId}
                                />
                                <span>{friend.friendName}</span>
                            </div>

                        </div>

                        <div className="sys-message">
                            <p>--- This is a system generated score ---</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AstroScore;