// Traduce un estado (de habitacion o de reserva) a un color de badge
// consistente. Centralizado aqui para no repetir el mapeo en cada
// pagina que muestra una tabla.
const ESTILOS = {
  DISPONIBLE: 'badge-success',
  CONFIRMADA: 'badge-success',
  OCUPADA: 'badge-danger',
  CANCELADA: 'badge-danger',
  MANTENIMIENTO: 'badge-warning',
  PENDIENTE: 'badge-warning',
  FINALIZADA: 'badge-info',
}

export default function StatusBadge({ estado }) {
  const clase = ESTILOS[estado] ?? 'badge-info'
  return <span className={`badge ${clase}`}>{estado}</span>
}
