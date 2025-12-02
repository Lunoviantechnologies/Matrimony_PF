import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Home from "./Home";

const HomeRedirect = () => {

    const { isLoggedIn, token } = useSelector( state => state.auth );

    if( isLoggedIn || token ) {
        return <Navigate to="/dashboard" replace/>
    }

    return <Home/>
};

export default HomeRedirect;