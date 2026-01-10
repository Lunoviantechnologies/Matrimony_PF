import React from "react";
import "../../styleSheets/privacy/terms.css";

const TermsConditions = () => {
    return (
        <div className="terms-root">
            <div className="terms-content">
                <h1 className="terms-title">Terms & Conditions</h1>
                <p className="terms-updated">Last updated: Jan 2026</p>

                <div className="terms-section">
                    <h3>1. Acceptance</h3>
                    <p>
                        By using VivahJeevan, you agree to these terms. Please read them carefully before continuing.
                    </p>
                </div>

                <div className="terms-section">
                    <h3>2. Eligibility</h3>
                    <p>
                        You must be of legal age to register and provide accurate, truthful information.
                    </p>
                </div>

                <div className="terms-section">
                    <h3>3. Account & Security</h3>
                    <p>
                        Keep your credentials safe. You are responsible for all activity on your account.
                    </p>
                </div>

                <div className="terms-section">
                    <h3>4. Content & Conduct</h3>
                    <p>
                        Do not post harmful, abusive, or unlawful content. Respect other members and comply with community guidelines.
                    </p>
                </div>

                <div className="terms-section">
                    <h3>5. Privacy</h3>
                    <p>
                        We process your data as described in our Privacy Policy. Do not share sensitive information publicly.
                    </p>
                </div>

                <div className="terms-section">
                    <h3>6. Subscriptions & Payments</h3>
                    <p>
                        Premium features may require paid plans. All fees are non-refundable except where required by law.
                    </p>
                </div>

                <div className="terms-section">
                    <h3>7. Liability</h3>
                    <p>
                        VivahJeevan is provided “as is.” We are not liable for user interactions; please exercise caution.
                    </p>
                </div>

                <div className="terms-section">
                    <h3>8. Termination</h3>
                    <p>
                        We may suspend or terminate accounts for violations. You may delete your account at any time.
                    </p>
                </div>

                <div className="terms-section">
                    <h3>9. Changes</h3>
                    <p>
                        Terms may change periodically. Continued use after updates means you accept the revised terms.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;