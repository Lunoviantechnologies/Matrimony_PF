import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import searchFilterReducer from "../slices/searchFilterSlice";

const store = configureStore({
    reducer: {
        auth : authReducer,
        search : searchFilterReducer 
    },
});

export default store; 