import { useState, createContext, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'

const AdminCtx = createContext(null)
export function useAdminLayout() { return useContext(AdminCtx) }

export default function AdminLayout({ children, topbarTitle = 'Admin', topbarBreadcrumbs = [], topbarActions }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, loading } = useAuth()
  const location = useLocation()
  const navigate  = useNavigate()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1A0A00' }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(196,149,106,0.2)', borderTopColor: '#8B1A1A', borderRadius: '50%' }} className="animate-spin" />
      </div>
    )
  }

  if (!user) {
    const redirect = encodeURIComponent(location.pathname + location.search)
    navigate(`/dang-nhap?redirect=${redirect}`)
    return null
  }

  return (
    <AdminCtx.Provider value={{ setSidebarOpen }}>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#1A0A00' }}>
        <AdminSidebar
          currentPath={location.pathname}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content (offset by sidebar on lg) */}
        <div className="lg:ml-64" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
          <AdminTopbar
            title={topbarTitle}
            breadcrumbs={topbarBreadcrumbs}
            actions={topbarActions}
            onMenuToggle={() => setSidebarOpen(o => !o)}
          />
          <main style={{ flex: 1, padding: '1.5rem', overflowX: 'hidden' }}>
            {children}
          </main>
        </div>
      </div>
    </AdminCtx.Provider>
  )
}
