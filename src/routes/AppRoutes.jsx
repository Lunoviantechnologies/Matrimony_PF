import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Dashboard from  "../pages/Dashboard";
// import Login from "../pages/Login";

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
                path:"/dashboard",
                element:<Dashboard />
            },
            // {
            //     path: "/login",
            //     element: <Login />
            // },
        ]
    }
]);

export default AppRoutes;