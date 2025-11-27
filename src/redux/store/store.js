import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import searchFilterReducer from "../slices/searchFilterSlice";
import profilesReducer from "../slices/profileSlice";

const store = configureStore({
    reducer: {
        auth : authReducer,
        search : searchFilterReducer,
        profiles : profilesReducer,
    },
});

export default store; 