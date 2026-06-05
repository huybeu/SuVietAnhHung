import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { can } from '../lib/permissions'

/**
 * Render children chỉ khi user có quyền thực hiện action.
 * Dùng để gate từng UI element hoặc section bên trong page.
 *
 * @param {string} action - Permission action (vd: 'articles:publish')
 * @param {ReactNode} fallback - Hiển thị thay thế khi không có quyền (mặc định redirect /403)
 */
export default function RoleGuard({ children, action, fallback }) {
  const { user } = useAuth()
  const role = user?.role || (user?.isAdmin ? 'superadmin' : 'editor')

  if (!can(role, action)) {
    return fallback ?? <Navigate to="/403" replace />
  }

  return children
}
