import axios from "axios";
import backendIP from "./api";
import { logout } from "../redux/slices/authSlice";
import store from "../redux/store/store";

const api = axios.create({
    baseURL: backendIP,
});

api.interceptors.request.use(
    (config) => {
        const state = store.getState();
        let token = state?.auth?.token;
        if (!token) {
            token = localStorage.getItem("token");
        }
        if (typeof token === "string" && token.trim()) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// 🚨 Handle expired / invalid token
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            store.dispatch(logout());
        }
        return Promise.reject(error);
    }
);

export default api;