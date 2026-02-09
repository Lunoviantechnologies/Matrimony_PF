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
                    <FiGrid size={18} color="#6B7280"/> Dashboard
                </NavLink>
                <NavLink className="subnav_link" to="editProfile">
                    <FiEdit size={18} color="#b14d77"/> Edit Profile
                </NavLink>
                <NavLink className="subnav_link" to="viewProfile">    
                    <FiUser size={18} color="orange"/> View Profile
                </NavLink>
                <NavLink className="subnav_link" to="requests">
                    <FiInbox size={18} color="#a552b2"/> Requests
                </NavLink>
                <NavLink className="subnav_link" to="search">
                    <MdPersonSearch size={18} color="#8c6a6a"/> Search
                </NavLink>
                <NavLink className="subnav_link" to="matches">
                    <FiHeart size={18} color="red"/> Matches
                </NavLink>
                <NavLink className="subnav_link" to="messages/:userId">
                    <FiMessageSquare size={18} color="blue"/> Messages
                </NavLink>
            </div>
        </div>
    );
};

export default SubNavbar;