import React, { useState } from "react";
import { Link } from "react-router-dom";
import Login from "../pages/Login";

const Navbar = () => {
    const [showLogin, setShowLogin] = useState(false);
    
    const openLogin = () => setShowLogin(true);
    const closeLogin = () => setShowLogin(false);

    return (
        <nav className="navBody container d-flex justify-content-between align-items-center py-2 w-75">
            {/* Logo */}
            <img src="/matrimonyLogo.png" height="50px" alt="logo" />

            {/* Navigation links */}
            <div className="d-flex gap-4 justify-content-end align-items-center">
                <Link className="navLink" to="/home">About us</Link>
                <Link className="navLink" to="/home">Contact us</Link>

                {/* Login button */}
                <button className="navLogin btn" onClick={openLogin}>
                    Login
                </button>
            </div>

            {/* Login modal */}
            <Login show={showLogin} onClose={closeLogin} />
        </nav>
    );
};

export default Navbar;
