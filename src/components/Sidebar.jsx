import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const { nombreCompleto, rol, logout } = useAuth()

  const iniciales = nombreCompleto
    ? nombreCompleto.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
    : '--'

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo" aria-hidden="true">HA</div>
        <div className="sidebar__title">
          Andalucía
          <small>Panel administrativo</small>
        </div>
      </div>

      <p className="sidebar__section-label">Principal</p>
      <nav className="nav-menu" aria-label="Menú principal">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-menu__link${isActive ? " active" : ""}`}>🏠 Dashboard</NavLink>
      </nav>

      <p className="sidebar__section-label">Habitaciones</p>
      <nav className="nav-menu" aria-label="Menú de habitaciones">
        <NavLink to="/habitaciones" end className={({ isActive }) => `nav-menu__link${isActive ? " active" : ""}`}>🛏️ Ver habitaciones</NavLink>
        {rol === 'GESTOR' && (
          <NavLink to="/habitaciones/nueva" className={({ isActive }) => `nav-menu__link${isActive ? " active" : ""}`}>➕ Registrar habitación</NavLink>
        )}
      </nav>

      <p className="sidebar__section-label">Reservas</p>
      <nav className="nav-menu" aria-label="Menú de reservas">
        <NavLink to="/reservas" end className={({ isActive }) => `nav-menu__link${isActive ? " active" : ""}`}>📖 Ver reservas</NavLink>
        {rol === 'GESTOR' && (
          <NavLink to="/reservas/nueva" className={({ isActive }) => `nav-menu__link${isActive ? " active" : ""}`}>➕ Registrar reserva</NavLink>
        )}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__avatar" aria-hidden="true">{iniciales}</div>
          <div>
            {nombreCompleto}
            <br />
            <small>{rol === 'GESTOR' ? 'Gestor' : 'Consulta'}</small>
          </div>
        </div>
        <button className="logout-btn" onClick={logout} type="button">
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
