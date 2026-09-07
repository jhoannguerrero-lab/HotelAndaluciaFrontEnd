import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { listarReservas, eliminarReserva } from '../services/reservasService'
import StatusBadge from '../components/StatusBadge'

export default function ReservasPage() {
  const { token, isGestor } = useAuth()
  const navigate = useNavigate()

  const [reservas, setReservas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarReservas()
  }, [])

  async function cargarReservas() {
    setCargando(true)
    try {
      const data = await listarReservas(token)
      setReservas(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  async function handleEliminar(id) {
    if (!confirm('¿Eliminar esta reserva? Esta acción no se puede deshacer.')) return
    try {
      await eliminarReserva(id, token)
      setReservas((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  if (cargando) return <p>Cargando reservas…</p>

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Reservas</h1>
          <p>Cada reserva está enlazada a una habitación registrada.</p>
        </div>
        {isGestor && (
          <Link to="/reservas/nueva" className="btn-accent">+ Registrar reserva</Link>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Huésped</th>
              <th>Habitación</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Estado</th>
              {isGestor && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {reservas.map((r) => (
              <tr key={r.id}>
                <td>{r.huespedNombre}</td>
                <td>{r.habitacionNumero} · {r.habitacionTipo}</td>
                <td>{r.checkin}</td>
                <td>{r.checkout}</td>
                <td><StatusBadge estado={r.estado} /></td>
                {isGestor && (
                  <td className="cell-actions">
                    <button className="btn-outline" onClick={() => navigate(`/reservas/nueva?editar=${r.id}`)}>
                      Editar
                    </button>
                    <button className="btn-outline" onClick={() => handleEliminar(r.id)}>
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {reservas.length === 0 && <p className="empty-state">Todavía no hay reservas registradas.</p>}
      </div>
    </>
  )
}
