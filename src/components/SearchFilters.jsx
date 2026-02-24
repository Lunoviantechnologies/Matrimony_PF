import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchText, clearSearchResults } from "../redux/slices/searchSlice";
import { searchProfiles } from "../redux/thunk/searchThunk";
import SearchProfiles from "./SearchProfiles";
import "../styleSheets/searchpage.css";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import { setPage } from "../redux/slices/searchSlice";

const SearchFilters = () => {
    const dispatch = useDispatch();
    const { searchText, page, size } = useSelector((state) => state.search);
    const { id, myProfile } = useSelector((state) => state.auth);

    const [debouncedSearch, setDebouncedSearch] = useState("");

    const handleSearch = (e) => {
        dispatch(setSearchText(e.target.value));
    };

    useEffect(() => {
        if(id){
            dispatch(fetchMyProfile(id));
        }
    }, [id, dispatch]);

    // debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchText);
            dispatch(setPage(0));
        }, 500);

        return () => clearTimeout(timer);
    }, [searchText]);

    // call backend
    useEffect(() => {
        if (!id || !myProfile?.gender) return;
        dispatch(searchProfiles({filters: { myId: id, myGender: myProfile?.gender, search: debouncedSearch, }, page, size,}));
    }, [debouncedSearch, page, size, id, myProfile?.gender, dispatch]);

    // cleanup
    useEffect(() => {
        return () => {
            dispatch(setSearchText(""));
            dispatch(clearSearchResults());
        };
    }, [dispatch]);

    return (
        <div className="search-page">
            <div className="d-flex align-items-center justify-content-center">
                <input
                    type="search"
                    className="searchfilter"
                    placeholder="Enter your filters..."
                    value={searchText}
                    onChange={handleSearch}
                />
            </div>

            <SearchProfiles />
        </div>
    );
};

export default SearchFilters;