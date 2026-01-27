import React from "react";
import { IoIosMail } from "react-icons/io";
// import "../../styleSheets/privacy/community.css";

const CommunityGuidelines = () => {
    return (
        <div className="privacy-root">
            <div className="privacy-content">

                <h1 className="privacy-title">COMMUNITY GUIDELINES – VIVAH JEEVAN</h1>

                <div className="privacy-section">
                    <p>
                        Vivah Jeevan is meant for serious, respectful matrimonial purposes only.
                    </p>
                </div>

                <div className="privacy-section">
                    <h3>YOU MUST</h3>
                    <ul>
                        <li> Be honest</li>
                        <li> Be respectful</li>
                        <li> Communicate responsibly</li>
                        <li> Report suspicious behavior</li>
                    </ul>
                </div>

                <div className="privacy-section">
                    <h3>YOU MUST NOT</h3>
                    <ul>
                        <li> Scam or ask for money</li>
                        <li> Harass or abuse</li>
                        <li> Misuse photos or data</li>
                        <li> Treat platform as dating app</li>
                    </ul>
                </div>

                <div className="privacy-section">
                    <h3>ENFORCEMENT</h3>
                    <p>Violation of guidelines may result in:</p>
                    <ul>
                        <li>Warning</li>
                        <li>Suspension</li>
                        <li>Permanent ban</li>
                        <li>Legal action if required</li>
                    </ul>
                </div>

                <div className="privacy-section">
                    <h3>CONTACT</h3>
                    <p>
                        <IoIosMail size={20}/> Support Email:{" "}
                        <a href="mailto:support@vivahjeevan.com">
                            support@vivahjeevan.com
                        </a>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default CommunityGuidelines;