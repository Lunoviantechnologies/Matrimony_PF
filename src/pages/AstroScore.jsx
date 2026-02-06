import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import { fetchUserProfiles } from "../redux/thunk/profileThunk";
import api from "../api/axiosInstance";
import "../styleSheets/astroScore.css";

const AstroScore = () => {
    const dispatch = useDispatch();

    const { id, role, myProfile } = useSelector(state => state.auth);
    const { profiles } = useSelector(state => state.profiles);

    const [acceptedRequests, setAcceptedRequests] = useState([]);
    const [scores, setScores] = useState({});
    const [loadingId, setLoadingId] = useState(null);
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        if (!id) return;

        dispatch(fetchMyProfile(id));
        if (role[0]?.toUpperCase() === "USER") {
            dispatch(fetchUserProfiles());
        }
    }, [id, role, dispatch]);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await api.get("/plans");
                setPlans(res.data);
            } catch (err) {
                console.error("Plans fetch error:", err);
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

                setAcceptedRequests([...received.data, ...sent.data]);
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
    const activePlan = plans.find(plan => plan.planCode === activePayment?.planCode);
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
        const profile = profiles?.find(p => p.id === userId);
        return profile?.updatePhoto ? profile.updatePhoto : profile?.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png";
    };

    return (
        <div className="container py-4">
            <h3 className="fw-bold mb-4 text-center">
                Astro Compatibility
            </h3>

            {acceptedRequests.length === 0 && (
                <div className="alert alert-info text-center">
                    No accepted matches found.
                </div>
            )}

            {acceptedRequests.map(req => {
                const friendId = req.senderId === id ? req.receiverId : req.senderId;
                const friendName = req.senderId === id ? req.receiverName : req.senderName;
                const score = scores[friendId];

                return (
                    <div key={req.requestId} className="card shadow-sm border-0 mb-4" >
                        <div className="card-body">
                            <div className="row align-items-center text-center">

                                {/* YOU */}
                                <div className="col-md-4 mb-3 mb-md-0">
                                    <img
                                        src={getProfileImage(id)}
                                        alt="You"
                                        width="80"
                                        height="80"
                                        className="rounded-circle mb-2"
                                        style={{ objectFit: "cover" }}
                                        draggable={false}
                                        onContextMenu={e =>
                                            e.preventDefault()
                                        }
                                    />
                                    <h6>You</h6>
                                </div>

                                {/* CENTER */}
                                <div className="col-md-4">

                                    <button
                                        className="btn btn-outline-primary btn-sm px-4"
                                        disabled={!isAstroEnabled || loadingId === friendId}
                                        onClick={() => handleGetScore(friendId)}
                                    >
                                        {loadingId === friendId ? "Calculating..." : "Check Score"}
                                    </button>

                                    {!isAstroEnabled && (
                                        <div className="mt-2 text-danger small">
                                            Upgrade your plan for astro support
                                        </div>
                                    )}

                                    {score !== undefined && (
                                        <div className="mt-3">
                                            <span className="badge bg-success fs-6 px-3 py-2">
                                                {score}% Match
                                            </span>
                                        </div>
                                    )}  
                                </div>

                                {/* FRIEND */}
                                <div className="col-md-4 mt-3 mt-md-0">
                                    <img
                                        src={getProfileImage(friendId)}
                                        alt={friendName}
                                        width="80"
                                        height="80"
                                        className="rounded-circle mb-2"
                                        style={{ objectFit: "cover" }}
                                    />
                                    <h6>{friendName}</h6>
                                </div>

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