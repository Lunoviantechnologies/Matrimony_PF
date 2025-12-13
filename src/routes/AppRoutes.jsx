import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from "../pages/Register";
import Home from "../pages/Home";
import PremiumSubscription from '../pages/PremiumSubscription';
import Dashboard from "../pages/Dashboard";
import EditProfile from "../pages/EditProfile";
import ProfileView from "../pages/ProfileView";
import AboutUs from "../components/AboutUs";
import ContactUs from "../components/ContactUs";
import ChatWindow from "../components/ChatWindow";
// import ProfileCard from "../components/ProfileCard";
import DashboardLayout from "../pages/DashboardLayout";
import Settings from "../components/Settings";
import ViewReport from "../admin/ViewReport";
import AdminDashboard from "../admin/AdminDashboard";
import RaiseTicket from "../components/RaiseTicket";
import Notification from "../components/Notification";
import ManageUser from "../admin/ManageUser";
import ViewProfileModal from "../components/ViewProfileModal";
import Requests from "../pages/Requests";
import Matches from "../pages/Matches";
import Forgotpassword from "../components/Forgotpassword";
import AdminLayout from "../admin/AdminLayout";
import RegisterSuccessPage from "../successPages/registerSuccessPage";
import AdminProfiles from "../admin/AdminProfiles";
import MyMatches from "../pages/Mymatches";
import NearMe from "../pages/Nearme";
import MoreMatches from "../pages/MoreMatches";
import NewMatches from "../pages/Newmatches";
import Accepted from "../pages/Accepted";
import Sent from "../pages/Sent";
import Rejected from "../pages/Rejected";
import Received from "../pages/Received";
import ProtectedRoute from "./ProtectedRoute";
import ManageMatches from "../admin/ManageMatches";
import HomeRedirect from "../pages/HomeRedirect";
import AdminPayments from "../admin/AdminPayments";
import AdminApprovals from "../admin/AdminApprovals";
import AdminSupport from "../admin/AdminSupport";
import PaymentSuccess from "../successPages/PaymentSuccess";
import PaymentFailed from "../successPages/paymentFailure";
const AppRoutes = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <HomeRedirect />
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
                path: "registration-success",
                element: <RegisterSuccessPage />
            },
            {
                path: "premium",
                element: <PremiumSubscription />,
                children: [
                    {
                        path: "payment-success",
                        element: <PaymentSuccess />
                    },
                    {
                        path: "payment-failed",
                        element: <PaymentFailed />
                    }
                ]
            },
        ],
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        ),
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
                path: "messages/:userId",
                element: <ChatWindow />
            },
            {
                path: "matches",
                element: <Matches />,
                children: [
                    {
                        path: "mymatches",
                        element: <MyMatches />
                    },
                    {
                        path: "nearme",
                        element: <NearMe />
                    },
                    {
                        path: "morematches",
                        element: <MoreMatches />
                    },
                    {
                        path: "newmatches",
                        element: <NewMatches />
                    },
                ]
            },
            {
                path: "requests",
                element: <Requests />,
                children: [
                    {
                        path: "accepted",
                        element: <Accepted />
                    },
                    {
                        path: "sent",
                        element: <Sent />
                    },
                    {
                        path: "received",
                        element: <Received />
                    },
                    {
                        path: "rejected",
                        element: <Rejected />
                    },
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
        element: (
            <ProtectedRoute>
                <AdminLayout />
            </ProtectedRoute>
        ),
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
                path: "payments",
                element: <AdminPayments />
            },
            {
                path: "aprovals",
                element: <AdminApprovals />
            },
            {
                path: "manageusers",
                element: <ManageUser />
            },
            {
                path: "managematches",
                element: <ManageMatches />
            },
            {
                path: "adminprofiles",
                element: <AdminProfiles />
            },
            {
                path: "support",
                element: < AdminSupport />
            },
        ]
    }
]);

export default AppRoutes;