import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfiles } from "../redux/thunk/profileThunk";
import ViewProfileModal from "./ViewProfileModal";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import api from "../api/axiosInstance";

const SearchProfiles = () => {

    const { id, role, myProfile } = useSelector(state => state.auth);
    const { profiles } = useSelector(state => state.profiles);
    const searchText = useSelector(state => state.search.searchFilterText);
    // const [filteredSearch, setFilteredSearch] = useState([]);
    const dispatch = useDispatch();

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

        // 3️⃣ Accepted Requests (both received & sent)
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

        // 4️⃣ Rejected Requests (both received & sent)
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
                alert("Request sent successfully");
                setSentRequests(prev => [...prev, { senderId: id, receiverId }]);
            })
            .catch(err => console.error("Error sending request:", err));
    };

    // ---- Convert lists to ID arrays for filtering ----
    const sentIds = useMemo(
        () => sentRequests.map(r => r.receiverId),
        [sentRequests]
    );
    const receivedIds = useMemo(
        () => receivedRequests.map(r => r.senderId),
        [receivedRequests]
    );
    const acceptedIds = useMemo(
        () => acceptedList.map(r => r.receiverId === id ? r.senderId : r.receiverId),
        [acceptedList, id]
    );
    const rejectedIds = useMemo(
        () => rejectedList.map(r => r.receiverId === id ? r.senderId : r.receiverId),
        [rejectedList, id]
    );

    const allHiddenIds = useMemo(
        () => [...sentIds, ...receivedIds, ...acceptedIds, ...rejectedIds],
        [sentIds, receivedIds, acceptedIds, rejectedIds]
    );

    // console.log("all profiles : ", profiles);

    const filteredSearch = useMemo(() => {
        if (!profiles?.length || !myProfile) return [];
        if (!searchText || searchText.trim() === "") return [];

        const search = searchText.toLowerCase();

        return profiles
            .filter(p => p.id !== id)
            .filter(p => p.gender !== myProfile.gender)
            .filter(p => !allHiddenIds.includes(p.id))
            .filter(p =>
                p.firstName?.toLowerCase().includes(search) ||
                p.lastName?.toLowerCase().includes(search) ||
                p.city?.toLowerCase().includes(search) ||
                p.hobbies?.toLowerCase().includes(search) ||
                p.occupation?.toLowerCase().includes(search) ||
                p.caste?.toLowerCase().includes(search) ||
                p.religion?.toLowerCase().includes(search) ||
                p.motherTongue?.toLowerCase().includes(search) ||
                p.annualIncome?.toLowerCase().includes(search) ||
                String(p.age).includes(search)
            );
    }, [profiles, searchText, myProfile, id, allHiddenIds]);

    const handleProfileCount = (userId) => {
        api.post(`profiles/record/${id}/${userId}`).then(res => {
            // console.log("count res : ", res.data);
        })
    };

    return (
        <div>
            <h1>Search Profiles</h1>

            <div>
                {
                    filteredSearch.length === 0 ? (
                        <h3> Search by name, location, profession, religion, or interests to find matches </h3>
                    ) : (
                        <div className="profile-cards-wrapper">
                            {filteredSearch.map((p) => {
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

                                            {!myProfile?.premium && (
                                                <div className="premium-overlay" onClick={() => navigate("/dashboard/premium")}>
                                                    🔒 Upgrade to Premium
                                                </div>
                                            )}
                                        </div>

                                        <div className="profile-details">
                                            <h3 className="name">{p.firstName + " " + p.lastName}</h3>
                                            <span className="meta">{p.age} yrs • {p.height}</span>
                                            <p className="line">{p.occupation} • {p.highestEducation}</p>
                                            <p className="line">{p.city}</p>
                                            <p className="line">{p.religion} | {p.subCaste}</p>

                                            <div className="btn-row">
                                                <button className="btn btn-view"
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
                    )
                }
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

export default SearchProfiles;