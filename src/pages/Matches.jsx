import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MatchesSort from "./MatchesSort";

const EMPTY_FILTERS = {
    profileFor:[],
    age: [],
    maritalStatus: [],
    religion: [],
    caste: [],
    country: [],
    education: [],
    profession: [],
    lifestyle: [],
     habbits: [],
    otherValues: {
        caste: "",
        country: "",
        profession: "",
        religion: "",
        education: "",
    }
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
                <div className="col-auto p-0">
                    <Sidebar filters={filtersDraft} setFilters={setFiltersDraft} onApply={handleApplyFilters} onClear={handleClearFilters} />
                </div>

                <div className="col">
                    <div className="d-flex flex-column align-items-center px-3">

                        {/* Nav + Sort Row */}
                        <div className="d-flex flex-wrap align-items-center justify-content-evenly w-100 py-2 py-md-3 gap-2">

                            <div className="matches_nav d-flex flex-wrap justify-content-center justify-content-md-start gap-2 gap-md-3">
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

                            <div className="sort_div">
                                <MatchesSort sortBy={sortBy} setSortBy={setSortBy} />
                            </div>

                        </div>

                        {/* Nested Route Content */}
                        <div className="w-100 ps-0 ps-md-4">
                            <Outlet context={{ filters, sortBy }} />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Matches;