import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import EditProfile from "../pages/EditProfile";
import ProfileView from "../pages/ProfileView";
import Login from "../pages/Login";
import AboutUs from "../components/AboutUs";
import ContactUs from "../components/ContactUs";

const AppRoutes = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
<<<<<<< HEAD
                path : "/editProfile",
                element : <EditProfile />
            },
            {
                path : "/viewProfile",
                element : <ProfileView />
            }
            
=======
                path:"/register",
                element:<Register/>
            },
            {
                path: "/dashboard",
                element: <Dashboard />
            },
            {
                path: "/editProfile",
                element: <EditProfile />
            },
            {
                path: "/profileView",
                element: <ProfileView />
            },
        ]
    }
]);

export default AppRoutes;