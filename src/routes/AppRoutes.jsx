import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from "../pages/Register";
import PremiumSubscription from '../pages/PremiumSubscription';
import Dashboard from "../pages/Dashboard";
import EditProfile from "../pages/EditProfile";
import ProfileView from "../pages/ProfileView";
import AboutUs from "../components/AboutUs";
import ContactUs from "../components/ContactUs";
import ChatWindow from "../components/ChatWindow";
import DashboardLayout from "../pages/DashboardLayout";
import Settings from "../components/Settings";
import ViewReport from "../admin/ViewReport";
import AdminDashboard from "../admin/AdminDashboard";
import RaiseTicket from "../components/RaiseTicket";
import Notification from "../components/Notification";
import ManageUser from "../admin/ManageUser";
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
import PaymentSuccess from "../successPages/PaymentSuccess";
import PaymentFailed from "../successPages/paymentFailure";
import PaymentDisplayData from "../admin/PaymentDisplayData";
import AstroTalkInfo from "../admin/AstroTalkInfo";
import AstroTalkQuery from "../pages/AstroTalkQuery";
import SearchFilters from "../components/SearchFilters";
import Admin_UserTickets from "../admin/Admin_UserTickets";

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
        ],
    },
    {
        path: "payment-success",
        element: <PaymentSuccess />
    },
    {
        path: "payment-failed",
        element: <PaymentFailed />
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
                path: "search",
                element: <SearchFilters />
            },
            {
                path: "settings",
                element: <Settings />
            },
            {
                path: "notifications",
                element: <Notification />
            },
            {
                path: "help",
                element: <RaiseTicket />
            },
            {
                path: "premium",
                element: <PremiumSubscription />
            },
            {
                path: "astroTalkQuery",
                element: <AstroTalkQuery />
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
                path: "user_tickets",
                element: <Admin_UserTickets />
            },
            {
                path: "paymentDisplay",
                element: <PaymentDisplayData />
            },
            {
                path: "astroTalk",
                element: <AstroTalkInfo />
            },
        ]
    }
]);

export default AppRoutes;