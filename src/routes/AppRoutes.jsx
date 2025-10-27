import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import PremiumSubscription from '../pages/PremiumSubscription';
import SubscriptionDescription from '../pages/SubscriptionDescription';
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
                path: "/premium",
                element: <PremiumSubscription />
            },
               {
                path: "/subscription/:planId",
                element: <SubscriptionDescription />
            },
            // {
            //     path: "/login",
            //     element: <Login />
            // },
        ]
    }
]);

export default AppRoutes;