import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MatchesSort from "./MatchesSort";
import { useSelector } from "react-redux";
import "../styleSheets/matches/matchLayout.css";

const EMPTY_FILTERS = {
    profileFor: [],
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
    },
};

const Matches = () => {
    const [filtersDraft, setFiltersDraft] = useState(EMPTY_FILTERS);
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [sortBy, setSortBy] = useState("relevance");

    const handleApplyFilters = () => {
        setFilters(filtersDraft);

        // close mobile offcanvas
        const offcanvas = document.getElementById("mobileFilters");
        if (offcanvas) {
            const bs = window.bootstrap.Offcanvas.getInstance(offcanvas);
            bs?.hide();
        }
    };

    const handleClearFilters = () => {
        setFiltersDraft(EMPTY_FILTERS);
        setFilters(EMPTY_FILTERS);
        setSortBy("relevance");
    };

    const myProfile = useSelector((state) => state.auth.myProfile);
    const isPremiumActive = !!myProfile?.premium;

    return (
        <div className="container-fluid">
            <div className="row min-vh-100">

                {/* Desktop Sidebar */}
                <div className="col-md-3 d-none d-md-block p-0">
                    <Sidebar
                        filters={filtersDraft}
                        setFilters={setFiltersDraft}
                        onApply={handleApplyFilters}
                        onClear={handleClearFilters}
                    />
                </div>

                {/* Main Area */}
                <div className="col">

                    <div className="px-2 px-md-3">

                        {/* HEADER */}
                        <div className="matches-header">

                            {/* ROW 1 — TABS */}
                            <div className="matches-tabs">

                                <NavLink end to="newmatches"
                                    className={({ isActive }) =>
                                        `matches_link ${isActive ? "active" : ""}`
                                    }>
                                    New Matches
                                </NavLink>

                                <NavLink to="mymatches"
                                    className={({ isActive }) =>
                                        `matches_link ${isActive ? "active" : ""}`
                                    }>
                                    My Matches
                                </NavLink>

                                <NavLink to="nearme"
                                    className={({ isActive }) =>
                                        `matches_link ${isActive ? "active" : ""}`
                                    }>
                                    Near Me
                                </NavLink>

                                <NavLink to="morematches"
                                    className={({ isActive }) =>
                                        `matches_link ${isActive ? "active" : ""}`
                                    }>
                                    More Matches
                                </NavLink>

                            </div>

                            {/* ROW 2 — FILTER + SORT */}
                            <div className="matches-controls">

                                {/* mobile filter button */}
                                <button
                                    className="btn btn-primary d-md-none"
                                    data-bs-toggle="offcanvas"
                                    data-bs-target="#mobileFilters"
                                >
                                    Filters
                                </button>

                                <MatchesSort
                                    sortBy={sortBy}
                                    setSortBy={setSortBy}
                                />

                            </div>

                        </div>

                        {/* CONTENT */}
                        <div className="w-100 mt-2">
                            <Outlet context={{ filters, sortBy, isPremiumActive }} />
                        </div>

                    </div>

                </div>
            </div>

            {/* MOBILE FILTER DRAWER */}
            <div
                className="offcanvas offcanvas-start"
                tabIndex="-1"
                id="mobileFilters"
            >
                <div className="offcanvas-header">
                    <h5>Filters</h5>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                    />
                </div>

                <div className="offcanvas-body p-0">
                    <Sidebar
                        filters={filtersDraft}
                        setFilters={setFiltersDraft}
                        onApply={handleApplyFilters}
                        onClear={handleClearFilters}
                    />
                </div>
            </div>

        </div>
    );
};

export default Matches;