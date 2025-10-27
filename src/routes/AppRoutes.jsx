import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from"../pages/Register";
import Home from "../pages/Home";
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
                path : "/editProfile",
                element : <EditProfile />
            },
            {
                path : "/viewProfile",
                element : <ProfileView />
            },
            {
                path:"/register",
                element:<Register/>
            },
            // {
            //     path: "/login", 
            //     element: <Login />
            // },
        ]
    }
]);

export default AppRoutes;