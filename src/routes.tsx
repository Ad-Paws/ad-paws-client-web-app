import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthenticationLayout from "./layouts/AuthenticationLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import Login from "./pages/authentication/login";
import ClientSignup from "./pages/authentication/ClientSignup";
import VerifyEmail from "./pages/authentication/VerifyEmail";
import RequestPasswordReset from "./pages/authentication/RequestPasswordReset";
import ResetPassword from "./pages/authentication/ResetPassword";
import LinkCompany from "./pages/onboarding/LinkCompany";
import Dashboard from "./pages/dashboard/Dashboard";
import DogProfile from "./pages/dog/DogProfile";
import NewDog from "./pages/dog/NewDog";
import Profile from "./pages/profile/Profile";
import NewReservation from "./pages/booking/NewReservation";
import ReservationDetail from "./pages/reservations/ReservationDetail";

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
    /* Antes que la ruta dinámica: "nuevo" no es un id. */
    path: "/mis-perros/nuevo",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        Component: NewDog,
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
    /**
     * El perfil sigue accesible sin negocio: `me` y `updateUser` no necesitan
     * empresa activa, y es la única forma de que alguien sin vincular pueda
     * corregir sus datos o cerrar sesión.
     */
    path: "/perfil",
    element: (
      <ProtectedRoute allowWithoutCompany>
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
    path: "/reservar",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        Component: NewReservation,
      },
    ],
  },
  {
    path: "/reservas/:reservationId",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        Component: ReservationDetail,
      },
    ],
  },
  {
    path: "/vincular-negocio",
    element: (
      <ProtectedRoute allowWithoutCompany>
        <LinkCompany />
      </ProtectedRoute>
    ),
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
      {
        path: "recuperar",
        Component: RequestPasswordReset,
      },
      {
        path: "restablecer",
        Component: ResetPassword,
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
