import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Notification from "./Notification";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import { logout } from "../redux/slices/authSlice";
import api from "../api/axiosInstance";
import "../styleSheets/navbar.css";

const UserNavbar = ({ closeMenu }) => {
    const { myProfile, id, role } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [festivalPlan, setFestivalPlan] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);

    const userName = myProfile?.firstName || "Loading...";
    const userPhoto =
        myProfile?.updatePhoto ||
        (myProfile?.gender === "Female"
            ? "/placeholder_girl.png"
            : "/placeholder_boy.png");

    /* ================= PROFILE FETCH ================= */

    useEffect(() => {
        if (id && role?.[0] === "USER") {
            dispatch(fetchMyProfile(id));
        }
    }, [id, role, dispatch]);

    /* ================= FESTIVAL PLAN ================= */

    useEffect(() => {
        api.get("plans")
            .then(res => {
                if (Array.isArray(res.data)) {
                    const platinum = res.data.find(p =>
                        p.planCode?.includes("PLATINUM")
                    );
                    setFestivalPlan(platinum || null);
                }
            })
            .catch(() => setFestivalPlan(null));
    }, []);

    const isFestivalActive = plan => {
        if (!plan?.festivalStart || !plan?.festivalEnd) return false;
        const today = new Date();
        return (
            today >= new Date(plan.festivalStart) &&
            today <= new Date(plan.festivalEnd)
        );
    };

    const festivalActive =
        festivalPlan && isFestivalActive(festivalPlan);

    /* ================= DROPDOWN OUTSIDE CLICK ================= */

    useEffect(() => {
        const handleClickOutside = e => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    /* ================= NAVIGATION ================= */

    const goTo = path => {
        closeMenu?.();
        setDropdownOpen(false);
        navigate(path);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    /* ================= UI ================= */

    return (
        <>
            <Link
                className="navLink"
                to="/dashboard/astroTalkQuery"
                onClick={() => goTo("/dashboard/astroTalkQuery")}
            >
                Astrology
            </Link>

            <Link
                className="navLink"
                to="/dashboard/help"
                onClick={() => goTo("/dashboard/help")}
            >
                Help
            </Link>

            {festivalActive ? (
                <Link
                    className="navLink upgrade-marquee glow-border"
                    to="/dashboard/premium"
                    onClick={() => goTo("/dashboard/premium")}
                >
                    <div className="marquee-track">
                        <span className="festival-glow">
                            Festival {festivalPlan.discountValue}% OFF
                        </span>
                        <span>Upgrade</span>
                        <span className="festival-glow">
                            Festival {festivalPlan.discountValue}% OFF
                        </span>
                        <span>Upgrade</span>
                    </div>
                </Link>
            ) : (
                <Link
                    className="navLink"
                    to="/dashboard/premium"
                    onClick={() => goTo("/dashboard/premium")}
                >
                    Upgrade
                </Link>
            )}

            <Notification />

            {/* ===== Profile Dropdown ===== */}

            <div
                className="dropdown"
                ref={dropdownRef}
                style={{ position: "relative" }}
            >
                <button
                    className="btn d-flex align-items-center gap-2"
                    onClick={() =>
                        setDropdownOpen(prev => !prev)
                    }
                >
                    <img
                        src={userPhoto}
                        width="35"
                        height="35"
                        className="rounded-circle"
                        alt="profile"
                    />
                    <span>
                        {userName}{" "}
                        <i className="bi bi-chevron-down"></i>
                    </span>
                </button>

                <ul
                    className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? "show" : ""
                        }`}
                >
                    <li>
                        <button
                            className="dropdown-item"
                            onClick={() =>
                                goTo("/dashboard/editProfile")
                            }
                        >
                            Profile
                        </button>
                    </li>

                    <li>
                        <button
                            className="dropdown-item"
                            onClick={() =>
                                goTo("/dashboard/settings")
                            }
                        >
                            Settings
                        </button>
                    </li>

                    <li>
                        <button
                            className="dropdown-item"
                            onClick={() =>
                                goTo(
                                    "/dashboard/settings?tab=refer"
                                )
                            }
                        >
                            Rewards
                        </button>
                    </li>

                    <li>
                        <hr className="dropdown-divider" />
                    </li>

                    <li>
                        <button
                            className="dropdown-item text-danger"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default UserNavbar;