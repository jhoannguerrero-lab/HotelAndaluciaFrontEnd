import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login as loginRequest } from '../services/authService'

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setCargando(true)

    try {
      const data = await loginRequest(email, password)
      login(data)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-showcase" aria-label="Presentación del hotel">
        <div className="login-showcase__brand">
          <div className="login-showcase__logo" aria-hidden="true">HA</div>
          <span>Hotel Andalucía</span>
        </div>

        <div className="login-showcase__quote">
          <h1>Sistema de administración hotelera</h1>
          <p>Gestiona habitaciones, reservas y huéspedes desde un mismo lugar.</p>
        </div>

        <ul className="login-showcase__list">
          <li>● Control de disponibilidad de habitaciones en tiempo real</li>
          <li>● Registro y seguimiento de reservas por huésped</li>
          <li>● Acceso diferenciado por rol (consulta / gestión)</li>
        </ul>
      </section>

      <section className="login-panel" aria-label="Formulario de inicio de sesión">
        <div className="login-box">
          <h2>Bienvenido de nuevo</h2>
          <p className="subtitle">Ingresa tus credenciales para administrar el hotel.</p>

          {error && <div className="alert alert-danger" role="alert">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@hotelandalucia.com"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={cargando}>
              {cargando ? 'Ingresando…' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="demo-credentials">
            <strong>Gestor:</strong> admin@hotelandalucia.com / Gestor123!<br />
            <strong>Consulta:</strong> recepcion@hotelandalucia.com / Consulta123!
          </div>
        </div>
      </section>
    </main>
  )
}
