import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { FaPhoneAlt, FaCommentDots, FaStar } from "react-icons/fa";
import "../styleSheets/astroTalkQuery.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import { useNavigate } from "react-router-dom";

const AstroTalkQuery = () => {

    const [astroInfo, setAstroInfo] = useState([]);
    const { id, myProfile } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        api.get("astro-number/All").then(res => {
            setAstroInfo(res.data);
            // console.log("Astro Info : ", res.data);
        })
    }, []);

    useEffect(() => {
        dispatch(fetchMyProfile(id));
    }, [id]);

    return (
        <div className="astro-container">
            <h2 className="astro-title">Talk to Our Expert Astrologer</h2>
            <p className="astro-subtitle">
                Get accurate guidance for marriage, compatibility & future life
            </p>

            {
                !myProfile?.premium ? (
                    <div className="astro-upgrade">
                        <h3>Premium Feature</h3>
                        <p>
                            Upgrade to <strong>Premium</strong> to access Astrology Consultations.
                        </p>
                        <button className="upgrade-btn" onClick={ () => navigate("/dashboard/premium")}>
                            Upgrade Now
                        </button>
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
                            </div>
                        ))}
                    </div >
                )
            }
        </div >
    );
};

export default AstroTalkQuery;