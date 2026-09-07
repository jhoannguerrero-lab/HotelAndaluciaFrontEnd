import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'hotel_andalucia_auth'

function leerSesionGuardada() {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : null
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(leerSesionGuardada)

  function login({ token, nombreCompleto, rol }) {
    const sesion = { token, nombreCompleto, rol }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sesion))
    setAuth(sesion)
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setAuth(null)
  }

  const value = {
    token: auth?.token ?? null,
    nombreCompleto: auth?.nombreCompleto ?? null,
    rol: auth?.rol ?? null,
    isAuthenticated: Boolean(auth?.token),
    isGestor: auth?.rol === 'GESTOR',
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>')
  }
  return context
}
