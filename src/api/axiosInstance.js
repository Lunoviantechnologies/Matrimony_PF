import axios from "axios";
import backendIP from "./api";

const api = axios.create({
    baseURL: backendIP,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (typeof token === "string" && token.trim()) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;