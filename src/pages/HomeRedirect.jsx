import React, { lazy } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
const Home = lazy(() => import("./Home"));

const HomeRedirect = () => {

    const { isLoggedIn, token } = useSelector( state => state.auth );

    if( isLoggedIn || token ) {
        return <Navigate to="/dashboard" replace/>
    }

    return <Home/>
};

export default HomeRedirect;