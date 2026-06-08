import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { can } from '../lib/permissions'

function PageLoader() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0402' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(246,190,59,0.2)', borderTopColor: '#dc143c', borderRadius: '50%' }} className="animate-spin" />
    </div>
  )
}

/**
 * Bảo vệ route ở router level.
 * - Chờ auth khởi tạo xong trước khi quyết định redirect.
 * - Nếu chưa đăng nhập → redirect /dang-nhap?redirect=...
 * - Nếu thiếu quyền (requiredAction) → redirect /403
 */
const DEV_BYPASS = import.meta.env.VITE_DEV_BYPASS === 'true'

export default function ProtectedRoute({ children, requiredAction }) {
  const { user, isInitializing } = useAuth()
  const location = useLocation()

  if (DEV_BYPASS) return children

  if (isInitializing) return <PageLoader />

  if (!user) {
    const redirect = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/dang-nhap?redirect=${redirect}`} replace />
  }

  if (requiredAction) {
    const role = user.role || (user.isAdmin ? 'superadmin' : 'editor')
    if (!can(role, requiredAction)) {
      return <Navigate to="/403" replace />
    }
  }

  return children
}
