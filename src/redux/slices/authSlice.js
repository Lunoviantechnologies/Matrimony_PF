import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "../thunk/loginThunk";
import { fetchMyProfile } from "../thunk/myProfileThunk";

const intialState = {
    id: localStorage.getItem("id") || null,
    token: localStorage.getItem("token") || null,
    email: localStorage.getItem("email") || null,
    role: localStorage.getItem("role") || null,
    isLoggedIn: !!localStorage.getItem("token"),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState: intialState,
    reducers: {
        logout: (state, action) => {
            state.id = null;
            state.token = null;
            state.email = null;
            state.role = null;
            state.isLoggedIn = false;

            localStorage.removeItem("id");
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            localStorage.removeItem("role");
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                const { id, token, email, role } = action.payload;
                
                state.id = id;
                state.token = token;
                state.email = email;
                state.role = role;
                state.isLoggedIn = true;

                localStorage.setItem("id", JSON.stringify(id));
                localStorage.setItem("token", token);
                localStorage.setItem("email", email);
                localStorage.setItem("role", role);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Login failed";
            })
            .addCase(fetchMyProfile.fulfilled, (state, action) => {
                state.myProfile = action.payload;
            })
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;