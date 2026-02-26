import React from "react";
import { NavLink } from "react-router-dom";
import { FiGrid, FiUser, FiEdit, FiInbox, FiHeart, FiMessageSquare } from "react-icons/fi";
import { MdPersonSearch } from "react-icons/md";
import "../styleSheets/subNavbar.css";

const SubNavbar = () => {
    return (
        <div className="sticky-top sub_navbar">
            <div className="container-fluid subnav_container">
                <NavLink className="subnav_link" to="" end>
                    {/* <FiGrid size={18} color="#6B7280" />   */}
                    <b style={{fontSize: "18px"}}>🏠</b><span>Dashboard</span>
                </NavLink>
                <NavLink className="subnav_link" to="editProfile" end>
                    {/* <FiEdit size={18} color="#b14d77" />   */}
                    <b style={{fontSize: "18px"}}>✍️</b><span>Edit Profile</span>
                </NavLink>
                <NavLink className="subnav_link" to="viewProfile" end>
                    {/* <FiUser size={18} color="orange" />   */}
                    <b style={{fontSize: "18px"}}>👤</b><span>View Profile</span>
                </NavLink>
                <NavLink className="subnav_link" to="requests">
                    {/* <FiInbox size={18} color="#a552b2" />   */}
                    <b style={{fontSize: "18px"}}>📬</b><span>Requests</span>
                </NavLink>
                <NavLink className="subnav_link" to="search" end>
                    {/* <MdPersonSearch size={18} color="#8c6a6a" />   */}
                    <b style={{fontSize: "18px"}}>🔭</b><span>Search</span>
                </NavLink>
                <NavLink className="subnav_link" to="matches">
                    {/* <FiHeart size={18} color="red" />   */}
                    <b style={{fontSize: "18px"}}>💖</b><span>Matches</span>
                </NavLink>
                <NavLink className={({ isActive }) => isActive ? "subnav_link active" : "subnav_link"} to="messages">
                    {/* <FiMessageSquare size={18} color="blue" />  */}
                    <b style={{fontSize: "18px"}}>✉️</b><span>Messages</span>
                </NavLink>
            </div>
        </div>
    );
};

export default SubNavbar;