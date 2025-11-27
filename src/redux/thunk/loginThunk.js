import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import backendIP from "../../api/api";
import { jwtDecode } from "jwt-decode";

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ emailId, createPassword }, { rejectWithValue }) => {
        try {
            const response  = await axios.post(`${backendIP}/auth/login`, { emailId, createPassword });
            const token = response.data.token;
            const decodedToken = jwtDecode(token);

            return { 
                token, 
                id : decodedToken.userId,
                email : decodedToken.sub,
                role : decodedToken.roles
            }
        } catch (err) {
            return rejectWithValue(err.response?.data || "Login failed");
        }
    }
);