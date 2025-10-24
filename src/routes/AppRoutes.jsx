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
>>>>>>> 5c569d7c680f3240fa882e9a7eb42bedf2e9b802
            // {
            //     path: "/login", 
            //     element: <Login />
            // },
        ]
    }
]);

export default AppRoutes;