import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { listarHabitaciones, eliminarHabitacion } from '../services/habitacionesService'
import StatusBadge from '../components/StatusBadge'

export default function HabitacionesPage() {
  const { token, isGestor } = useAuth()
  const navigate = useNavigate()

  const [habitaciones, setHabitaciones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarHabitaciones()
  }, [])

  async function cargarHabitaciones() {
    setCargando(true)
    try {
      const data = await listarHabitaciones(token)
      setHabitaciones(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  async function handleEliminar(id) {
    if (!confirm('¿Eliminar esta habitación? Esta acción no se puede deshacer.')) return
    try {
      await eliminarHabitacion(id, token)
      setHabitaciones((prev) => prev.filter((h) => h.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  if (cargando) return <p>Cargando habitaciones…</p>

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Habitaciones</h1>
          <p>Listado general de las habitaciones del hotel.</p>
        </div>
        {isGestor && (
          <Link to="/habitaciones/nueva" className="btn-accent">+ Registrar habitación</Link>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>N.°</th>
              <th>Tipo</th>
              <th>Piso</th>
              <th>Capacidad</th>
              <th>Precio / noche</th>
              <th>Estado</th>
              {isGestor && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {habitaciones.map((h) => (
              <tr key={h.id}>
                <td>{h.numero}</td>
                <td>{h.tipo}</td>
                <td>{h.piso}</td>
                <td>{h.capacidad} persona{h.capacidad > 1 ? 's' : ''}</td>
                <td>Bs {Number(h.precioNoche).toFixed(2)}</td>
                <td><StatusBadge estado={h.estado} /></td>
                {isGestor && (
                  <td className="cell-actions">
                    <button className="btn-outline" onClick={() => navigate(`/habitaciones/nueva?editar=${h.id}`)}>
                      Editar
                    </button>
                    <button className="btn-outline" onClick={() => handleEliminar(h.id)}>
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {habitaciones.length === 0 && <p className="empty-state">Todavía no hay habitaciones registradas.</p>}
      </div>
    </>
  )
}
