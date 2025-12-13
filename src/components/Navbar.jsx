import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Login from "../pages/Login";
import SearchFilters from "./SearchFilters";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import backendIP from "../api/api";
import Notification from "./Notification";

const Navbar = () => {
    const [showLogin, setShowLogin] = useState(false);
    const { isLoggedIn, id, myProfile } = useSelector(state => state.auth);
    const dispatch = useDispatch();


    const openLogin = () => setShowLogin(true);
    const closeLogin = () => setShowLogin(false);
    const navigate = useNavigate();

    const userName = myProfile?.firstName || "User";
    const userPhoto = myProfile?.updatePhoto ? `${backendIP.replace("/api", "")}${myProfile.updatePhoto}` : "/default-user.png"

    useEffect(() => {
        dispatch(fetchMyProfile(id));
    }, [id]);
    console.log("myProfile :", userName);

    const handleLogout = () => {
        dispatch(logout());
        alert("Logged out successfully!");
        navigate("/");
    };

    return (
        <nav className="navBody sticky-top container w-75 d-flex justify-content-between align-items-center">
            <img src="/saathjanam_logo.png" alt="saathjanam_logo" height={'50px'} />
            <div className="d-flex gap-4 justify-content-end align-items-center">

                {
                    isLoggedIn ? (
                        <>
                            <div className="d-flex align-items-center">
                                <SearchFilters />
                            </div>
                            <Link className="navLink" to="/help">Help</Link>
                            <Link className="navLink" to="/premium">Upgrade</Link>
                            <Notification />

                            {/* User Dropdown */}
                            <div className="dropdown">
                                <button
                                    className="btn d-flex align-items-center gap-2"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    style={{ background: "none", border: "none" }}
                                >
                                    <img src={userPhoto || "/default-user.png"} alt="user" width="35" height="35" className="rounded-circle"
                                        style={{ objectFit: "cover" }}
                                    />
                                    <span className="fw-semibold">{userName || "User"} <i className="bi bi-chevron-down"></i></span>
                                </button>

                                <ul className="navDropDownMenu dropdown-menu dropdown-menu-end">
                                    <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                                    <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button className="dropdown-item text-danger" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
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
