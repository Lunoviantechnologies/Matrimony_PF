import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from "../pages/Register";
import Home from "../pages/Home";
import PremiumSubscription from '../pages/PremiumSubscription';
import SubscriptionDescription from '../pages/SubscriptionDescription';
import Dashboard from "../pages/Dashboard";
import EditProfile from "../pages/EditProfile";
import ProfileView from "../pages/ProfileView";
import Login from "../pages/Login";
import AboutUs from "../components/AboutUs";
import ContactUs from "../components/ContactUs";
import Footer from "../components/Footer";
import ProfileCard from "../components/ProfileCard";

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
            {
                path: "/login",
                element: <Login />
            },
                    {
                path: "/aboutUs",
                element: <AboutUs />
            },
            {
                path: "/contactUs",
                element: <ContactUs />
            },
            {
                path: "/login",
                element: <Login />
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
            {
                path: "/footer",
                element: <Footer/>
            }
        ]
    }
]);

export default AppRoutes;