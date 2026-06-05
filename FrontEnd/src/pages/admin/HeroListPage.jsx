import AdminLayout from '../../components/admin/AdminLayout'
import HeroManager from '../../components/admin/HeroManager'
import ViewerBanner from '../../components/admin/ViewerBanner'
import { can, useRole } from '../../lib/permissions'
import { useNavigate } from 'react-router-dom'

export default function HeroListPage() {
  const navigate = useNavigate()
  const role = useRole()
  return (
    <AdminLayout
      topbarTitle="Quản Lý Anh Hùng"
      topbarBreadcrumbs={[
        { label: 'Admin', path: '/admin' },
        { label: 'Anh Hùng', path: '/admin/anh-hung' },
      ]}
      topbarActions={
        can(role, 'heroes:write') && (
          <button
            onClick={() => navigate('/admin/anh-hung/tao')}
            className="btn-epic px-4 py-2 text-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm" style={{ fontSize: '16px' }}>add</span>
            Thêm Anh Hùng
          </button>
        )
      }
    >
      {!can(role, 'heroes:write') && <ViewerBanner />}
      <HeroManager />
    </AdminLayout>
  )
}
