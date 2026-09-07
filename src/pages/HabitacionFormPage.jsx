import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { obtenerHabitacion, crearHabitacion, actualizarHabitacion } from '../services/habitacionesService'

const VALORES_INICIALES = {
  numero: '',
  tipo: 'INDIVIDUAL',
  piso: 1,
  capacidad: 1,
  precioNoche: '',
  estado: 'DISPONIBLE',
}

export default function HabitacionFormPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const idEditar = searchParams.get('editar')
  const esEdicion = Boolean(idEditar)

  const [form, setForm] = useState(VALORES_INICIALES)
  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (!esEdicion) return
    obtenerHabitacion(idEditar, token)
      .then((data) => setForm({ ...data, precioNoche: data.precioNoche }))
      .catch((err) => setError(err.message))
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
      piso: Number(form.piso),
      capacidad: Number(form.capacidad),
      precioNoche: Number(form.precioNoche),
    }

    try {
      if (esEdicion) {
        await actualizarHabitacion(idEditar, payload, token)
      } else {
        await crearHabitacion(payload, token)
      }
      navigate('/habitaciones')
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
          <h1>{esEdicion ? 'Editar habitación' : 'Registrar habitación'}</h1>
          <p>Completa el formulario para {esEdicion ? 'actualizar la' : 'dar de alta una nueva'} habitación.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <section className="card" style={{ maxWidth: 760 }}>
        <div className="card-body">
          <form className="form-grid" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="numero">Número de habitación</label>
              <input
                id="numero"
                value={form.numero}
                onChange={(e) => actualizarCampo('numero', e.target.value)}
                placeholder="Ej. 204"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="piso">Piso</label>
              <input
                id="piso"
                type="number"
                min="1"
                value={form.piso}
                onChange={(e) => actualizarCampo('piso', e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="tipo">Tipo de habitación</label>
              <select id="tipo" value={form.tipo} onChange={(e) => actualizarCampo('tipo', e.target.value)}>
                <option value="INDIVIDUAL">Individual</option>
                <option value="DOBLE">Doble</option>
                <option value="DOBLE_VISTA_MAR">Doble Vista al Mar</option>
                <option value="SUITE_FAMILIAR">Suite Familiar</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="capacidad">Capacidad</label>
              <select id="capacidad" value={form.capacidad} onChange={(e) => actualizarCampo('capacidad', e.target.value)}>
                <option value="1">1 persona</option>
                <option value="2">2 personas</option>
                <option value="3">3 personas</option>
                <option value="4">4 personas</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="precioNoche">Precio por noche (Bs)</label>
              <input
                id="precioNoche"
                type="number"
                min="0"
                step="10"
                value={form.precioNoche}
                onChange={(e) => actualizarCampo('precioNoche', e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="estado">Estado</label>
              <select id="estado" value={form.estado} onChange={(e) => actualizarCampo('estado', e.target.value)}>
                <option value="DISPONIBLE">Disponible</option>
                <option value="OCUPADA">Ocupada</option>
                <option value="MANTENIMIENTO">Mantenimiento</option>
              </select>
            </div>

            <div className="form-actions">
              <Link to="/habitaciones" className="btn-outline">Cancelar</Link>
              <button type="submit" className="btn-accent" disabled={guardando}>
                {guardando ? 'Guardando…' : 'Guardar habitación'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
