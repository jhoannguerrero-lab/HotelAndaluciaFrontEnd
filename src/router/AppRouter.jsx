import { createBrowserRouter, Navigate } from 'react-router-dom'

import ProtectedLayout from '../components/ProtectedLayout'
import RequireGestor from '../components/RequireGestor'

import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/DashboardPage'
import HabitacionesPage from '../pages/HabitacionesPage'
import HabitacionFormPage from '../pages/HabitacionFormPage'
import ReservasPage from '../pages/ReservasPage'
import ReservaFormPage from '../pages/ReservaFormPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    // Todas las rutas hijas pasan por ProtectedLayout: si no hay
    // sesion, redirige a /login. Si hay sesion, dibuja el sidebar +
    // topbar y renderiza la pagina pedida dentro.
    element: <ProtectedLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/habitaciones', element: <HabitacionesPage /> },
      { path: '/reservas', element: <ReservasPage /> },
      {
        // Estas dos ademas requieren rol GESTOR (RequireGestor
        // envuelve por dentro de ProtectedLayout, asi que ya se sabe
        // que hay sesion, solo falta validar el rol).
        element: <RequireGestor />,
        children: [
          { path: '/habitaciones/nueva', element: <HabitacionFormPage /> },
          { path: '/reservas/nueva', element: <ReservaFormPage /> },
        ],
      },
    ],
  },
])
