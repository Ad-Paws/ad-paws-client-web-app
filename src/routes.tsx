import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthenticationLayout from "./layouts/AuthenticationLayout";
import Login from "./pages/authentication/login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import ClientSignup from "./pages/authentication/ClientSignup";
import VerifyEmail from "./pages/authentication/VerifyEmail";
import Profile from "./pages/profile/Profile";
import DogProfile from "./pages/dog/DogProfile";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Navigate to="/inicio" />
      </ProtectedRoute>
    ),
  },
  {
    path: "/inicio",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        Component: Dashboard,
        handle: {
          title: "AdPaws | Inicio",
        },
      },
    ],
  },
  {
    path: "/mis-perros/:dogId",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        Component: DogProfile,
      },
    ],
  },
  {
    path: "/perfil",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        Component: Profile,
      },
    ],
  },
  {
    path: "/auth",
    element: (
      <PublicRoute>
        <AuthenticationLayout />
      </PublicRoute>
    ),
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "verificar-cuenta",
        Component: VerifyEmail,
      },
    ],
  },
  {
    path: "/registro-cliente",
    element: (
      <PublicRoute>
        <ClientSignup />
      </PublicRoute>
    ),
    children: [
      {
        path: "",
        Component: ClientSignup,
      },
    ],
  },
]);
