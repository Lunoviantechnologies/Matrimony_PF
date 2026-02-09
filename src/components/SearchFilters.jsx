import React from "react";
import { useDispatch } from "react-redux";
import { setSearchFilterText } from "../redux/slices/searchFilterSlice";
import SearchProfiles from "./SearchProfiles";
import "../styleSheets/searchpage.css";

const SearchFilters = () => {

    const dispatch = useDispatch();

    const handleSearch = (e) => {
        dispatch(setSearchFilterText(e.target.value));
        // console.log("Search filter text:", e.target.value);
    };

    return (
        <div className="search-page">
            <div className="d-flex align-items-center justify-content-center">
                <input type="search" className="searchfilter" placeholder="Enter your filters..." onChange={handleSearch} />
            </div>

            <div>
                <SearchProfiles />
            </div>
        </div>
    );
};

export default SearchFilters;  