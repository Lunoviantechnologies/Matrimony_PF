import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const Matches = () => {
    return (
        <div className="container d-flex flex-column align-items-center">
            <div className="matches_nav d-flex justify-content-around w-100">
                <NavLink className="matches_link" to="new_matches">  New Matches </NavLink>
                <NavLink className="matches_link" to="my_matches"> My Matches </NavLink>
                <NavLink className="matches_link" to="near_me"> Near Me </NavLink>
                <NavLink className="matches_link" to="more"> More Matches </NavLink>
            </div>

            <Outlet />
        </div>
    );
};

export default Matches;