import React, { useState } from "react";
import { Link } from "react-router-dom";
import Login from "../pages/Login";

const Navbar = () => {
    const [showLogin, setShowLogin] = useState(false);
    
    const openLogin = () => setShowLogin(true);
    const closeLogin = () => setShowLogin(false);

    return (
        <nav className="container d-flex justify-content-between align-items-center py-2 w-75">
            {/* Logo */}
            <img src="/matrimonyLogo.png" height="50px" alt="logo" />

            {/* Navigation links */}
            <div className="d-flex gap-4 justify-content-end align-items-center">
                <Link to="/home">About us</Link>
                <Link to="/home">Contact us</Link>

                {/* Login button */}
                <button
                    className="btn btn-outline-primary"
                    onClick={openLogin}
                    style={{ borderRadius: "20px", padding: "5px 15px" }}
                >
                    Login
                </button>
            </div>

            {/* Login modal */}
            <Login show={showLogin} onClose={closeLogin} />
        </nav>
    );
};

export default Navbar;
