import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { listarHabitaciones } from '../services/habitacionesService'
import { obtenerReserva, crearReserva, actualizarReserva } from '../services/reservasService'

const VALORES_INICIALES = {
  habitacionId: '',
  huespedNombre: '',
  huespedDocumento: '',
  huespedTelefono: '',
  checkin: '',
  checkout: '',
  numHuespedes: 1,
  metodoPago: 'TARJETA',
  estado: 'CONFIRMADA',
  notas: '',
}

export default function ReservaFormPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const idEditar = searchParams.get('editar')
  const esEdicion = Boolean(idEditar)

  const [form, setForm] = useState(VALORES_INICIALES)
  const [habitaciones, setHabitaciones] = useState([])
  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)

  // Carga el catalogo de habitaciones (para el <select>) y, si es
  // edicion, tambien los datos actuales de la reserva.
  useEffect(() => {
    listarHabitaciones(token).then(setHabitaciones).catch((err) => setError(err.message))

    if (esEdicion) {
      obtenerReserva(idEditar, token)
        .then((data) => setForm({ ...data, habitacionId: data.habitacionId }))
        .catch((err) => setError(err.message))
    }
  }, [idEditar])

  function actualizarCampo(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setGuardando(true)

    const payload = {
      ...form,
      habitacionId: Number(form.habitacionId),
      numHuespedes: Number(form.numHuespedes),
    }

    try {
      if (esEdicion) {
        await actualizarReserva(idEditar, payload, token)
      } else {
        await crearReserva(payload, token)
      }
      navigate('/reservas')
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{esEdicion ? 'Editar reserva' : 'Registrar reserva'}</h1>
          <p>Selecciona una habitación registrada y completa los datos del huésped.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <section className="card" style={{ maxWidth: 760 }}>
        <div className="card-body">
          <form className="form-grid" onSubmit={handleSubmit} noValidate>
            <div className="field field-full">
              <label htmlFor="habitacionId">Habitación</label>
              <select
                id="habitacionId"
                value={form.habitacionId}
                onChange={(e) => actualizarCampo('habitacionId', e.target.value)}
                required
              >
                <option value="">Selecciona una habitación registrada</option>
                {habitaciones.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.numero} · {h.tipo} · Bs {Number(h.precioNoche).toFixed(2)} / noche
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="huespedNombre">Nombre del huésped</label>
              <input
                id="huespedNombre"
                value={form.huespedNombre}
                onChange={(e) => actualizarCampo('huespedNombre', e.target.value)}
                placeholder="Ej. María Fernanda Rojas"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="huespedDocumento">Carnet de identidad</label>
              <input
                id="huespedDocumento"
                value={form.huespedDocumento}
                onChange={(e) => actualizarCampo('huespedDocumento', e.target.value)}
                placeholder="Ej. 8452136 LP"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="huespedTelefono">Teléfono</label>
              <input
                id="huespedTelefono"
                value={form.huespedTelefono ?? ''}
                onChange={(e) => actualizarCampo('huespedTelefono', e.target.value)}
                placeholder="Ej. 71234567"
              />
            </div>

            <div className="field">
              <label htmlFor="numHuespedes">Número de huéspedes</label>
              <input
                id="numHuespedes"
                type="number"
                min="1"
                max="6"
                value={form.numHuespedes}
                onChange={(e) => actualizarCampo('numHuespedes', e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="checkin">Fecha de check-in</label>
              <input
                id="checkin"
                type="date"
                value={form.checkin}
                onChange={(e) => actualizarCampo('checkin', e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="checkout">Fecha de check-out</label>
              <input
                id="checkout"
                type="date"
                value={form.checkout}
                onChange={(e) => actualizarCampo('checkout', e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="metodoPago">Método de pago</label>
              <select id="metodoPago" value={form.metodoPago} onChange={(e) => actualizarCampo('metodoPago', e.target.value)}>
                <option value="TARJETA">Tarjeta de crédito/débito</option>
                <option value="TRANSFERENCIA">Transferencia bancaria</option>
                <option value="EFECTIVO">Efectivo en recepción</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="estado">Estado</label>
              <select id="estado" value={form.estado} onChange={(e) => actualizarCampo('estado', e.target.value)}>
                <option value="CONFIRMADA">Confirmada</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="FINALIZADA">Finalizada</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
            </div>

            <div className="field field-full">
              <label htmlFor="notas">Notas adicionales</label>
              <textarea
                id="notas"
                value={form.notas ?? ''}
                onChange={(e) => actualizarCampo('notas', e.target.value)}
                placeholder="Ej. Solicita cuna adicional, llegada nocturna, etc."
              />
            </div>

            <div className="form-actions">
              <Link to="/reservas" className="btn-outline">Cancelar</Link>
              <button type="submit" className="btn-accent" disabled={guardando}>
                {guardando ? 'Guardando…' : 'Guardar reserva'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
