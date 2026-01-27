import React from "react";

const MatchesSort = ({ sortBy, setSortBy }) => {
    
    return (
        <select
            className="form-select w-auto matches_sortby"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
        >
            <option value="relevance">Relevance</option>
            <option value="newest">Newest First</option>
            <option value="active">Recently Active</option>
            <option value="premium">Premium</option>
            <option value="free">Free</option>
        </select>
    );
};

export default MatchesSort;