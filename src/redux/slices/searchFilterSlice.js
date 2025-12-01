import { createSlice } from "@reduxjs/toolkit";

const searchFilterSlice = createSlice({
    name: "search",
    initialState: {
        text: ""
    },
    reducers: {
        setSearchText: (state, action) => {
            state.text = action.payload;
        }
    } 
});

export const { setSearchText } = searchFilterSlice.actions;
export default searchFilterSlice.reducer;