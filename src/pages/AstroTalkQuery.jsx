import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { FaStar } from "react-icons/fa";
import "../styleSheets/astroTalkQuery.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import { useNavigate } from "react-router-dom";
import AstroScore from "./AstroScore";

const AstroTalkQuery = () => {
    const [astroInfo, setAstroInfo] = useState([]);
    const { id, myProfile } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        api.get("astro-number/All").then(res => {
            setAstroInfo(res.data);
        });
    }, []);

    useEffect(() => {
        dispatch(fetchMyProfile(id));
    }, [id, dispatch]);

    // 🔹 Get latest plan
    const sortedPayments = [...(myProfile?.payments || [])].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const activePlanCode = sortedPayments[0]?.planCode || "";

    const isPlatinum = activePlanCode.startsWith("PLATINUM");

    return (
        <div className="astro-container">
            <h2 className="astro-title">Talk to Our Expert Astrologer</h2>
            <p className="astro-subtitle">
                Get accurate guidance for marriage, compatibility & future life
            </p>

            <div className="astro-content d-flex justify-content-center align-items-center">
                <div>
                    <AstroScore />
                </div>

                <div>
                    {!isPlatinum ? (
                        <div className="astro-grid">
                            {astroInfo.map((astro) => (
                                <div className="astro-card text-center" key={astro.id}>
                                    <div className="astro-avatar">
                                        {astro.name.charAt(0)}
                                    </div>
                                    <h3 className="astro-name">{astro.name}</h3>

                                    {/* 🔒 Hidden details */}
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
                            {astroInfo.map((astro) => (
                                <div className="astro-card" key={astro.id}>
                                    <div className="astro-avatar">
                                        {astro.name.charAt(0)}
                                    </div>

                                    <h3 className="astro-name">{astro.name}</h3>
                                    <p className="astro-info">
                                        <strong>{astro.experience}+ yrs</strong> Experience
                                    </p>

                                    <div className="astro-rating">
                                        Rating : <FaStar className="pb-1" /> {4.5}
                                    </div>

                                    <div className="astro-price">
                                        ₹{astro.price}/min
                                    </div>

                                    <div className="astro-languages">
                                        <span className="astro-info">
                                            <strong>Languages:</strong> {astro.languages}
                                        </span>
                                    </div>

                                    <div className="astro-languages">
                                        <span className="astro-number">
                                            <strong>Mobile:</strong> {astro.astroNumber}
                                        </span>
                                    </div>

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