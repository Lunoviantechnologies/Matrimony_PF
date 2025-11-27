import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ( { children } ) => {
    const { isLoggedIn } = useSelector( state => state.auth );
    const token = localStorage.getItem( "token" );

    if ( !isLoggedIn && !token ) {
        return <Navigate to="/" replace />;
    };

    return children;

};

export default ProtectedRoute;