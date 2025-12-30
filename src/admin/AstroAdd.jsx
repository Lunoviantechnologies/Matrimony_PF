import React, { useState } from "react";
import axios from "axios";
import backendIP from "../api/api";
import { useNavigate } from "react-router-dom";

const AstroAdd = ({ onClose, onSuccess }) => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        expertise: "",
        experience: "",
        phone: "",
        price: "",
        languages: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone" && !/^\d{0,10}$/.test(value)) return;
        if ((name === "experience" || name === "price") && value < 0) return;

        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.phone.length !== 10) {
            setError("Phone number must be 10 digits");
            return;
        }

        try {
            setLoading(true);

            await axios.post(
                `${backendIP}/admin/astrologers`,
                {
                    ...form,
                    experience: Number(form.experience),
                    price: Number(form.price),
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            onSuccess && onSuccess();

            // ✅ Navigate to Astro Talk page
            navigate("/admin/astroTalk");
        } catch (err) {
            setError("Failed to add astrologer. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="astro-modal">
            <form className="astro-form" onSubmit={handleSubmit}>
                <h3>Add New Astrologer</h3>

                {error && <p className="error-text">{error}</p>}

                <input
                    name="name"
                    placeholder="Astrologer Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <input
                    name="expertise"
                    placeholder="Expertise (Marriage, Kundli, etc.)"
                    value={form.expertise}
                    onChange={handleChange}
                    required
                />

                <input
                    name="languages"
                    placeholder="Languages (Hindi, English)"
                    value={form.languages}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="experience"
                    placeholder="Experience (Years)"
                    value={form.experience}
                    onChange={handleChange}
                    required
                />

                <input
                    name="phone"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Price per minute (₹)"
                    value={form.price}
                    onChange={handleChange}
                    required
                />

                <div className="form-actions">
                    <button type="submit" className="save-btn" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </button>

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => navigate("/admin/astroTalk")}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AstroAdd;