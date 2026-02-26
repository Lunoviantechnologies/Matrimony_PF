// import React from "react";

// const MatchesSort = ({ sortBy, setSortBy }) => {

//     return (
//         <select
//             className="form-select w-auto matches_sortby"
//             value={sortBy}
//             onChange={(e) => setSortBy(e.target.value)}
//         >
//             <option value="relevance">Relevance</option>
//             <option value="newest">Newest First</option>
//             <option value="active">Recently Active</option>
//             <option value="premium">Premium</option>
//             <option value="free">Free</option>
//         </select>
//     );
// };

// export default MatchesSort;

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSort } from "../redux/slices/matchesSlice";
import { fetchMatches } from "../redux/thunk/matchesThunk";

const MatchesSort = () => {
    const dispatch = useDispatch();
    const sort = useSelector((state) => state.matches.sort);

    const handleChange = (e) => {
        const value = e.target.value;
        dispatch(setSort(value));
        dispatch(fetchMatches());
    };

    return (
        <select
            className="form-select w-auto matches_sortby"
            value={sort}
            onChange={handleChange}
        >
            <option value="RELEVANCE">Relevance</option>
            <option value="NEWEST">Newest First</option>
            <option value="ACTIVE">Recently Active</option>
            <option value="PREMIUM">Premium</option>
            <option value="FREE">Free</option>
        </select>
    );
};

export default MatchesSort;