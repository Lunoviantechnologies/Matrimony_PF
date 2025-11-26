import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from "../pages/Register";
import Home from "../pages/Home";
import PremiumSubscription from '../pages/PremiumSubscription';
import SubscriptionDescription from '../pages/SubscriptionDescription';
import Dashboard from "../pages/Dashboard";
import EditProfile from "../pages/EditProfile";
import ProfileView from "../pages/ProfileView";
import AboutUs from "../components/AboutUs";
import ContactUs from "../components/ContactUs";
import ChatWindow from "../components/ChatWindow";
import ProfileCard from "../components/ProfileCard";
import DashboardLayout from "../pages/DashboardLayout";
import Settings from "../components/Settings";
import ViewReport from "../admin/ViewReport";
import AdminDashboard from "../admin/AdminDashboard";
import RaiseTicket from "../components/RaiseTicket";
import Notification from "../components/Notification";
import ManageUser from "../admin/ManageUser";
import ViewProfileModal from "../components/viewprofileModal";
import Requests from "../pages/Requests";
import Matches from "../pages/Matches";
import Cart from "../components/Cart";
import Forgotpassword from "../components/Forgotpassword";
import AdminLayout from "../admin/AdminLayout";
import RegisterSuccessPage from "../successPages/registerSuccessPage";

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
                path: "forgotpassword",
                element: <Forgotpassword />
            },
            {
                path: "premium",
                element: <PremiumSubscription />
            },
            {
                path: "cart/:planId",
                element: <Cart />
            },
            {
                path: "registration-success",
                element: <RegisterSuccessPage />
            },
        ]
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
                    {
                        path: "view_profile/:profileId",
                        element: <ViewProfileModal />
                    }
                ]
            },
            {  
                path: "requests",
                element: <Requests />
            },
            {
                path: "settings",
                element: <Settings />
            },
            {
                path: "notifications",
                element: <Notification />
            },
        ]
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            {
                path: "",
                element: <AdminDashboard />
            },
            {
                path: "viewreport",
                element: <ViewReport />
            },
            {
                path: "manageusers",
                element: <ManageUser />
            },
        ]
    }
]);

export default AppRoutes;