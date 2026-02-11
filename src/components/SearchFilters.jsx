import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchFilterText } from "../redux/slices/searchFilterSlice";
import SearchProfiles from "./SearchProfiles";
import "../styleSheets/searchpage.css";

const SearchFilters = () => {

    const searchText = useSelector(state => state.search.searchFilterText);
    const dispatch = useDispatch();

    const handleSearch = (e) => {
        dispatch(setSearchFilterText(e.target.value));
        // console.log("Search filter text:", e.target.value);
    };

    useEffect(() => {
        return () => dispatch(setSearchFilterText(""));
    }, []);

    return (
        <div className="search-page">
            <div className="d-flex align-items-center justify-content-center">
                <input type="search" className="searchfilter" placeholder="Enter your filters..." value={searchText} onChange={handleSearch} />
            </div>

            <div>
                <SearchProfiles />
            </div>
        </div>
    );
};

export default SearchFilters;  