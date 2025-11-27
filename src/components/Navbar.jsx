import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Login from "../pages/Login";
import SearchFilters from "./SearchFilters";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";

const Navbar = () => {
    const [showLogin, setShowLogin] = useState(false);
    const { isLoggedIn } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const openLogin = () => setShowLogin(true);
    const closeLogin = () => setShowLogin(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        alert("Logged out successfully!");
        navigate("/");
    };

    return (
        <nav className="navBody sticky-top container w-75 d-flex justify-content-between align-items-center">
            <img src="/saathjanam_logo.png" alt="saathjanam_logo" height={'50px'} />
            <div className="d-flex gap-4 justify-content-end align-items-center">
                <div className="d-flex align-items-center">
                    <SearchFilters />
                </div>

                {
                    isLoggedIn ? (
                        <>
                            <Link className="navLink" to="/help">Help</Link>
                            <Link className="navLink" to="/premium">Upgrade</Link>
                            <button className="navLogin" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link className="navLink" to="/">Home</Link>
                            <Link className="navLink" to="/aboutUs">About Us</Link>
                            <Link className="navLink" to="/contactUs">Contact Us</Link>
                            <button className="navLogin" onClick={openLogin}>
                                Login
                            </button>
                        </>
                    )
                }
            </div>

            <Login show={showLogin} onClose={closeLogin} />
        </nav>
    );
};

export default Navbar;
