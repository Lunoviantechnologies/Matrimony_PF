import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import searchFilterReducer from "../slices/searchFilterSlice";
import profilesReducer from "../slices/profileSlice";
import notificationReducer from "../slices/notificationSlice";

const store = configureStore({
    reducer: {
        auth : authReducer,
        search : searchFilterReducer,
        profiles : profilesReducer,
        notifications : notificationReducer,
    },
});

export default store; 