import React from "react";
import "../styleSheets/successPageCSS/registerSuccess.css";
const RegisterSuccessPage = () => {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">

            <div className="glow-wrapper">
                <div className="card p-5 text-center" style={{ maxWidth: "450px", border: "none", borderRadius: "15px" }}>

                    <div className="mb-3">
                        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "4rem" }}></i>
                    </div>

                    <h2 className="mb-3">Registration Successful 🎉</h2>

                    <p className="text-secondary mb-4">
                        Your account has been created successfully.<br />
                        Please log in to continue.
                    </p>

                </div>
            </div>

        </div>
    );
};

export default RegisterSuccessPage;