import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { authService } from '../services/authService'
import { setLogoutCallback, setRefreshCallback } from '../api/httpClient'

// ── Two contexts để tránh re-render toàn bộ app khi actions thay đổi ──────────
const AuthStateContext   = createContext(null)
const AuthActionsContext = createContext(null)

const DEV_BYPASS = import.meta.env.VITE_DEV_BYPASS === 'true'
const DEV_USER   = { id: 0, name: 'Dev Admin', displayName: 'Dev Admin', role: 'admin', isAdmin: true }

export function AuthProvider({ children }) {
  const [user, setUser]                   = useState(DEV_BYPASS ? DEV_USER : null)
  const [isInitializing, setIsInitializing] = useState(!DEV_BYPASS) // FE-020

  // Khởi tạo: đọc user từ storage (có kiểm tra expiry) ────────────────────────
  useEffect(() => {
    if (DEV_BYPASS) return
    setUser(authService.getStoredUser())
    setIsInitializing(false)
  }, [])

  // Đăng ký logout-on-401 và refreshToken với httpClient ────────────────────────
  // FE-019 + FE-022
  useEffect(() => {
    setRefreshCallback(() => authService.refreshToken())
    setLogoutCallback(() => {
      authService.logout()
      setUser(null)
    })
    return () => {
      setRefreshCallback(null)
      setLogoutCallback(null)
    }
  }, [])

  const login = useCallback(async (username, password) => {
    const loggedIn = await authService.login(username, password)
    setUser(loggedIn)
    return loggedIn
  }, [])

  const register = useCallback(async (displayName, username, password) => {
    const registered = await authService.register(displayName, username, password)
    setUser(registered)
    return registered
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  // State context: user + loading flag (loading = alias của isInitializing)
  const stateValue = useMemo(
    () => ({ user, isInitializing, loading: isInitializing }),
    [user, isInitializing]
  )

  // Actions context: stable references — không trigger re-render state consumers
  const actionsValue = useMemo(
    () => ({ login, register, logout }),
    [login, register, logout]
  )

  return (
    <AuthStateContext.Provider value={stateValue}>
      <AuthActionsContext.Provider value={actionsValue}>
        {children}
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  )
}

// ── useAuth — backward-compatible hook (trả về cả state lẫn actions) ─────────
export function useAuth() {
  const state   = useContext(AuthStateContext)
  const actions = useContext(AuthActionsContext)
  if (!state || !actions) throw new Error('useAuth phải được dùng bên trong AuthProvider')
  return { ...state, ...actions }
}

// ── Granular hooks — dùng khi chỉ cần state hoặc chỉ cần actions ─────────────
export function useAuthState() {
  const ctx = useContext(AuthStateContext)
  if (!ctx) throw new Error('useAuthState phải được dùng bên trong AuthProvider')
  return ctx
}

export function useAuthActions() {
  const ctx = useContext(AuthActionsContext)
  if (!ctx) throw new Error('useAuthActions phải được dùng bên trong AuthProvider')
  return ctx
}
