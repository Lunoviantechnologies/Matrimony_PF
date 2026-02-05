import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";
import "../styleSheets/astro.css";

const AstroAdd = ({ astro, onClose, onSuccess }) => {

    const isEdit = Boolean(astro);

    const [form, setForm] = useState({
        name: "",
        experience: "",
        astroNumber: "",
        price: "",
        languages: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ✅ Prefill form in EDIT mode
    useEffect(() => {
        if (astro) {
            setForm({
                name: astro.name || "",
                experience: astro.experience || "",
                astroNumber: astro.astroNumber?.toString() || "",
                price: astro.price || "",
                languages: astro.languages || "",
            });
        }
    }, [astro]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "astroNumber" && !/^\d{0,10}$/.test(value)) return;
        if ((name === "experience" || name === "price") && value < 0) return;

        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.astroNumber.length !== 10) {
            setError("Phone number must be 10 digits");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                ...form,
                experience: Number(form.experience),
                price: Number(form.price),
            };

            if (isEdit) {
                // ✅ UPDATE (PUT)
                await api.put(`astro-number/update/${astro.id}`, payload);
                toast.success("Astro info updated successfully");
            } else {
                // ✅ ADD (POST)
                await api.post("astro-number/add", payload);
                toast.success("Astro info added successfully");
            }

            onSuccess && onSuccess();
        } catch (err) {
            console.error(err);
            setError("Failed to save astrologer. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="astro-modal">
            <form className="astro-form" onSubmit={handleSubmit}>
                <h3>{isEdit ? "Edit Astrologer" : "Add New Astrologer"}</h3>

                {error && <p className="error-text">{error}</p>}

                <input
                    name="name"
                    placeholder="Astrologer Name"
                    value={form.name}
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
                    type="text"
                    name="astroNumber"
                    placeholder="Phone Number"
                    value={form.astroNumber}
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
                        {loading ? "Saving..." : isEdit ? "Update" : "Save"}
                    </button>

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={onClose}
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