import { apiFetch } from './api'

export function listarHabitaciones(token) {
  return apiFetch('/habitaciones', { token })
}

export function obtenerHabitacion(id, token) {
  return apiFetch(`/habitaciones/${id}`, { token })
}

export function crearHabitacion(datos, token) {
  return apiFetch('/habitaciones', { method: 'POST', body: datos, token })
}

export function actualizarHabitacion(id, datos, token) {
  return apiFetch(`/habitaciones/${id}`, { method: 'PUT', body: datos, token })
}

export function eliminarHabitacion(id, token) {
  return apiFetch(`/habitaciones/${id}`, { method: 'DELETE', token })
}
