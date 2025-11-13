import React from "react";
import { Link } from "react-router-dom";
import "../styleSheets/AboutUs.css";

const AboutUs = () => { 
    return (
        <div className="aboutus-container">
            {/* Header Section */}
            <header className="aboutus-header">
                <h1 className="aboutus-title">Saathjanam.com</h1>
                <p className="aboutus-subtitle">- <strong>Trusted by over 35 Million Members</strong></p>

                <div className="aboutus-links">
                    <Link to="/india">India</Link> | 
                    <Link to="/usa">USA</Link> | 
                    <Link to="/canada">Canada</Link> | 
                    <Link to="/uk">UK</Link> | 
                    <Link to="/nri" className="highlight">NRI Matrimonials »</Link>
                </div>
            </header>

            {/* Trust Bar Section */}
            <section className="trustbar-section">
                <div className="trustbar-title">Trusted by Millions</div>
                <div className="trustbar-features">
                    <div className="trustbar-item">
                        <span role="img" aria-label="Heart" className="trustbar-icon heart">💖</span>
                        <p><strong>Best Matches</strong></p>
                    </div>
                    <div className="trustbar-item">
                        <span role="img" aria-label="Check" className="trustbar-icon verified">✅</span>
                        <p><strong>Verified Profiles</strong></p>
                    </div>
                    <div className="trustbar-item">
                        <span role="img" aria-label="Lock" className="trustbar-icon privacy">🔒</span>
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