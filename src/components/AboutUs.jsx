import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styleSheets/AboutUs.css";
import { GiChainedHeart, GiConfirmed } from "react-icons/gi";
import { IoIosLock } from "react-icons/io";
import axios from "axios";
import backendIP from "../api/api";

const AboutUs = () => {

    const [profileCount, setProfileCount] = useState(0);

    const formatMemberCount = (num) => {
        if (!num) return "—";
        if (num < 1000) return num.toString();
        if (num < 100000) {
            return `${(num / 1000).toFixed(1).replace(".0", "")}K+`;
        }
        if (num < 10000000) {
            return `${(num / 100000).toFixed(1).replace(".0", "")}L+`;
        }
        return `${(num / 10000000).toFixed(1).replace(".0", "")}Cr+`;
    };

    useEffect(() => {
        axios.get(`${backendIP}/profiles/count`).then(res => {
            // console.log("count : ", res.data);
            setProfileCount(res.data.count);
        }).catch(() => setProfileCount(0));
    }, []);
    // console.log("count : ", profileCount);

    return (
        <div className="aboutus-container">
            {/* Header Section */}
            <header className="aboutus-header">
                <h1 className="aboutus-title">Saathjanam.com</h1>
                <p className="aboutus-subtitle">- <strong>Trusted by over {formatMemberCount(profileCount + 10000)} Members</strong></p>

                <div className="aboutus-links">
                    <Link to="#">India</Link> |
                    <Link to="#">USA</Link> |
                    <Link to="#">Canada</Link> |
                    <Link to="#">UK</Link> |
                    <Link to="#" className="highlight">NRI Matrimonials »</Link>
                </div>
            </header>

            {/* Trust Bar Section */}
            <section className="trustbar-section">
                <div className="trustbar-title">Trusted by Millions</div>
                <div className="trustbar-features">
                    <div className="trustbar-item">
                        <span role="img" aria-label="Heart" className="trustbar-icon heart"><GiChainedHeart /></span>
                        <p><strong>Best Matches</strong></p>
                    </div>
                    <div className="trustbar-item">
                        <span role="img" aria-label="Check" className="trustbar-icon verified"><GiConfirmed /></span>
                        <p><strong>Verified Profiles</strong></p>
                    </div>
                    <div className="trustbar-item">
                        <span role="img" aria-label="Lock" className="trustbar-icon privacy"><IoIosLock /></span>
                        <p><strong>100% Privacy</strong></p>
                    </div>
                </div>
            </section>

            {/* Main About Us Content */}
            <main className="aboutus-main">
                <h2 className="aboutus-heading">Our Journey to Finding Happiness</h2>

                <p>
                    <strong>Saathjanam.com</strong> was established with a singular mission:
                    to redefine the way people meet and find their life partners.
                    Launched in 2025, we quickly grew to become one of the world’s most
                    trusted matrimonial services, driven by innovation, security, and a deep
                    understanding of our members' cultural needs.
                </p>

                <h3 className="aboutus-promise">The Saathjanam Promise</h3>
                <ul>
                    <li><strong>Innovation:</strong> We continually upgrade our platform with smart matching algorithms.</li>
                    <li><strong>Trust:</strong> Every profile is screened to ensure a safe and genuine experience.</li>
                    <li><strong>Privacy:</strong> We employ industry-leading encryption and privacy controls.</li>
                </ul>

                <p className="aboutus-cta">
                    Join the millions who have found their happily ever after with Saathjanam!
                </p>
            </main>
        </div>
    );
};

export default AboutUs;