import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "../thunk/loginThunk";
import { fetchMyProfile } from "../thunk/myProfileThunk";

const isTokenExpired = (exp) => {
    if (!exp) return true;
    return exp * 1000 < Date.now();
};

const storedToken = localStorage.getItem("token");
const storedExp = localStorage.getItem("exp") ? JSON.parse(localStorage.getItem("exp")) : null;
const expired = storedToken && isTokenExpired(storedExp);
if (expired) {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("exp");
};

const initialState = {
    id: expired ? null : JSON.parse(localStorage.getItem("id")),
    token: expired ? null : storedToken,
    email: expired ? null : localStorage.getItem("email"),
    role: expired ? null : JSON.parse(localStorage.getItem("role")),
    exp: expired ? null : storedExp,
    isLoggedIn: !expired && !!storedToken,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state, action) => {
            state.id = null;
            state.token = null;
            state.email = null;
            state.role = null;
            state.exp = null;
            state.isLoggedIn = false;

            localStorage.removeItem("id");
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            localStorage.removeItem("role");
            localStorage.removeItem("exp");
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
                const { id, token, email, role, exp } = action.payload;

                state.id = id;
                state.token = token;
                state.email = email;
                state.role = role;
                state.exp = Number(exp);
                state.isLoggedIn = true;

                localStorage.setItem("id", JSON.stringify(id));
                localStorage.setItem("token", token);
                localStorage.setItem("email", email);
                localStorage.setItem("role", JSON.stringify(role));
                localStorage.setItem("exp", JSON.stringify(Number(exp)));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Login failed";
            })
            .addCase(fetchMyProfile.fulfilled, (state, action) => {
                state.myProfile = action.payload;
                state.premium = action.payload;
            })
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;