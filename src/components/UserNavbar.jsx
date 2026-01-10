import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Notification from "./Notification";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

const UserNavbar = () => {

    const { myProfile } = useSelector(state => state.auth);
    const { id, role } = useSelector(state => state.auth);
    const [festivalPlan, setFestivalPlan] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userName = myProfile?.firstName || "User";
    const userPhoto = myProfile?.updatePhoto ? myProfile.updatePhoto : myProfile?.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png";

    useEffect(() => {
        if (id && role[0] === "USER") {
            dispatch(fetchMyProfile(id));
        }
    }, [id, role]);
    // console.log("myProfile in UserNavbar :", myProfile);

    useEffect(() => {
        api.get("plans").then(res => {
            const platinum = res.data.find(p => p.planCode.includes("PLATINUM"));
            setFestivalPlan(platinum);
        });
    }, []);

    const isFestivalActive = (plan) => {
        if (!plan?.festivalStart || !plan?.festivalEnd) return false;

        const today = new Date();
        return today >= new Date(plan.festivalStart) &&
            today <= new Date(plan.festivalEnd);
    };

    const handleLogout = () => {
        dispatch(logout());
        alert("Logged out successfully!");
        navigate("/");
    };

    return (
        <>
            <Link className="navLink" to="/dashboard/astroTalkQuery">Astrology</Link>
            <Link className="navLink" to="/dashboard/help">Help</Link>
            <Link className="navLink upgrade-marquee glow-border" to="/dashboard/premium">
                <div className="marquee-track">
                    <span className="festival-glow">Festival {festivalPlan?.discountValue}% OFF</span>
                    <span>Upgrade</span>
                    <span className="festival-glow">Festival {festivalPlan?.discountValue}% OFF</span>
                    <span>Upgrade</span>
                </div>
            </Link>

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