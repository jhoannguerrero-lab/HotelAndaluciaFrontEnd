

const API_BASE_URL = 'http://localhost:8080/api'

export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (response.status === 204) {
    return null
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {

    const mensaje = data?.error || Object.values(data ?? {}).join(' | ') || 'Ocurrio un error inesperado'
    throw new Error(mensaje)
  }

  return data
}
