import { apiFetch } from './api'

// El resto de metodos (crear, actualizar, eliminar) se agregan en
// feature/reservas. Por ahora solo se necesita listar, para calcular
// los indicadores del dashboard.
export function listarReservas(token) {
  return apiFetch('/reservas', { token })
}
