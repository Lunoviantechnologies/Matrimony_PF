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
import ChatWindow from "../components/ChatWindow";
import ProfileCard from "../components/ProfileCard";
import DashboardLayout from "../pages/DashboardLayout";
import Settings from "../components/Settings";
import ViewReport from "../admin/ViewReport";
import AdminDashboard from "../admin/AdminDashboard";
import RaiseTicket from "../components/RaiseTicket";
import Requests from "../pages/Requests";
import Matches from "../pages/Matches";
import Forgotpassword from "../components/Forgotpassword";

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
                path: "/aboutUs",
                element: <AboutUs />
            },
            {
                path: "/contactUs",
                element: <ContactUs />
            },
            {
                path: "/help",
                element: <RaiseTicket />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path:"forgotpassword",
                element:<Forgotpassword />
            },
        ],
    },
    {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [

            {
                path: "",
                element: <Dashboard />
            },
            {
                path: "editProfile",
                element: <EditProfile />
            },
            {
                path: "viewProfile",
                element: <ProfileView />
            },
            {
                path: "messages",
                element: <ChatWindow />
            },
            {
                path: "matches",
                element: <Matches />,
                children: [
                    {   
                        path: "my_matches",
                        element: <ProfileCard />
                    },
                ]
            },
            {
                path: "requests",
                element: <Requests />
            },
            {
                path: "premium",
                element: <PremiumSubscription />
            },
            {
                path: "subscription/:planId",
                element: <SubscriptionDescription />
            },
            {
                path: "settings",
                element: <Settings />
            },
            {
                path: "viewreport",
                element: <ViewReport />
            },
            {
                path: "adminDashboard",
                element: <AdminDashboard />
            },
            
        ]
    }
]);

export default AppRoutes;
