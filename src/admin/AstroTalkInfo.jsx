import React, { useEffect, useState } from "react";
import "../styleSheets/astro.css";
import { FaEdit, FaToggleOn, FaToggleOff, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

const AstroTalkInfo = () => {
    const [astros, setAstros] = useState([]);
    const navigate = useNavigate("");

    useEffect(() => {
        api.get("astro-number/All").then(res => { setAstros(res.data); });

        setAstros([
            {
                id: 1,
                name: "Pandit Ramesh Sharma",
                expertise: "Marriage, Kundli Matching",
                experience: 15,
                phone: "9876543210",
                price: 20,
                status: true,
            },
            {
                id: 2,
                name: "Astro Meena Joshi",
                expertise: "Love & Relationship",
                experience: 12,
                phone: "9123456789",
                price: 15,
                status: false,
            },
        ]);
    }, []);

    const toggleStatus = (id) => {
        setAstros((prev) =>
            prev.map((astro) =>
                astro.id === id ? { ...astro, status: !astro.status } : astro
            )
        );

        // 🔹 Later call API here
        // axios.patch(`${backendIP}/admin/astrologers/${id}/status`)
    };

    return (
        <div className="astro-admin-container">
            <div className="astro-admin-header">
                <h2>Astro Talk – Admin Panel</h2>

                {/* ✅ Navigate instead of modal */}
                <button
                    className="add-btn"
                    onClick={() => navigate("/admin/addastro")}
                >
                    <FaPlus /> Add Astrologer
                </button>
            </div>

            <table className="astro-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Expertise</th>
                        <th>Experience</th>
                        <th>Phone</th>
                        <th>Price/min</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {astros.map((astro) => (
                        <tr key={astro.id}>
                            <td>{astro.name}</td>
                            <td>{astro.expertise}</td>
                            <td>{astro.experience} yrs</td>
                            <td>{astro.phone}</td>
                            <td>₹{astro.price}</td>
                            <td>
                                <span className={astro.status ? "active" : "inactive"}>
                                    {astro.status ? "Online" : "Offline"}
                                </span>
                            </td>
                            <td className="actions">
                                <button className="icon-btn">
                                    <FaEdit />
                                </button>
                                <button
                                    className="icon-btn"
                                    onClick={() => toggleStatus(astro.id)}
                                >
                                    {astro.status ? <FaToggleOn /> : <FaToggleOff />}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AstroTalkInfo;