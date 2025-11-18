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
<<<<<<< HEAD
import Notification from "../components/Notification";
import ManageUsers from "../admin/ManageUser";
import ViewProfileModal from "../components/viewprofileModal";
=======
import Requests from "../pages/Requests";
import Matches from "../pages/Matches";
import Cart from "../components/Cart";
import Forgotpassword from "../components/Forgotpassword";

>>>>>>> b8aae4230fdcdc979ac0002bd2aa82a5da89680f
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
<<<<<<< HEAD
             {
                path: "/manageusers",
                element: <ManageUsers />
             },
              
            {
                path: "/viewprofilemodal",
                element: <ViewProfileModal />
            },
             {
                path: "profilecard",
                element: <ProfileCard />
            }
        ]
=======
            {
                path:"forgotpassword",
                element:<Forgotpassword />
            },
        ],
>>>>>>> b8aae4230fdcdc979ac0002bd2aa82a5da89680f
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
                path: "cart/:planId",
                element: <Cart />
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
<<<<<<< HEAD
            {
                path: "notification",
                element: <Notification />
            },
           
=======
            
>>>>>>> b8aae4230fdcdc979ac0002bd2aa82a5da89680f
        ]
    }
]);

export default AppRoutes;
