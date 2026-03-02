import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FiGrid, FiUser, FiEdit, FiInbox, FiHeart, FiMessageSquare } from "react-icons/fi";
import { MdPersonSearch } from "react-icons/md";
import "../styleSheets/subNavbar.css";
import { useSelector } from "react-redux";
import api from "../api/axiosInstance";

const SubNavbar = () => {

    const { id } = useSelector(state => state.auth);

    const [receivedCount, setReceivedCount] = useState(null);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const res = await api.get("/dashboard/summary");
                // console.log("response : ", res.data.receivedCount);
                setReceivedCount(res.data.receivedCount);
            } catch (e) {
                console.error("Error fetching dashboard summary:", e);
            }
        };

        if (id) {
            loadDashboard();
        }
    }, [id]);

    return (
        <div className="sticky-top sub_navbar">
            <div className="container-fluid subnav_container">
                <NavLink className="subnav_link" to="" end>
                    {/* <FiGrid size={18} color="#6B7280" />   */}
                    <b style={{ fontSize: "18px" }}>🏠</b><span>Dashboard</span>
                </NavLink>
                <NavLink className="subnav_link" to="editProfile" end>
                    {/* <FiEdit size={18} color="#b14d77" />   */}
                    <b style={{ fontSize: "18px" }}>✍️</b><span>Edit Profile</span>
                </NavLink>
                <NavLink className="subnav_link" to="viewProfile" end>
                    {/* <FiUser size={18} color="orange" />   */}
                    <b style={{ fontSize: "18px" }}>👤</b><span>View Profile</span>
                </NavLink>
                <NavLink className="subnav_link" to="requests">
                    <b style={{ fontSize: "18px" }}>📬</b>
                    <span className="requests-label">
                        Requests
                        {receivedCount > 0 && (
                            <b className="request-badge">
                                {receivedCount > 99 ? "99+" : receivedCount}
                            </b>
                        )}
                    </span>
                </NavLink>
                <NavLink className="subnav_link" to="search" end>
                    {/* <MdPersonSearch size={18} color="#8c6a6a" />   */}
                    <b style={{ fontSize: "18px" }}>🔭</b><span>Search</span>
                </NavLink>
                <NavLink className="subnav_link" to="matches">
                    {/* <FiHeart size={18} color="red" />   */}
                    <b style={{ fontSize: "18px" }}>💖</b><span>Matches</span>
                </NavLink>
                <NavLink className={({ isActive }) => isActive ? "subnav_link active" : "subnav_link"} to="messages">
                    {/* <FiMessageSquare size={18} color="blue" />  */}
                    <b style={{ fontSize: "18px" }}>✉️</b><span>Messages</span>
                </NavLink>
            </div>
        </div>
    );
};

export default SubNavbar;