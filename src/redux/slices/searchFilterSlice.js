import { createSlice } from "@reduxjs/toolkit";

const searchFilterSlice = createSlice({
    name: "search",
    initialState: {
        searchFilterText: ""
    },
    reducers: {
        setSearchFilterText: (state, action) => {
            state.searchFilterText = action.payload;
        }
    } 
});

export const { setSearchFilterText } = searchFilterSlice.actions;
export default searchFilterSlice.reducer;