import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MatchesSort from "./MatchesSort";

const EMPTY_FILTERS = {
    age: [],
    maritalStatus: [],
    religion: [],
    caste: [],
    country: [],
    education: [],
    profession: [],
    lifestyle: [],
};

const Matches = () => {

    const [filtersDraft, setFiltersDraft] = useState(EMPTY_FILTERS);
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [sortBy, setSortBy] = useState("relevance");

    const handleApplyFilters = () => {
        setFilters(filtersDraft);
    };

    const handleClearFilters = () => {
        setFiltersDraft(EMPTY_FILTERS);
        setFilters(EMPTY_FILTERS);
        setSortBy("relevance");
    };

    return (
        <div className="container-fluid">
            <div className="row min-vh-100">

                {/* Sidebar */}
                <div className="col-12 col-md-3 col-lg-2 p-0">
                    <Sidebar filters={filtersDraft} setFilters={setFiltersDraft} onApply={handleApplyFilters} onClear={handleClearFilters} />
                </div>

                <div className="col-12 col-md-9 col-lg-10">
                    <div className="d-flex flex-column align-items-center px-3">
                        <div className="matches_nav d-flex flex-wrap justify-content-center gap-3 w-100 py-3">
                            <NavLink to="newmatches" className={({ isActive }) => `matches_link ${isActive ? "active" : ""}`}>
                                New Matches
                            </NavLink>

                            <NavLink to="mymatches" className={({ isActive }) => `matches_link ${isActive ? "active" : ""}`}>
                                My Matches
                            </NavLink>

                            <NavLink to="nearme" className={({ isActive }) => `matches_link ${isActive ? "active" : ""}`}>
                                Near Me
                            </NavLink>

                            <NavLink to="morematches" className={({ isActive }) => `matches_link ${isActive ? "active" : ""}`}>
                                More Matches
                            </NavLink>
                        </div>

                        <div className="sort_div d-flex justify-content-end w-100 mb-3x">
                            <MatchesSort sortBy={sortBy} setSortBy={setSortBy} />
                        </div>

                        {/* Nested Route Content */}
                        <div className="w-100 ps-5">
                            <Outlet context={{ filters, sortBy }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Matches;