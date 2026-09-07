import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { listarHabitaciones } from '../services/habitacionesService'
import { listarReservas } from '../services/reservasService'
import StatusBadge from '../components/StatusBadge'

export default function DashboardPage() {
  const { token, nombreCompleto } = useAuth()

  const [habitaciones, setHabitaciones] = useState([])
  const [reservas, setReservas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function cargarDatos() {
      try {

        const [habitacionesData, reservasData] = await Promise.all([
          listarHabitaciones(token),
          listarReservas(token),
        ])
        setHabitaciones(habitacionesData)
        setReservas(reservasData)
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message)
      } finally {
        setCargando(false)
      }
    }

    cargarDatos()
    return () => controller.abort()
  }, [token])

  if (cargando) return <p>Cargando panel…</p>
  if (error) return <div className="alert alert-danger">{error}</div>

  const disponibles = habitaciones.filter((h) => h.estado === 'DISPONIBLE').length
  const reservasActivas = reservas.filter((r) => r.estado === 'CONFIRMADA' || r.estado === 'PENDIENTE').length
  const ingresosDelMes = reservas
    .filter((r) => r.estado !== 'CANCELADA')
    .reduce((total, r) => {
      const noches = Math.max(1, diasEntre(r.checkin, r.checkout))
      const habitacion = habitaciones.find((h) => h.id === r.habitacionId)
      return total + noches * (habitacion?.precioNoche ?? 0)
    }, 0)

  const reservasRecientes = [...reservas]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Buen día, {nombreCompleto?.split(' ')[0]}</h1>
          <p>Resumen de operación del Hotel Andalucía.</p>
        </div>
      </div>

      <section className="stat-grid">
        <div className="stat-card">
          <p className="stat-card__label">Habitaciones disponibles</p>
          <p className="stat-card__value">{disponibles} / {habitaciones.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Reservas activas</p>
          <p className="stat-card__value">{reservasActivas}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Ingresos estimados</p>
          <p className="stat-card__value">Bs {ingresosDelMes.toFixed(0)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Total de reservas</p>
          <p className="stat-card__value">{reservas.length}</p>
        </div>
      </section>

      <section className="card">
        <div className="card-body">
          <h2 className="card-title">Reservas recientes</h2>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Huésped</th>
                  <th>Habitación</th>
                  <th>Check-in</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservasRecientes.map((r) => (
                  <tr key={r.id}>
                    <td>{r.huespedNombre}</td>
                    <td>{r.habitacionNumero} · {r.habitacionTipo}</td>
                    <td>{r.checkin}</td>
                    <td><StatusBadge estado={r.estado} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  )
}

function diasEntre(desde, hasta) {
  const ms = new Date(hasta) - new Date(desde)
  return Math.round(ms / (1000 * 60 * 60 * 24))
}
