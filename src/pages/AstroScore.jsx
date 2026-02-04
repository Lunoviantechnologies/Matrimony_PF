import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";

const AstroScore = () => {

    const [acceptedRequests, setAcceptedRequests] = useState([]);
    const { id, role, myProfile } = useSelector(state => state.auth);
    const { profiles } = useSelector(state => state.profiles);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // console.log("User ID in Accepted component:", profiles);

    useEffect(() => {
        dispatch(fetchMyProfile(id));
    }, [id]);

    useEffect(() => {
        if (!id) return;

        const fetchAcceptedRequests = async () => {
            try {
                const receivedAccepted = await api.get(`/friends/accepted/received/${id}`);

                const sentAccepted = await api.get(`/friends/accepted/sent/${id}`);

                const merged = [...receivedAccepted.data, ...sentAccepted.data];

                setAcceptedRequests(merged);
                console.log("Accepted requests:", merged);
            } catch (error) {
                console.error("Error fetching accepted requests:", error);
            }
        };

        fetchAcceptedRequests();
    }, [id]);

    const sortedPayments = [...(myProfile?.payments || [])].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return (
        <div>
            <h2>Astro Score Page</h2>
        </div>
    );
};

export default AstroScore;