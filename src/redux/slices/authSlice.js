import { createSlice } from "@reduxjs/toolkit"; 

const intialState = {
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState: intialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
});

const { setUser } = authSlice.actions;

export default authSlice.reducer;