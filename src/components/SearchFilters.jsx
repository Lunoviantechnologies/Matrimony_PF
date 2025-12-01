import React from "react";
import { useDispatch } from "react-redux";
import { setSearchFilterText } from "../redux/slices/searchFilterSlice";

const SearchFilters = () => {

    const dispatch = useDispatch();

    const handleSearch = (e) => {
        dispatch(setSearchFilterText(e.target.value));
        // console.log("Search filter text:", e.target.value);
    };

    return (
        <div className="d-flex align-items-center h-100">
            <input type="search" className="searchfilter" placeholder="Enter your filters..."  onChange={handleSearch}/>  
        </div>
    );
};

export default SearchFilters;  