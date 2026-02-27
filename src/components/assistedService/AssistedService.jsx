import React, { useState, useEffect } from "react";
import "../../styleSheets/assistedServiceCSS/assistedService.css";

export default function AssistedService() {
    const [showModal, setShowModal] = useState(false);

    // Auto close after 5 seconds
    useEffect(() => {
        let timer;

        if (showModal) {
            timer = setTimeout(() => {
                setShowModal(false);
            }, 3000);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [showModal]);

    return (
        <>
            <div className="my-4">
                <div className="assisted-wrapper">
                    <div className="row align-items-center">

                        {/* LEFT CONTENT */}
                        <div className="col-lg-7 col-md-7 col-12">

                            <div className="d-flex align-items-center mb-3">
                                <div className="service-icon me-3">
                                    <img
                                        src="/vivahjeevan_logo.png"
                                        alt="logo"
                                        width="40"
                                        height="40"
                                    />
                                </div>
                                <div>
                                    <h4 className="mb-0 fw-bold">Assisted service</h4>
                                    <p className="text-muted mb-0">
                                        Personalised matchmaking service
                                    </p>
                                </div>
                            </div>

                            <h2 className="fw-bold mb-3">
                                Find your match{" "}
                                <span className="text-success">10x faster</span>
                            </h2>

                            <p className="text-muted mb-4">
                                Personalized matchmaking service through expert Relationship Manager
                            </p>

                            <div className="feature-item">
                                <i className="bi bi-check-circle-fill"></i>
                                <span>Guaranteed matches</span>
                            </div>

                            <div className="feature-item">
                                <i className="bi bi-check-circle-fill"></i>
                                <span>Better response</span>
                            </div>

                            <div className="feature-item mb-4">
                                <i className="bi bi-check-circle-fill"></i>
                                <span>Save time & effort</span>
                            </div>

                            <button
                                className="know-btn"
                                onClick={() => setShowModal(true)}
                            >
                                Know more
                            </button>
                        </div>

                        {/* RIGHT IMAGE */}
                        <div className="col-lg-5 col-md-5 col-12 text-center mt-4 mt-md-0">
                            <img
                                src="/banner2.webp"
                                alt="Relationship Manager"
                                className="img-fluid manager-img"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal">
                        <div className="modal-icon">
                            <i className="bi bi-rocket-takeoff-fill"></i>
                        </div>

                        <h4 className="fw-bold mt-3">Coming Soon</h4>
                        <p className="text-muted">
                            Our Assisted Service feature is launching soon.
                            Stay tuned for something amazing!
                        </p>

                        <button
                            className="modal-btn"
                            onClick={() => setShowModal(false)}
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}