import React from "react";
import "../../styleSheets/privacy/privacypolicy.css";

const PrivacyPolicy = () => {
    return (
        <div className="privacy-root">
            <div className="privacy-content">
                <h1 className="privacy-title">PRIVACY POLICY – VIVAH JEEVAN</h1>
                <p className="privacy-updated">Last Updated: Jan 2026</p>

                <div className="privacy-section">
                    <p>
                        Vivah Jeevan respects user privacy but prioritizes platform safety and legal compliance.
                    </p>
                </div>

                <div className="privacy-section">
                    <h3>1. Information We Collect</h3>
                    <ul>
                        <li>Name, age, gender</li>
                        <li>Photos, marital details</li>
                        <li>Contact information</li>
                        <li>Horoscope and preferences</li>
                        <li>Device and usage data</li>
                    </ul>
                </div>

                <div className="privacy-section">
                    <h3>2. Data Usage</h3>
                    <p>We use data to:</p>
                    <ul>
                        <li>Provide matchmaking services</li>
                        <li>Improve app performance</li>
                        <li>Prevent fraud and misuse</li>
                        <li>Comply with legal obligations</li>
                    </ul>
                </div>

                <div className="privacy-section">
                    <h3>3. Data Sharing</h3>
                    <ul>
                        <li>If required by law or court order</li>
                        <li>To prevent fraud or illegal activity</li>
                        <li>With government or law enforcement agencies</li>
                    </ul>
                </div>

                <div className="privacy-section">
                    <h3>4. Data Storage</h3>
                    <p>
                        Data may be stored on cloud servers inside or outside India.
                        We use reasonable security measures but cannot guarantee 100% security.
                    </p>
                </div>

                <div className="privacy-section">
                    <h3>5. User Responsibility</h3>
                    <ul>
                        <li>Do not share sensitive data unnecessarily.</li>
                        <li>Do not upload others’ photos without consent.</li>
                    </ul>
                </div>

                <div className="privacy-section">
                    <h3>6. Account Deletion</h3>
                    <p>
                        Users may request account deletion. Backup data may be retained for legal and compliance purposes.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default PrivacyPolicy;