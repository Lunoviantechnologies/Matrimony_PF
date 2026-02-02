import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProfiles } from "../redux/thunk/profileThunk";
import api from "../api/axiosInstance";

const RelationshipManager = () => {

    const { profiles } = useSelector((state) => state.profiles);
    const dispatch = useDispatch();
    const { role } = useSelector((state) => state.auth);
    const [successpayments, setSuccessPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/payment/successful`);
            setLoading(false);
            const paidFilter = response.data.filter(payment => payment.status.toUpperCase() === "PAID");
            setSuccessPayments(paidFilter || []);
        } catch (err) {
            setError("Failed to load payments");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();

        if (role[0].toUpperCase() === "ADMIN") {
            dispatch(fetchAdminProfiles());
        };
    }, [dispatch, role]);

    const allowedPlans = ["DIAMONDPLUS_6", "PLATINUM_12"];
    const activePremiumPayments = successpayments.filter(p => {
        const isAllowedPlan = allowedPlans.includes(p.planCode);
        const notExpired = new Date(p.premiumEnd) > new Date();
        return isAllowedPlan && notExpired;
    });

    const matchedUsers = activePremiumPayments.map(payment => {
        const profile = profiles.find(p => p.userId === payment.userId || p.id === payment.userId);
        return {
            ...payment,
            profile
        };
    }).filter(item => item.profile);
    console.log("Matched Users:", matchedUsers);

    // --- Pagination Logic ---
    const totalPages = Math.ceil(matchedUsers.length / pageSize) || 1;
    const paginatedPayments = matchedUsers.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    // console.log("Successful Payments:", successpayments);

    return (
        <div>
            <h2>Relationship Manager</h2>

            <table className="table table-bordered table-striped text-center">
                <thead>
                    <tr>
                        <th style={{ backgroundColor: "#00695C", color: "white", textAlign: "center" }}>S.No</th>
                        <th style={{ backgroundColor: "#00695C", color: "white", textAlign: "center" }}>User ID</th>
                        <th style={{ backgroundColor: "#00695C", color: "white", textAlign: "center" }}>Name</th>
                        <th style={{ backgroundColor: "#00695C", color: "white", textAlign: "center" }}>Email</th>
                        <th style={{ backgroundColor: "#00695C", color: "white", textAlign: "center" }}>Phone</th>
                        <th style={{ backgroundColor: "#00695C", color: "white", textAlign: "center" }}>Plan</th>
                        <th style={{ backgroundColor: "#00695C", color: "white", textAlign: "center" }}>Expiry</th>
                        <th style={{ backgroundColor: "#00695C", color: "white", textAlign: "center" }}>Profile For</th>
                        <th style={{ backgroundColor: "#00695C", color: "white", textAlign: "center" }}>Age</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        matchedUsers.length === 0 ? (
                            <tr>
                                <td colSpan="9">No records found.</td>
                            </tr>
                        ) : (
                            matchedUsers.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.userId}</td>
                                    <td>{item.name}</td>
                                    <td>{item.profile.emailId}</td>
                                    <td>{item.profile.mobileNumber}</td>
                                    <td>{item.planCode}</td>
                                    <td>{new Date(item.premiumEnd).toLocaleDateString()}</td>
                                    <td>{item.profile.profileFor}</td>
                                    <td>{item.profile.age}</td>
                                </tr>
                            ))
                        )
                    }
                </tbody>
            </table>

            {/* --- Pagination UI --- */}
            <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="text-muted">
                    Showing <b>{paginatedPayments.length}</b> of <b>{matchedUsers.length}</b> records
                </div>

                <nav>
                    <ul className="pagination mb-0">
                        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setPage(page - 1)}>
                                Prev
                            </button>
                        </li>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                            <li
                                key={num}
                                className={`page-item ${page === num ? "active" : ""}`}
                            >
                                <button className="page-link" onClick={() => setPage(num)}>
                                    {num}
                                </button>
                            </li>
                        ))}

                        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setPage(page + 1)}>
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

        </div>
    );
};

export default RelationshipManager;