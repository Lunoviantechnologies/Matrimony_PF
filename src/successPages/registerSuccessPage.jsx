import React, { useEffect, useState } from "react";
import "../styleSheets/successPageCSS/registerSuccess.css";

const RegisterSuccessPage = () => {
    const [seconds, setSeconds] = useState(3);

    useEffect(() => {
        // countdown
        const interval = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);

        // redirect
        const timeout = setTimeout(() => {
            window.location.href = "/";
        }, 3000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="glow-wrapper">
                <div
                    className="card p-5 text-center"
                    style={{ maxWidth: "450px", border: "none", borderRadius: "15px" }}
                >
                    <div className="mb-3">
                        <i
                            className="bi bi-check-circle-fill text-success"
                            style={{ fontSize: "4rem" }}
                        ></i>
                    </div>

                    <h2 className="mb-3">Registration Successful 🎉</h2>

                    <p className="text-secondary mb-2">
                        Your account has been created successfully.
                        <br />
                        Please log in to continue.
                    </p>

                    <p className="text-muted">
                        Redirecting to home in <strong>{seconds}</strong> seconds…
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterSuccessPage;