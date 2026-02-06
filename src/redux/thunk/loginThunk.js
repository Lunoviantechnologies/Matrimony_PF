import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import backendIP from "../../api/api";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ emailId, createPassword }, { rejectWithValue }) => {
        try {
            const response  = await axios.post(`${backendIP}/auth/login`, { emailId, createPassword });
            const token = response.data.token;
            const decodedToken = jwtDecode(token);

            // 🔗 Apply referral code (if user came from referral link)
            try {
                const referralCode = localStorage.getItem("referralCode");
                if (referralCode) {
                    await axios.post(
                        `${backendIP}/referrals/use-code`,
                        { referralCode },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    localStorage.removeItem("referralCode");
                }
            } catch (refErr) {
                // Fail silently – do not block login if referral apply fails
                // console.error("Failed to apply referral code:", refErr);
            }

            return { 
                token, 
                id : decodedToken.id,
                email : decodedToken.sub,
                role : decodedToken.roles,
                exp: decodedToken.exp
            }
        } catch (err) {
            // console.log("err login : ", err);
            toast.error(err.response.data);
            return rejectWithValue(err.response?.data || "Login failed");
        }
    }
);