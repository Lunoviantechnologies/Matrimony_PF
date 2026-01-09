import React from "react";
import "../../styleSheets/privacy/privacypolicy.css";

const PrivacyPolicy = () => {
    return (
        <div className="privacy-root">
            <div className="privacy-content">
                <h1 className="privacy-title">Privacy Policy</h1>
                <p className="privacy-updated">Last updated: Jan 2026</p>

                <div className="privacy-section">
                    <h3>1. Information We Collect</h3>
                    <p>
                        We collect account details (name, email, phone), profile information, device data, and usage analytics to
                        provide and improve our services.
                    </p>
                </div>

                <div className="privacy-section">
                    <h3>2. How We Use Your Data</h3>
                    <p>
                        To operate the app, personalize matches, communicate updates, and ensure safety. We do not sell your data.
                    </p>
                </div>

                <div className="privacy-section">
                    <h3>3. Sharing</h3>
                    <p>
                        We may share data with trusted vendors for hosting, analytics, and notifications. We do not share your
                        personal contact details with other members without consent.
                    </p>
                </div>

                <div className="privacy-section">
                    <h3>4. Security</h3>
                    <p>
                        We use reasonable safeguards, but no method is 100% secure. Protect your account credentials.
                    </p>
                </div>

                <div className="privacy-section">
                    <h3>5. Your Choices</h3>
                    <p>
                        You can update or delete your profile. You may opt-out of marketing communications. Some data may be retained
                        as required by law or for legitimate interests.
                    </p>
                </div>

                <div className="privacy-section">
                    <h3>6. Cookies & Tracking</h3>
                    <p>
                        We may use cookies or similar technologies for analytics and session management.
                    </p>
                </div>

                <div className="privacy-section">
                    <h3>7. Children</h3>
                    <p>
                        The service is not intended for minors. Do not register if you are under the legal age.
                    </p>
                </div>

                <div className="privacy-section">
                    <h3>8. Changes</h3>
                    <p>
                        We may update this policy. Continued use after changes means you accept the updates.
                    </p>
                </div>

                <div className="privacy-section">
                    <h3>9. Contact</h3>
                    <p>
                        For questions, contact{" "}
                        <a href="mailto:support@vivahjeevan.com">support@vivahjeevan.com</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;