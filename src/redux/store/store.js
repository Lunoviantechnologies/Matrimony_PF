import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import searchReducer from "../slices/searchSlice";
import profilesReducer from "../slices/profileSlice";
import notificationReducer from "../slices/notificationSlice";
import blogReducer from "../slices/blogSlice";
import friendRequestsReducer from "../slices/friendRequestsSlice";

const store = configureStore({
    reducer: {
        auth : authReducer,
        search : searchReducer,
        profiles : profilesReducer,
        notifications : notificationReducer,
        blog : blogReducer,
        friendRequests: friendRequestsReducer,
    },
});

export default store; 