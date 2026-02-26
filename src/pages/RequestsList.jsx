import React, { useEffect, useMemo, useState } from "react";
import "../styleSheets/requests/profileRequest.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchFriendRequests, respondToRequest, cancelFriendRequest } from "../redux/thunk/friendRequestsThunk";
import { fetchProfileById } from "../redux/thunk/profileThunk";
import ViewProfileModal from "../components/ViewProfileModal";
import { useNavigate } from "react-router-dom";

const RequestsList = ({ type }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id, myProfile } = useSelector(state => state.auth);
    const { requestsByType, loading } = useSelector(state => state.friendRequests);
    const { selectedProfile, profileLoading } = useSelector(state => state.profiles);

    const [showModal, setShowModal] = useState(false);

    const requests = requestsByType[type] || [];

    /* ================= FETCH ================= */

    //   console.log("myProfile:", myProfile);
    console.log("requests for type:", requests);

    useEffect(() => {
        if (!id) return;
        dispatch(fetchFriendRequests({ userId: id, type }));
    }, [id, type, dispatch]);

    /* ================= HELPERS ================= */

    const maskName = (name = "") =>
        name ? name.charAt(0).toUpperCase() + "*****" : "-";

    const getDisplayName = (name) =>
        myProfile?.premium ? name || "-" : maskName(name);

    /* ================= ACTIONS ================= */

    const handleRespond = (requestId, accept) => {
        dispatch(respondToRequest({ requestId, accept, type }));
    };

    const handleProfile = async (profileId) => {
        dispatch(fetchProfileById({ myId: id, userId: profileId }));
        setShowModal(true);
    };

    /* ================= UI ================= */

    if (loading) {
        return <p className="no-requests-message">Loading...</p>;
    }

    return (
        <div className="received-container">
            {requests.length === 0 ? (
                <p className="no-requests-message">No {type} requests</p>
            ) : (
                requests.map((user) => {
                    const profile = user.profile;
                    const displayName = profile?.name;
                    const imageSrc = profile?.updatePhoto ? profile.updatePhoto : profile?.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png";
                    return (
                        <div className="received-card" key={user.requestId}>

                            <div className="left-section">
                                <div className="img-box">
                                    <img
                                        src={imageSrc}
                                        alt="profile"
                                        className={`profile-img ${profile?.hideProfilePhoto ? "blur-image" : ""}`}
                                        draggable={false}
                                        onContextMenu={(e) => e.preventDefault()}
                                    />
                                </div>

                                <div className="text-section">
                                    <h3 className="name">
                                        {getDisplayName(displayName)}
                                    </h3>

                                    {type === "accepted" && (
                                        <p className="request-status">
                                            {user.senderId === id
                                                ? "They accepted your request"
                                                : "You accepted their request"}
                                        </p>
                                    )}

                                    {type === "rejected" && (
                                        <p className="details" style={{ color: "#d62828", fontWeight: 600 }}>
                                            {user.senderId === id
                                                ? "They rejected your request"
                                                : "You rejected their request"}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="btn-section">

                                {type === "received" && (
                                    <>
                                        <button className="accept" onClick={() => handleProfile(profile.id)}>
                                            View Profile
                                        </button>
                                        <button className="accept" onClick={() => handleRespond(user.requestId, true)}>
                                            Accept
                                        </button>
                                        <button className="reject" onClick={() => handleRespond(user.requestId, false)}>
                                            Reject
                                        </button>
                                    </>
                                )}

                                {type === "sent" && (
                                    <>
                                        <button className="accept" onClick={() => handleProfile(profile.id)}>
                                            View Profile
                                        </button>
                                        <button
                                            className="reject"
                                            onClick={() => dispatch(cancelFriendRequest({ requestId: user.requestId, type }))}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}

                                {type === "accepted" && (
                                    <>
                                        <button
                                            className="accept"
                                            onClick={() => navigate(`/dashboard/messages/${profile.id}`)}
                                        >
                                            Message
                                        </button>
                                        <button className="accept" onClick={() => handleProfile(profile.id)}>
                                            View Profile
                                        </button>
                                    </>
                                )}

                                {type === "rejected" && (
                                    <button className="accept" disabled>
                                        Denied
                                    </button>
                                )}

                            </div>
                        </div>
                    );
                })
            )}

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

export default RequestsList;