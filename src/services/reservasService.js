import { apiFetch } from './api'

export function listarReservas(token) {
  return apiFetch('/reservas', { token })
}

export function obtenerReserva(id, token) {
  return apiFetch(`/reservas/${id}`, { token })
}

export function crearReserva(datos, token) {
  return apiFetch('/reservas', { method: 'POST', body: datos, token })
}

export function actualizarReserva(id, datos, token) {
  return apiFetch(`/reservas/${id}`, { method: 'PUT', body: datos, token })
}

export function eliminarReserva(id, token) {
  return apiFetch(`/reservas/${id}`, { method: 'DELETE', token })
}
