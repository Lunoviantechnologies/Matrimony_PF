import React, { useEffect, useState } from "react";
import "../styleSheets/astro.css";
import { FaEdit, FaToggleOn, FaToggleOff, FaPlus } from "react-icons/fa";
import api from "../api/axiosInstance";
import AstroAdd from "./AstroAdd";

const AstroTalkInfo = () => {
    const [astros, setAstros] = useState([]);
    const [editingAstro, setEditingAstro] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        api.get("astro-number/admin/All").then(res => {
            setAstros(res.data);
            console.log("astro info : ", res.data);
        });
    }, []);

    const refreshAstros = () => {
        api.get("astro-number/admin/All").then(res => {
            setAstros(res.data);
        });
    };

    const handleEditAstro = (astro) => {
        setEditingAstro(astro);
        setShowAddModal(true);
    };

    return (
        <div className="astro-admin-container">
            <div className="astro-admin-header">
                <h2>Astro Talk – Admin Panel</h2>

                {/* ✅ Navigate instead of modal */}
                <button className="add-btn" onClick={() => setShowAddModal(true)} style={{width: "200px"}}>
                    <FaPlus /> Add Astrologer
                </button>
            </div>

            <table className="astro-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Experience</th>
                        <th>Phone</th>
                        <th>Languge</th>
                        <th>Price/min</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {astros.map((astro) => (
                        <tr key={astro.id}>
                            <td>{astro.name}</td>
                            <td>{astro.experience} yrs</td>
                            <td>{astro.astroNumber}</td>
                            <td>{astro.languages}</td>
                            <td>₹{astro.price}</td>
                            <td className="actions">
                                <button className="icon-btn" onClick={() => handleEditAstro(astro)}>
                                    <FaEdit color="orange"/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ✅ POPUP MODAL */}
            {showAddModal && (
                <AstroAdd
                    astro={editingAstro}   // 👈 null = ADD, object = EDIT
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingAstro(null);
                    }}
                    onSuccess={() => {
                        refreshAstros();
                        setShowAddModal(false);
                        setEditingAstro(null);
                    }}
                />
            )}
        </div>
    );
};

export default AstroTalkInfo;