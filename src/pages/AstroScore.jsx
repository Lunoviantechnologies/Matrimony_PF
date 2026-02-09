import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import { fetchUserProfiles } from "../redux/thunk/profileThunk";
import api from "../api/axiosInstance";
import "../styleSheets/astroScore.css";
import { useNavigate } from "react-router-dom";

const AstroScore = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id, role, myProfile } = useSelector(state => state.auth);
    const { profiles } = useSelector(state => state.profiles);

    const [acceptedRequests, setAcceptedRequests] = useState([]);
    const [scores, setScores] = useState({});
    const [loadingId, setLoadingId] = useState(null);
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        if (!id) return;

        dispatch(fetchMyProfile(id));
        if (role?.[0]?.toUpperCase() === "USER") {
            dispatch(fetchUserProfiles());
        }
    }, [id, role, dispatch]);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await api.get("/plans");
                setPlans(Array.isArray(res?.data) ? res.data : []);
            } catch (err) {
                console.error("Plans fetch error:", err);
                setPlans([]);
            }
        };

        fetchPlans();
    }, []);

    useEffect(() => {
        if (!id) return;

        const fetchAcceptedRequests = async () => {
            try {
                const received = await api.get(`/friends/accepted/received/${id}`);
                const sent = await api.get(`/friends/accepted/sent/${id}`);

                const recv = Array.isArray(received?.data) ? received.data : [];
                const snt = Array.isArray(sent?.data) ? sent.data : [];
                setAcceptedRequests([...recv, ...snt]);
            } catch (error) {
                console.error("Accepted requests error:", error);
            }
        };

        fetchAcceptedRequests();
    }, [id]);

    const now = new Date();
    const activePayment = (myProfile?.payments || [])
        .filter(p => {
            if (p.status !== "PAID") return false;
            if (p.premiumEnd) {
                return new Date(p.premiumEnd) > now;
            }
            return true;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    const plansList = Array.isArray(plans) ? plans : [];
    const activePlan = plansList.find(plan => plan.planCode === activePayment?.planCode);
    const isAstroEnabled = activePlan?.astroSupport?.toLowerCase() !== "no";
    const isPlatinum = activePlan?.planCode?.startsWith("PLATINUM");

    // console.log("activePayment: ", activePayment)
    // console.log("activePlan: ", activePlan)
    // console.log("isAstroEnabled: ", isAstroEnabled)
    // console.log("isPlatinum: ", isPlatinum)

    const handleGetScore = async friendId => {
        try {
            setLoadingId(friendId);

            const res = await api.post(`/astrology/match/${id}/${friendId}`);

            setScores(prev => ({ ...prev, [friendId]: res.data.score }));
        } catch (err) {
            console.error("Astro score error:", err);
        } finally {
            setLoadingId(null);
        }
    };

    const getProfileImage = userId => {
        const profilesArr = Array.isArray(profiles) ? profiles : [];
        const profile = profilesArr.find(p => p.id === userId);
        return profile?.updatePhoto ? profile.updatePhoto : profile?.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png";
    };

    return (
        <div className="container py-4 astro-score-wrapper">
            <h3 className="fw-bold mb-4 text-center">
                Astro Compatibility
            </h3>

            {acceptedRequests.length === 0 && (
                <div className="alert alert-info text-center">
                    No accepted matches found.
                </div>
            )}

            {(Array.isArray(acceptedRequests) ? acceptedRequests : []).map(req => {
                const friendId = req.senderId === id ? req.receiverId : req.senderId;
                const friendName = req.senderId === id ? req.receiverName : req.senderName;
                const score = scores[friendId];

                return (
                    <div key={req.requestId} className="card shadow-sm border-0 mb-4" >
                        <div className="card-body astro-score-body">

                            {/* LEFT — YOU */}
                            <div className="astro-user">
                                <img src={getProfileImage(id)} alt="You" />
                                <span>You</span>
                            </div>

                            {/* CENTER — SCORE */}
                            <div className="astro-score-center">

                                <button
                                    className="astro-score-btn"
                                    disabled={!isAstroEnabled || loadingId === friendId}
                                    onClick={() => handleGetScore(friendId)}
                                >
                                    {loadingId === friendId
                                        ? "Calculating..."
                                        : score !== undefined
                                            ? `${score}% Match`
                                            : "Check Score"}
                                </button>

                                {!isAstroEnabled && (
                                    <div
                                        className="astro-upgrade-text"
                                        onClick={() => navigate("/dashboard/premium")}
                                    >
                                        Upgrade plan for astro score
                                    </div>
                                )}

                            </div>

                            {/* RIGHT — FRIEND */}
                            <div className="astro-user">
                                <img src={getProfileImage(friendId)} alt={friendName} />
                                <span>{friendName}</span>
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