const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

let refreshCallback = null
let logoutCallback  = null

export function setRefreshCallback(fn) { refreshCallback = fn }
export function setLogoutCallback(fn)  { logoutCallback  = fn }

// ── Headers ───────────────────────────────────────────────────────────────────
function getHeaders(isFormData = false) {
  const token = localStorage.getItem('authToken')
  if (isFormData) {
    return token ? { Authorization: `Bearer ${token}` } : {}
  }
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// ── Standardized error shape — { message, code, details, status } ─────────────
function buildError(data, status) {
  const err = new Error(data?.message || `HTTP ${status}`)
  err.code    = data?.code    ?? `HTTP_${status}`
  err.details = data?.details ?? null
  err.status  = status
  return err
}

async function parseResponse(res) {
  if (res.status === 204) return null
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw buildError(data, res.status)
  return data
}

// ── Refresh token queue — prevent multiple concurrent refreshes ───────────────
let isRefreshing = false
const refreshQueue = []

async function drainQueue(success) {
  const queue = refreshQueue.splice(0)
  queue.forEach(({ resolve, reject }) => (success ? resolve() : reject(new Error('Refresh failed'))))
}

async function withRefresh(retryFn) {
  if (!refreshCallback) {
    logoutCallback?.()
    throw buildError({ message: 'Phiên đăng nhập đã hết hạn', code: 'UNAUTHORIZED' }, 401)
  }

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      refreshQueue.push({ resolve, reject })
    }).then(retryFn)
  }

  isRefreshing = true
  try {
    await refreshCallback()
    await drainQueue(true)
    return retryFn()
  } catch {
    await drainQueue(false)
    logoutCallback?.()
    throw buildError({ message: 'Phiên đăng nhập đã hết hạn', code: 'UNAUTHORIZED' }, 401)
  } finally {
    isRefreshing = false
  }
}

// ── Core request — handles 401 refresh + retry ────────────────────────────────
async function request(makeOpts, retryFn) {
  const res = await fetch(makeOpts.url, makeOpts.options)
  if (res.status === 401) return withRefresh(retryFn)
  return parseResponse(res)
}

// ── Public client ─────────────────────────────────────────────────────────────
export const httpClient = {
  get(path, signal) {
    const url  = `${BASE_URL}${path}`
    const opts = () => ({ headers: getHeaders(), signal })
    return request({ url, options: opts() }, () => fetch(url, opts()).then(parseResponse))
  },

  post(path, body, signal) {
    const isFormData = body instanceof FormData
    const url        = `${BASE_URL}${path}`
    const opts       = () => ({
      method:  'POST',
      headers: getHeaders(isFormData),
      body:    isFormData ? body : JSON.stringify(body),
      signal,
    })
    return request({ url, options: opts() }, () => fetch(url, opts()).then(parseResponse))
  },

  patch(path, body, signal) {
    const url  = `${BASE_URL}${path}`
    const opts = () => ({ method: 'PATCH', headers: getHeaders(), body: JSON.stringify(body), signal })
    return request({ url, options: opts() }, () => fetch(url, opts()).then(parseResponse))
  },

  delete(path, signal) {
    const url  = `${BASE_URL}${path}`
    const opts = () => ({ method: 'DELETE', headers: getHeaders(), signal })
    return request({ url, options: opts() }, () => fetch(url, opts()).then(parseResponse))
  },
}
