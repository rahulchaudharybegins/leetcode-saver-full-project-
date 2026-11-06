import { createBrowserRouter } from "react-router-dom";
import EditProblemPage from "../pages/app/EditProblemPage";

import LandingPage from "../pages/marketing/LandingPage";
import FeaturesPage from "../pages/marketing/FeaturesPage";
import HowItWorksPage from "../pages/marketing/HowItWorksPage";
import AboutPage from "../pages/marketing/AboutPage";
import NotFoundPage from "../pages/marketing/NotFoundPage";

import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";

import OverviewPage from "../pages/app/OverviewPage";
import ProblemsPage from "../pages/app/ProblemsPage";
import ProblemDetailPage from "../pages/app/ProblemDetailPage";
import AnalyticsPage from "../pages/app/AnalyticsPage";
import SettingsPage from "../pages/app/SettingsPage";
import ProfilePage from "../pages/app/ProfilePage";

import MarketingLayout from "../layouts/MarketingLayout";
import AuthLayout from "../layouts/AuthLayout";
import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "../features/auth/ProtectedRoute";

export const router = createBrowserRouter([
  {
    element: <MarketingLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/features", element: <FeaturesPage /> },
      { path: "/how-it-works", element: <HowItWorksPage /> },
      { path: "/about", element: <AboutPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/verify-email", element: <VerifyEmailPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/app",
        element: <AppLayout />,
        children: [
          { index: true, element: <OverviewPage /> },
          { path: "problems", element: <ProblemsPage /> },
          { path: "problems/edit", element: <EditProblemPage /> },
          { path: "problems/:problemId/edit", element: <EditProblemPage /> },
          { path: "problems/:problemId", element: <ProblemDetailPage /> },
          { path: "analytics", element: <AnalyticsPage /> },
          { path: "settings", element: <SettingsPage /> },
          { path: "profile", element: <ProfilePage /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);      