import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from"../pages/Register";
import Home from "../pages/Home";
import Dashboard from  "../pages/Dashboard";
import EditProfile from "../pages/EditProfile";
import ProfileView from "../pages/ProfileView";


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
                path: "/register", 
            element: <Register />
            },
            {
                path:"/dashboard",
                element:<Dashboard/>
            },
            {
                path:"/editProfile",
                element:<EditProfile/>
            },
            {
                path:"/profileView",
                element:<ProfileView/>
            }
        ]
    }
]);

export default AppRoutes;