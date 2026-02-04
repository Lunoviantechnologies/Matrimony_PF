import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import api from "../api/axiosInstance";
import { fetchUserProfiles } from "../redux/thunk/profileThunk";

const AstroScore = () => {
    const [acceptedRequests, setAcceptedRequests] = useState([]);
    const [scores, setScores] = useState({});
    const [loadingId, setLoadingId] = useState(null);

    const { id, role } = useSelector(state => state.auth);
    const { myProfile } = useSelector(state => state.auth);
    const { profiles } = useSelector(state => state.profiles);

    const dispatch = useDispatch();

    useEffect(() => {
        if (id) dispatch(fetchMyProfile(id));
        if (role[0].toUpperCase() === "USER") {
            dispatch(fetchUserProfiles());
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (!id) return;

        const fetchAcceptedRequests = async () => {
            try {
                const receivedAccepted = await api.get(`/friends/accepted/received/${id}`);
                const sentAccepted = await api.get(`/friends/accepted/sent/${id}`);
                setAcceptedRequests([...receivedAccepted.data, ...sentAccepted.data]);
            } catch (error) {
                console.error("Error fetching accepted requests:", error);
            }
        };

        fetchAcceptedRequests();
    }, [id]);

    // 🔹 Latest plan
    const sortedPayments = [...(myProfile?.payments || [])].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const activePlanCode = sortedPayments[0]?.planCode || "";

    const getPlanType = () => {
        if (activePlanCode.startsWith("GOLD")) return "GOLD";
        if (activePlanCode.startsWith("DIAMONDPLUS")) return "DIAMONDPLUS";
        if (activePlanCode.startsWith("DIAMOND")) return "DIAMOND";
        if (activePlanCode.startsWith("PLATINUM")) return "PLATINUM";
        return "FREE";
    };

    const planType = getPlanType();
    const isAstroEnabled = ["DIAMOND", "DIAMONDPLUS", "PLATINUM"].includes(planType);

    const handleGetScore = async (friendId) => {
        try {
            setLoadingId(friendId);
            const res = await api.post(`/astro/score`, {
                userId: id,
                friendId
            });

            setScores(prev => ({
                ...prev,
                [friendId]: res.data.score
            }));
        } catch (err) {
            console.error("Astro score error:", err);
        } finally {
            setLoadingId(null);
        }
    };

    // 🔹 helper to get image from profiles
    const getProfileImage = (userId) => {
        const profile = profiles?.find(p => p.id === userId);
        return profile?.updatePhoto ? profile.updatePhoto : profile?.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png";
    };

    return (
        <div className="container py-4">
            <h3 className="fw-bold mb-4 text-center">Astro Compatibility</h3>

            {acceptedRequests.length === 0 && (
                <div className="alert alert-info text-center">
                    No accepted matches found.
                </div>
            )}

            {acceptedRequests.map((req) => {
                const friendId = req.senderId === id ? req.receiverId : req.senderId;
                const friendName = req.senderId === id ? req.receiverName : req.senderName;
                const score = scores[friendId];

                return (
                    <div key={req.requestId} className="card shadow-sm border-0 mb-4">
                        <div className="card-body">
                            <div className="row align-items-center text-center">

                                {/* You */}
                                <div className="col-md-4 mb-3 mb-md-0">
                                    <img
                                        src={getProfileImage(id)}
                                        alt="You"
                                        className="rounded-circle mb-2"
                                        width="80"
                                        height="80"
                                        style={{ objectFit: "cover" }}
                                    />
                                    <h6 className="mb-0">You</h6>
                                </div>

                                {/* Middle */}
                                <div className="col-md-4">
                                    <button
                                        className="btn btn-outline-primary btn-sm px-4"
                                        disabled={!isAstroEnabled || loadingId === friendId}
                                        onClick={() => handleGetScore(friendId)}
                                    >
                                        {loadingId === friendId ? "Calculating..." : "Check Astro Score"}
                                    </button>

                                    {!isAstroEnabled && (
                                        <div className="mt-2 text-danger small">
                                            Upgrade to <b>Platinum</b> for astro advanced support
                                        </div>
                                    )}

                                    {score !== undefined && (
                                        <div className="mt-3">
                                            <span className="badge bg-success fs-6 px-3 py-2">
                                                {score}% Match
                                            </span>
                                        </div>
                                    )}

                                    {planType === "PLATINUM" && score !== undefined && (
                                        <a
                                            href="https://wa.me/919999999999"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="d-block mt-2 text-decoration-none fw-semibold"
                                        >
                                            📞 Consult Astrologer on WhatsApp
                                        </a>
                                    )}
                                </div>

                                {/* Partner */}
                                <div className="col-md-4 mt-3 mt-md-0">
                                    <img
                                        src={getProfileImage(friendId)}
                                        alt={friendName}
                                        className="rounded-circle mb-2"
                                        width="80"
                                        height="80"
                                        style={{ objectFit: "cover" }}
                                    />
                                    <h6 className="mb-0">{friendName}</h6>
                                </div>

                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AstroScore;