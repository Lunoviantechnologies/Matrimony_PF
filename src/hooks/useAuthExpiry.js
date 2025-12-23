import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { toast } from "react-toastify";

export default function useAuthExpiry() {
    const dispatch = useDispatch();
    const { exp, token } = useSelector(state => state.auth);

    /* 🔴 1. Logout immediately if token already expired (page reload case) */
    useEffect(() => {
        if (exp && Date.now() >= exp * 1000) {
            dispatch(logout());
        }
    }, [exp, dispatch]);

    useEffect(() => {
        if (!token || !exp) return;
        const expiryTime = exp * 1000 - Date.now();
        if (expiryTime <= 0) {
            dispatch(logout());
            return;
        }

        const timeoutId = setTimeout(() => {
            toast.info("Session expired. Please login again.");
            dispatch(logout());
        }, expiryTime);

        return () => clearTimeout(timeoutId);
    }, [exp, token, dispatch]);
};