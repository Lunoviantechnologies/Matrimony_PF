import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const Requests = () => {

    return (
        <div className="container d-flex flex-column align-items-center">
            <div className="request_nav d-flex justify-content-around w-100 mb-3">
                <NavLink className="request_link" to="recieved">Recieved</NavLink>
                <NavLink className="request_link" to="sent">Sent</NavLink>  
                <NavLink className="request_link" to="accepted">Accepted</NavLink>
                <NavLink className="request_link" to="rejected">Rejected</NavLink>
            </div>

            <Outlet />
        </div>
    );
};

export default Requests;