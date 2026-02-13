import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import searchFilterReducer from "../slices/searchFilterSlice";
import profilesReducer from "../slices/profileSlice";
import notificationReducer from "../slices/notificationSlice";
import blogReducer from "../slices/blogSlice";

const store = configureStore({
    reducer: {
        auth : authReducer,
        search : searchFilterReducer,
        profiles : profilesReducer,
        notifications : notificationReducer,
        blog : blogReducer,
    },
});

export default store; 