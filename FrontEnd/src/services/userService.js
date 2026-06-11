import { httpClient } from '../api/httpClient'

// Lọc params undefined/null/rỗng trước khi build query string
function toQS(params) {
  const p = {}
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') p[k] = v
  })
  return new URLSearchParams(p).toString()
}

export const userService = {
  // GET /api/v1/users?page=1&limit=10
  getUsers: (params, { signal } = {}) =>
    httpClient.get(`/users?${toQS(params)}`, signal),

  // GET /api/v1/users/:id
  getUserById: (id, { signal } = {}) =>
    httpClient.get(`/users/${id}`, signal),

  // POST /api/v1/users  — body: { username, email, password, role? }
  createUser: (data) =>
    httpClient.post('/users', data),

  // PUT /api/v1/users/:id
  updateUser: (id, data) =>
    httpClient.patch(`/users/${id}`, data),

  // DELETE /api/v1/users/:id
  deleteUser: (id) =>
    httpClient.delete(`/users/${id}`),
}
