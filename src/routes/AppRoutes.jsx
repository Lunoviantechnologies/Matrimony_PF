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
import ProfileCard from "../components/ProfileCard";
import DashboardLayout from "../pages/DashboardLayout";
import Settings from "../components/Settings";
import ViewReport from "../admin/ViewReport";
import AdminDashboard from "../admin/AdminDashboard";


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
                path: "/register",
                element: <Register />
            },
            {
                path: "/login",
                element: <Login />
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
                path: "profileCard",
                element: <ProfileCard />
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
                path: "/viewreport",
                element: <ViewReport />
            },
            {
                path: "/admindashboard",
                element: <AdminDashboard />
            },
        ]
    }
]);

export default AppRoutes;