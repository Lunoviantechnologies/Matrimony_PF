import { createBrowserRouter, Navigate } from "react-router-dom";
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
import AdminSupport from "../admin/AdminSupport";
import TermsConditions from "../components/privacyInfo/TermsCondition";
import PrivacyPolicy from "../components/privacyInfo/PrivacyPolicy";
import RefundPolicy from "../components/privacyInfo/RefundPolicy";
import Disclaimer from "../components/privacyInfo/Disclaimer";
import CommunityGuidelines from "../components/privacyInfo/CommunityGuidelines";
import ChatReport from "../admin/ChatReport";
import Resourses from "../components/Resources";
import ReferralLanding from "../components/ReferralLanding";
import DashboardAds from "../pages/DashboardAds";
import RelationshipManager from "../admin/RelationshipManager";
import AdminSettings from "../admin/adminSettings/AdminSettings";
import Login from "../pages/Login";
import BlogDashboard from "../admin/createBlog/BlogDashboard";
import BlogForm from "../admin/createBlog/BlogForm";
import EditBlog from "../admin/createBlog/EditBlog";
import BlogList from "../components/blogDisplay/BlogList";
import BlogDetails from "../components/blogDisplay/BlogDetails";

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
                path: "/resources",
                element: <Resourses />,
                children: [
                    { path: "blog", element: <BlogList /> },
                    { path: "blog/:slug", element: <BlogDetails /> },
                ]
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/referral/:code",
                element: <ReferralLanding />
            },
            {
                path: "/login",
                element: <Login />
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
                path: "terms&conditions",
                element: <TermsConditions />
            },
            {
                path: "privacy_policy",
                element: <PrivacyPolicy />
            },
            {
                path: "/refund-policy",
                element: <RefundPolicy />
            },
            {
                path: "/disclaimer",
                element: <Disclaimer />
            },
            {
                path: "/community-guidelines",
                element: <CommunityGuidelines />
            }
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
                path: "dashboardads",
                element: <DashboardAds />
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
                    { index: true, element: <Navigate to="newmatches" replace /> },
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
                    { index: true, element: <Navigate to="received" replace /> },
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
            {
                path: "admin_support",
                element: <AdminSupport />
            },
            {
                path: "admin_chat_report",
                element: <ChatReport />
            },
            {
                path: "relationship_manager",
                element: <RelationshipManager />
            },
            {
                path: "admin_settings",
                element: <AdminSettings />
            },
            {
                path: "blogs",
                element: <BlogDashboard />
            },
            {
                path: "blog/create",
                element: <BlogForm />
            },
            {
                path: "/admin/blog/edit/:id",
                element: <EditBlog />
            }
        ]

    }
]);

export default AppRoutes;