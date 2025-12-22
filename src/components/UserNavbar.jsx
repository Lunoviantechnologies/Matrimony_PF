import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import backendIP from "../api/api";
import Notification from "./Notification";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const UserNavbar = () => {

    const { myProfile } = useSelector(state => state.auth);
    const { id, role } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userName = myProfile?.firstName || "User";
    const userPhoto = myProfile?.updatePhoto ? `${backendIP.replace("/api", "")}${myProfile.updatePhoto}` : "/default-user.png";

    useEffect(() => {
        if (id && role[0] === "USER") {
            dispatch(fetchMyProfile(id));
        }
    }, [id, role]);
    // console.log("myProfile in UserNavbar :", myProfile);

    const handleLogout = () => {
        dispatch(logout());
        alert("Logged out successfully!");
        navigate("/");
    };

    return (
        <>
            <Link className="navLink" to="/help">Help</Link>
            <Link className="navLink" to="/premium">Upgrade</Link>
            <Notification />

            <div className="dropdown">
                <button className="btn d-flex align-items-center gap-2" data-bs-toggle="dropdown">
                    <img src={userPhoto} width="35" height="35" className="rounded-circle" />
                    <span>{userName} <i className="bi bi-chevron-down"></i></span>
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                    <li><Link className="dropdown-item" to="editProfile">Profile</Link></li>
                    <li><Link className="dropdown-item" to="settings">Settings</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                </ul>
            </div>
        </>
    );
};

export default UserNavbar;