import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notifications",
    initialState: {
        list: [],
    },
    reducers: {
        setNotifications: (state, action) => {
            const unique = new Map();

            [...state.list, ...action.payload].forEach(n => {
                unique.set(n.id, {
                    ...n,
                    read: Boolean(n.read),
                });
            });

            state.list = [...unique.values()];
        },

        addNotification: (state, action) => {
            const notif = action.payload;

            if (!state.list.some(n => n.id === notif.id)) {
                state.list.unshift({
                    ...notif,
                    read: false,
                });
            }
        },

        markRead: (state, action) => {
            const id = action.payload;
            const item = state.list.find(n => n.id === id);
            if (item) item.read = true;
        },

        markAllRead: (state) => {
            state.list.forEach(n => (n.read = true));
        },
    },
});

export const {
    setNotifications,
    addNotification,
    markRead,
    markAllRead,
} = notificationSlice.actions;

export default notificationSlice.reducer;