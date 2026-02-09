import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../styleSheets/requests/requestLayout.css";

const Requests = () => {

    return (
        <div className="container d-flex flex-column align-items-center min-vh-100">
            <div className="request_nav d-flex justify-content-around w-100 mb-3">
                <NavLink end className="request_link" to="received">Received</NavLink>
                <NavLink className="request_link" to="sent">Sent</NavLink>
                <NavLink className="request_link" to="accepted">Accepted</NavLink>
                <NavLink className="request_link" to="rejected">Rejected</NavLink>
            </div>

            <Outlet />
        </div>
    );
};

export default Requests;