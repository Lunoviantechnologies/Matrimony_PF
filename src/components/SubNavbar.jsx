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
                    <FiGrid size={18} color="#6B7280" />  <span>Dashboard</span>
                </NavLink>
                <NavLink className="subnav_link" to="editProfile" end>
                    <FiEdit size={18} color="#b14d77" />  <span>Edit Profile</span>
                </NavLink>
                <NavLink className="subnav_link" to="viewProfile" end>
                    <FiUser size={18} color="orange" />  <span>View Profile</span>
                </NavLink>
                <NavLink className="subnav_link" to="requests">
                    <FiInbox size={18} color="#a552b2" />  <span>Requests</span>
                </NavLink>
                <NavLink className="subnav_link" to="search" end>
                    <MdPersonSearch size={18} color="#8c6a6a" />  <span>Search</span>
                </NavLink>
                <NavLink className="subnav_link" to="matches">
                    <FiHeart size={18} color="red" />  <span>Matches</span>
                </NavLink>
                <NavLink className={({ isActive }) => isActive ? "subnav_link active" : "subnav_link"} to="messages">
                    <FiMessageSquare size={18} color="blue" />  <span>Messages</span>
                </NavLink>
            </div>
        </div>
    );
};

export default SubNavbar;