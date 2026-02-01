import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styleSheets/AboutUs.css";
import { GiChainedHeart, GiConfirmed } from "react-icons/gi";
import { IoIosLock } from "react-icons/io";

const AboutUs = () => {

    return (
        <div className="aboutus-container">
            {/* Header Section */}
            <header className="aboutus-header">
                <h1 className="aboutus-title">VivahJeevan.com</h1>
                <p className="aboutus-subtitle"><strong>Serving members worldwide</strong></p>

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
                <div className="trustbar-title">A global matrimony community</div>
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
                    <strong>VivahJeevan.com</strong> was established with a singular mission:
                    to redefine the way people meet and find their life partners.
                    Launched in 2025, we quickly grew to become one of the world’s most
                    trusted matrimonial services, driven by innovation, security, and a deep
                    understanding of our members' cultural needs.
                </p>

                <h3 className="aboutus-promise">The VivahJeevan Promise</h3>
                <ul>
                    <li><strong>Innovation:</strong> We continually upgrade our platform with smart matching algorithms.</li>
                    <li><strong>Trust:</strong> Every profile is screened to ensure a safe and genuine experience.</li>
                    <li><strong>Privacy:</strong> We employ industry-leading encryption and privacy controls.</li>
                </ul>

                <p className="aboutus-cta">
                    Join the millions who have found their happily ever after with VivahJeevan!
                </p>
            </main>
        </div>
    );
};

export default AboutUs;