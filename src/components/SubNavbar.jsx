import React from "react";
import { NavLink } from "react-router-dom";
import { FiGrid, FiUser, FiEdit, FiInbox, FiHeart, FiSettings, FiMessageSquare } from "react-icons/fi";

const SubNavbar = () => {
    return (
        <div className="sticky-top sub_navbar">
            <div className="container d-flex justify-content-around">
                <NavLink className="subnav_link" to="" end>
                    <FiGrid size={18} /> Dashboard
                </NavLink>
                <NavLink className="subnav_link" to="editProfile">
                    <FiEdit size={18} /> Edit Profile
                </NavLink>
                <NavLink className="subnav_link" to="viewProfile">    
                    <FiUser size={18} /> View Profile
                </NavLink>
                <NavLink className="subnav_link" to="requests">
                    <FiInbox size={18} /> Requests
                </NavLink>
                <NavLink className="subnav_link" to="matches">
                    <FiHeart size={18} /> Matches
                </NavLink>
                <NavLink className="subnav_link" to="messages">
                    <FiMessageSquare size={18} /> Messages
                </NavLink>
                <NavLink className="subnav_link" to="settings">
                    <FiSettings size={18} /> Settings
                </NavLink>
            </div>
        </div>
    );
};

export default SubNavbar;