import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const Matches = () => {
    return (
        <div className="container d-flex flex-column align-items-center">
            <div className="matches_nav d-flex justify-content-around w-100">
                <NavLink className="matches_link" to="newmatches">  New Matches </NavLink>
                <NavLink className="matches_link" to="mymatches"> My Matches </NavLink>
                <NavLink className="matches_link" to="nearme"> Near Me </NavLink>
                <NavLink className="matches_link" to="morematches"> More Matches </NavLink>
            </div>

            <Outlet />
        </div>
    );
};

export default Matches;