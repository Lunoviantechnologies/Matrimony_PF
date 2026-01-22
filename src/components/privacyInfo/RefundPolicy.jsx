import React from "react";
// import "../../styleSheets/privacy/refundpolicy.css";

const RefundPolicy = () => {
    return (
        <div className="privacy-root">
            <div className="privacy-content">
                <h1 className="privacy-title">REFUND POLICY – VIVAH JEEVAN</h1>

                <div className="privacy-section">
                    <p>
                        All payments made on Vivah Jeevan are final and non-refundable.
                    </p>
                </div>

                <div className="privacy-section">
                    <ul>
                        <li>No refund for unused subscriptions.</li>
                        <li>No refund if no matches are found.</li>
                        <li>No refund if account is suspended or terminated.</li>
                        <li>No refund for dissatisfaction or marriage not happening.</li>
                        <li>No refund for technical issues beyond our control.</li>
                    </ul>
                </div>

                <div className="privacy-section">
                    <p>
                        By purchasing any service, you agree that you are not entitled to any refund, replacement, or compensation.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default RefundPolicy;