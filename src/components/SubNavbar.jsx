import React from "react"; 
import { Link } from "react-router-dom";

const SubNavbar = () => {
    return (
        <div className="sticky-top sub_navbar">
            <div className="container d-flex justify-content-around">
                <Link className="subnav_link" to="/dashboard">Dashboard</Link>
                <Link className="subnav_link" to="/dashboard/editProfile">Edit Profile</Link>
                <Link className="subnav_link" to="/dashboard/viewProfile">View Profile</Link>
                <Link className="subnav_link" to="/dashboard/matches">Matches</Link>
                <Link className="subnav_link" to="/dashboard/messages">Messages</Link>
                <Link className="subnav_link" to="/dashboard/settings">Settings</Link>
            </div>
        </div>
    );
};

export default SubNavbar;