import { createSlice } from "@reduxjs/toolkit";
import { searchProfiles } from "../thunk/searchThunk";

const initialState = {
    searchText: "",
    results: [],
    totalPages: 0,
    totalElements: 0,
    page: 0,
    size: 10,
    loading: false,
    error: null,
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setSearchText: (state, action) => {
            state.searchText = action.payload;
        },
        clearSearchResults: (state) => {
            state.results = [];
            state.totalPages = 0;
            state.totalElements = 0;
            state.page = 0;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchProfiles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchProfiles.fulfilled, (state, action) => {
                state.loading = false;

                const payload = action.payload || {};
                state.results = payload.content || [];
                state.totalPages = payload.totalPages ?? 0;
                state.totalElements = payload.totalElements ?? 0;

                state.page = payload.number ?? state.page;
                state.size = payload.size ?? state.size;
            })
            .addCase(searchProfiles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setSearchText, clearSearchResults, setPage } = searchSlice.actions;

export default searchSlice.reducer;