import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { FaStar } from "react-icons/fa";
import "../styleSheets/astroTalkQuery.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AstroScore from "./AstroScore";

const AstroTalkQuery = () => {
    const [astroInfo, setAstroInfo] = useState([]);
    const { myProfile, id } = useSelector(state => state.auth);
    const navigate = useNavigate();

    const isPlatinum =  myProfile?.membershipType.toUpperCase() === "PLATINUM";

    useEffect(() => {
        const fetchAstrologers = async () => {
            try {
                const res = await api.get(`/astro-number/all/${id}`);
                console.log("Astrologers response: ", res.data);
                setAstroInfo(Array.isArray(res?.data) ? res.data : []);
            } catch (err) {
                console.error("Astrologer fetch error:", err);
                setAstroInfo([]);
            }
        };

        fetchAstrologers();
    }, []);

    return (
        <div className="astro-container">
            <h2 className="astro-title">Talk to Our Expert Astrologer</h2>
            <p className="astro-subtitle">
                Get accurate guidance for marriage, compatibility & future life
            </p>

            <div className="astro-dashboard">

                <div>
                    <AstroScore />
                </div>

                <div>
                    {!isPlatinum ? (
                        <div className="astro-grid">
                            {astroInfo.map(astro => (
                                <div className="astro-card text-center" key={astro.id}>
                                    <div className="astro-avatar">
                                        {astro.name.charAt(0)}
                                    </div>
                                    <h3 className="astro-name">{astro.name}</h3>

                                    <div className="blurred-text mt-2">
                                        Upgrade to Platinum to view astrologer details
                                    </div>

                                    <button
                                        className="upgrade-btn mt-3"
                                        onClick={() => navigate("/dashboard/premium")}
                                    >
                                        Upgrade to Platinum
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="astro-grid">
                            {astroInfo.map(astro => (
                                <div className="astro-card" key={astro.id}>
                                    <div className="astro-avatar">
                                        {astro.name.charAt(0)}
                                    </div>

                                    <h3 className="astro-name">{astro.name}</h3>

                                    <p className="astro-info">
                                        <strong>{astro.experience}+ yrs</strong> Experience
                                    </p>

                                    <div className="astro-rating">
                                        Rating : <FaStar className="pb-1" /> {astro.rating}
                                    </div>

                                    <div className="astro-price">
                                        ₹{astro.price}/min
                                    </div>

                                    <div className="astro-languages">
                                        <strong>Languages:</strong> {astro.languages}
                                    </div>

                                    {/* <div className="astro-number">
                                        <strong>Mobile:</strong> {astro.astroNumber}
                                    </div> */}

                                    <a
                                        href={`https://wa.me/${astro.astroNumber}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="astro-whatsapp"
                                    >
                                        📞 Chat on WhatsApp
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AstroTalkQuery;