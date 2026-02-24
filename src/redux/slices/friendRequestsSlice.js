import { createSlice } from "@reduxjs/toolkit";
import { fetchFriendRequests, respondToRequest, cancelFriendRequest, } from "../thunk/friendRequestsThunk";

const initialState = {
    requestsByType: {
        received: [],
        sent: [],
        accepted: [],
        rejected: [],
    },
    loading: false,
    error: null,
};

const friendRequestSlice = createSlice({
    name: "friendRequests",
    initialState,
    reducers: {
        clearFriendRequests: (state) => {
            state.requestsByType = {
                received: [],
                sent: [],
                accepted: [],
                rejected: [],
            };
        },
    },
    extraReducers: (builder) => {
        builder

            /* ================= FETCH ================= */

            .addCase(fetchFriendRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFriendRequests.fulfilled, (state, action) => {
                state.loading = false;

                const { type, data } = action.payload;
                state.requestsByType[type] = data;
            })
            .addCase(fetchFriendRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* ================= RESPOND ================= */

            .addCase(respondToRequest.fulfilled, (state, action) => {
                const { requestId, type } = action.payload;

                state.requestsByType[type] =
                    state.requestsByType[type].filter(
                        (req) => req.requestId !== requestId
                    );
            })
            .addCase(respondToRequest.rejected, (state, action) => {
                state.error = action.payload;
            })

            // cancel sent request
            .addCase(cancelFriendRequest.fulfilled, (state, action) => {
                const { requestId, type } = action.payload;

                state.requestsByType[type] =
                    state.requestsByType[type].filter(
                        req => req.requestId !== requestId
                    );
            })
},
});

export const { clearFriendRequests } = friendRequestSlice.actions;
export default friendRequestSlice.reducer;