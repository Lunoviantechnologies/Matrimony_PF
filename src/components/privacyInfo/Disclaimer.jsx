import React from "react";
// import "../../styleSheets/privacy/disclaimer.css";

const Disclaimer = () => {
    return (
        <div className="privacy-root">
            <div className="privacy-content">
                <h1 className="privacy-title">DISCLAIMER – VIVAH JEEVAN</h1>

                <div className="privacy-section">
                    <p>
                        Vivah Jeevan is only a matchmaking technology platform. We do not guarantee marriage, compatibility, or relationship success.
                    </p>
                </div>

                <div className="privacy-section">
                    <p>
                        We do not verify user backgrounds, identity, financial status, or criminal history.
                        All interactions are at the user’s own risk.
                    </p>
                </div>

                <div className="privacy-section">
                    <p>
                        Vivah Jeevan is not responsible for any emotional, financial, physical, or legal consequences arising from user interactions.
                    </p>
                </div>

                <div className="privacy-section">
                    <p>
                        Users are solely responsible for their decisions, meetings, communications, and relationships.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Disclaimer;