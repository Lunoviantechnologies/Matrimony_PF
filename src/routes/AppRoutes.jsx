import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from "../pages/Register";
import Home from "../pages/Home";
<<<<<<< HEAD
import PremiumSubscription from '../pages/PremiumSubscription';
import SubscriptionDescription from '../pages/SubscriptionDescription';
// import Login from "../pages/Login";
=======
import Dashboard from "../pages/Dashboard";
import EditProfile from "../pages/EditProfile";
import ProfileView from "../pages/ProfileView";
import Login from "../pages/Login";
import AboutUs from "../components/AboutUs";
import ContactUs from "../components/ContactUs";
import Footer from "../components/Footer";
>>>>>>> 46fc466a5eb8175bfb2c4a1f07e7b63b44dd7429

const AppRoutes = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />
            },
<<<<<<< HEAD
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
=======
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
>>>>>>> 46fc466a5eb8175bfb2c4a1f07e7b63b44dd7429
        ]
    }
]);

export default AppRoutes;