import { createSlice } from "@reduxjs/toolkit";
import { fetchMatches } from "../thunk/matchesThunk";
import { sendFriendRequest } from "../thunk/friendRequestsThunk";

const initialState = {
    items: [],
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,

    filters: {},
    sort: "RELEVANCE",
    matchType: "NEW",

    sentRequestIds: [],
    sendingRequestIds: [],

    loading: false,
    error: null,
};

const matchesSlice = createSlice({
    name: "matches",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = action.payload;
            state.page = 0; // reset page when filters change
        },

        setSort: (state, action) => {
            state.sort = action.payload;
            state.page = 0; // reset page when sort changes
        },

        setPage: (state, action) => {
            state.page = action.payload;
        },

        setMatchType: (state, action) => {
            state.matchType = action.payload;
            state.page = 0; // reset page when tab changes
        },

        resetMatchesState: () => initialState,
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchMatches.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMatches.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.content;
                state.page = action.payload.page;
                state.size = action.payload.size ?? state.size ?? 10;
                state.totalPages = action.payload.totalPages;
                state.totalElements = action.payload.totalElements;
            })
            .addCase(fetchMatches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(sendFriendRequest.pending, (state, action) => {
                state.sendingRequestIds.push(action.meta.arg.receiverId);
            })

            // on success, move from sendingRequestIds to sentRequestIds
            .addCase(sendFriendRequest.fulfilled, (state, action) => {
                state.sendingRequestIds =
                    state.sendingRequestIds.filter(id => id !== action.payload);

                state.sentRequestIds.push(action.payload);
            })

            .addCase(sendFriendRequest.rejected, (state, action) => {
                state.sendingRequestIds =
                    state.sendingRequestIds.filter(
                        id => id !== action.meta.arg.receiverId
                    );
            });
    },
});

export const { setFilters, setSort, setPage, setMatchType, resetMatchesState, } = matchesSlice.actions;
export default matchesSlice.reducer;