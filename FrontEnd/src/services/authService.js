import { httpClient } from '../api/httpClient'

// ─── Mock mode — chỉ hoạt động khi VITE_API_URL không được set ───────────────
const USE_MOCK = !import.meta.env.VITE_API_URL

// Credentials đọc từ env — KHÔNG hardcode trong source code.
// Thêm VITE_MOCK_*_PASS vào .env (không commit) để dùng trong dev.
const MOCK_USERS = [
  {
    id: 1,
    name: 'Super Admin',
    username: 'superadmin',
    password: import.meta.env.VITE_MOCK_SUPERADMIN_PASS ?? '',
    role: 'superadmin',
    isAdmin: true,
    email: 'superadmin@suvietan.vn',
  },
  {
    id: 2,
    name: 'Nguyễn Biên Tập',
    username: 'editor',
    password: import.meta.env.VITE_MOCK_EDITOR_PASS ?? '',
    role: 'editor',
    isAdmin: false,
    email: 'editor@suvietan.vn',
  },
  {
    id: 3,
    name: 'Trần Xem Thử',
    username: 'viewer',
    password: import.meta.env.VITE_MOCK_VIEWER_PASS ?? '',
    role: 'viewer',
    isAdmin: false,
    email: 'viewer@suvietan.vn',
  },
]
// ─────────────────────────────────────────────────────────────────────────────

const AUTH_KEY         = 'loggedInUser'
const TOKEN_KEY        = 'authToken'
const TOKEN_EXPIRY_KEY = 'authTokenExpiry'
const DEFAULT_TTL      = 24 * 60 * 60 * 1000 // 24h

function storeAuth(user, token, ttl = DEFAULT_TTL) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user))
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + ttl))
  }
}

function clearAuth() {
  localStorage.removeItem(AUTH_KEY)
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(TOKEN_EXPIRY_KEY)
}

export const authService = {
  /**
   * Đăng nhập
   * Backend: POST /api/v1/auth/login → { success, data: { accessToken, user } }
   */
  async login(email, password) {
    if (!USE_MOCK) {
      const res = await httpClient.post('/auth/login', { email, password })
      const { accessToken, user } = res.data
      storeAuth(user, accessToken)
      return user
    }

    const found = MOCK_USERS.find(
      u => (u.email === email.trim().toLowerCase() || u.username.toLowerCase() === email.trim().toLowerCase()) && u.password === password
    )
    if (!found) throw new Error('Email hoặc mật khẩu không đúng.')
    const { password: _pw, ...user } = found
    storeAuth(user, null)
    return user
  },

  /**
   * Đăng ký
   * Backend: POST /api/v1/auth/register → { success, data: user }
   */
  async register(email, username, password) {
    if (!USE_MOCK) {
      const res = await httpClient.post('/auth/register', { username, email, password })
      const user = res.data
      storeAuth(user, null)
      return user
    }

    const exists = MOCK_USERS.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase()
    )
    if (exists) throw new Error('Tên đăng nhập đã được sử dụng.')
    const user = { id: Date.now(), name: username.trim(), username: username.trim(), role: 'viewer', email: email.trim() }
    storeAuth(user, null)
    return user
  },

  /**
   * Đăng xuất
   * Backend: POST /api/v1/auth/logout
   */
  async logout() {
    if (!USE_MOCK) {
      await httpClient.post('/auth/logout', {}).catch(() => {})
    }
    clearAuth()
  },

  /**
   * Refresh access token
   * Backend: POST /api/v1/auth/refresh → { success, data: { accessToken } }
   * Được gọi tự động bởi httpClient khi nhận 401.
   */
  async refreshToken() {
    if (USE_MOCK) return null
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return null

    try {
      const res = await httpClient.post('/auth/refresh', {})
      const { accessToken: newToken } = res.data
      if (newToken) {
        localStorage.setItem(TOKEN_KEY, newToken)
        localStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + DEFAULT_TTL))
      }
      return newToken
    } catch {
      clearAuth()
      return null
    }
  },

  /**
   * Lấy user từ localStorage, kiểm tra token expiry.
   * Trả về null nếu token đã hết hạn.
   */
  getStoredUser() {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY)
    if (expiry && Date.now() > Number(expiry)) {
      clearAuth()
      return null
    }
    const stored = localStorage.getItem(AUTH_KEY)
    return stored ? JSON.parse(stored) : null
  },
}
