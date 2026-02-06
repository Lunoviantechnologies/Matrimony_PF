import api from "../../api/axiosInstance";
import { setNotifications } from "../slices/notificationSlice";

export const fetchNotifications = (userId) => async dispatch => {
    try {
        const res = await api.get(`/notifications/GetAll?userId=${userId}`);

        const data = Array.isArray(res.data)
            ? res.data
            : res.data?.content || [];

        dispatch(setNotifications(data));
    } catch (err) {
        console.error("Notification fetch failed:", err);
    }
};