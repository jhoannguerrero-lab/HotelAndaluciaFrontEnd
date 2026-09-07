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

    element: <ProtectedLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/habitaciones', element: <HabitacionesPage /> },
      { path: '/reservas', element: <ReservasPage /> },
      {
        element: <RequireGestor />,
        children: [
          { path: '/habitaciones/nueva', element: <HabitacionFormPage /> },
          { path: '/reservas/nueva', element: <ReservaFormPage /> },
        ],
      },
    ],
  },
])
