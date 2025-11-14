import React from "react"; 
import { NavLink } from "react-router-dom";

const SubNavbar = () => {
    return (
        <div className="sticky-top sub_navbar">
            <div className="container d-flex justify-content-around">
                <NavLink className="subnav_link" to="" end>Dashboard</NavLink>
                <NavLink className="subnav_link" to="editProfile">Edit Profile</NavLink>
                <NavLink className="subnav_link" to="viewProfile">View Profile</NavLink>
                <NavLink className="subnav_link" to="requests">Requests</NavLink>
                <NavLink className="subnav_link" to="matches">Matches</NavLink>
                <NavLink className="subnav_link" to="messages">Messages</NavLink>
                <NavLink className="subnav_link" to="settings">Settings</NavLink>
            </div>
        </div>
    );
};

export default SubNavbar;