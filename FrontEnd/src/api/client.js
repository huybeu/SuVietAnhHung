// Base URL được đọc từ .env — khi backend sẵn sàng chỉ cần set VITE_API_URL
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function getHeaders() {
  const token = localStorage.getItem('authToken')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || `Lỗi máy chủ (${res.status})`)
  }
  return data
}

export const apiClient = {
  get: (path) =>
    fetch(`${BASE_URL}${path}`, { headers: getHeaders() }).then(handleResponse),

  post: (path, body) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  put: (path, body) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  patch: (path, body) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  delete: (path) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),
}
