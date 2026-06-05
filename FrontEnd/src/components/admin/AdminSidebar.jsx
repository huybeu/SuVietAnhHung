import { Link, useNavigate } from 'react-router-dom'
import { can, useRole } from '../../lib/permissions'
import { useAuth } from '../../context/AuthContext'

const NAV_GROUPS = [
  { label: 'TỔNG QUAN', items: [
    { path: '/admin', icon: 'dashboard', label: 'Dashboard', permission: null, exact: true },
  ]},
  { label: 'NỘI DUNG', items: [
    { path: '/admin/bai-viet',  icon: 'article',          label: 'Bài Viết',      permission: 'articles:read' },
    { path: '/admin/anh-hung', icon: 'military_tech',     label: 'Anh Hùng',     permission: 'heroes:read' },
    { path: '/admin/thoi-ky',  icon: 'history_edu',       label: 'Thời Kỳ',      permission: 'eras:write' },
    { path: '/admin/video',    icon: 'videocam',          label: 'Video',        permission: 'videos:read' },
    { path: '/admin/the-loai', icon: 'label',             label: 'Thẻ Nội Dung', permission: 'articles:write' },
  ]},
  { label: 'QUỸ & TÀI TRỢ', items: [
    { path: '/admin/quyen-gop',   icon: 'volunteer_activism', label: 'Đóng Góp',    permission: 'donations:read' },
    { path: '/admin/nha-tai-tro', icon: 'handshake',          label: 'Nhà Tài Trợ', permission: 'sponsors:write' },
  ]},
  { label: 'HỆ THỐNG', items: [
    { path: '/admin/media',      icon: 'perm_media', label: 'Media',          permission: 'media:upload' },
    { path: '/admin/cau-hinh',   icon: 'settings',   label: 'Cấu Hình Trang', permission: 'site_config:write', locked: true },
    { path: '/admin/nguoi-dung', icon: 'group',      label: 'Người Dùng',     permission: 'users:read', locked: true },
  ]},
]

function RoleBadge({ role }) {
  const cfg = {
    superadmin: { label: 'Superadmin', style: { borderColor: '#C4956A', color: '#8B1A1A', background: 'rgba(196,149,106,0.15)' } },
    editor:     { label: 'Biên Tập',   style: { borderColor: '#8B1A1A', color: '#8B1A1A', background: 'rgba(139,26,26,0.10)' } },
    viewer:     { label: 'Xem',        style: { borderColor: '#D4B896', color: '#A0794E', background: 'rgba(196,149,106,0.08)' } },
  }[role] || { label: role, style: { borderColor: '#D4B896', color: '#A0794E', background: 'rgba(196,149,106,0.08)' } }

  return (
    <span style={{
      display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: '4px',
      border: '0.5px solid', fontSize: '0.6rem', letterSpacing: '0.04em',
      fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600,
      ...cfg.style,
    }}>
      {cfg.label}
    </span>
  )
}

export default function AdminSidebar({ currentPath, isOpen, onClose }) {
  const role = useRole()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const userName = user?.displayName ?? user?.name ?? user?.username ?? 'Admin'

  function isActive(item) {
    return item.exact ? currentPath === item.path : currentPath.startsWith(item.path)
  }

  function handleLogout() {
    logout()
    navigate('/dang-nhap')
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(61,43,26,0.45)', zIndex: 30 }}
          className="lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside style={{
        position: 'fixed', left: 0, top: 0, height: '100%', width: 240, zIndex: 40,
        background: '#FAE8DA',
        borderRight: '0.5px solid rgba(196,149,106,0.35)',
        display: 'flex', flexDirection: 'column',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease',
        boxShadow: '2px 0 12px rgba(61,43,26,0.06)',
      }} className="lg:translate-x-0">

        {/* Logo */}
        <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '0.5px solid rgba(196,149,106,0.35)' }}>
          <Link to="/admin" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ color: '#8B1A1A', fontSize: '1.1rem' }}>⚔</span>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", color: '#8B1A1A', fontSize: '0.82rem', letterSpacing: '0.04em', fontWeight: 700 }}>
                SỬ VIỆT ANH HÙNG
              </div>
              <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", color: '#A0794E', fontSize: '0.6rem', letterSpacing: '0.08em' }}>
                QUẢN TRỊ HỆ THỐNG
              </div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.05rem' }}
          className="admin-scrollbar">
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi} style={{ marginTop: gi > 0 ? '1.25rem' : 0 }}>
              <div style={{
                fontFamily: "'Be Vietnam Pro', sans-serif",
                color: 'rgba(61,43,26,0.40)', fontSize: '0.58rem', letterSpacing: '0.15em',
                textTransform: 'uppercase', padding: '0.2rem 0.75rem 0.5rem',
                fontWeight: 600,
              }}>
                {group.label}
              </div>
              {group.items.map(item => {
                const allowed = !item.permission || can(role, item.permission)
                const active  = isActive(item)

                if (!allowed || item.locked) {
                  return (
                    <div key={item.path}
                      onClick={() => alert(`Bạn cần quyền ${item.permission?.split(':')[0] || 'superadmin'} để truy cập`)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.6rem',
                        padding: '0.5rem 0.75rem', borderRadius: '0.375rem',
                        color: 'rgba(61,43,26,0.25)', cursor: 'not-allowed', fontSize: '0.82rem',
                        fontFamily: "'Be Vietnam Pro', sans-serif",
                      }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 17, color: 'rgba(61,43,26,0.22)', flexShrink: 0 }}>{item.icon}</span>
                      <span style={{ flex: 1 }}>{item.label}</span>
                      <span className="material-symbols-outlined" style={{ fontSize: 13, color: 'rgba(61,43,26,0.22)' }}>lock</span>
                    </div>
                  )
                }

                return (
                  <Link key={item.path} to={item.path} onClick={onClose}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.6rem',
                      padding: '0.5rem 0.75rem', borderRadius: '0.375rem', textDecoration: 'none',
                      color: active ? '#3D2B1A' : '#A0794E',
                      background: active ? 'rgba(139,26,26,0.10)' : 'transparent',
                      borderLeft: active ? '2.5px solid #8B1A1A' : '2.5px solid transparent',
                      transition: 'all 0.15s',
                      fontWeight: active ? 600 : 400,
                      fontFamily: "'Be Vietnam Pro', sans-serif",
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.background='rgba(139,26,26,0.06)'; e.currentTarget.style.color='#3D2B1A' } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#A0794E' } }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 17, color: active ? '#8B1A1A' : 'rgba(61,43,26,0.35)', flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: '0.82rem', letterSpacing: '0.01em' }}>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* User info */}
        <div style={{ borderTop: '0.5px solid rgba(196,149,106,0.35)', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: 'rgba(139,26,26,0.12)',
              border: '0.5px solid rgba(196,149,106,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: "'Playfair Display', serif", color: '#8B1A1A', fontSize: '0.85rem', fontWeight: 700 }}>
                {userName[0]?.toUpperCase() ?? 'A'}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "'Be Vietnam Pro', sans-serif",
                color: '#3D2B1A', fontSize: '0.82rem',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600,
              }}>
                {userName}
              </div>
              <RoleBadge role={role} />
            </div>
          </div>
          <button onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(61,43,26,0.45)', fontSize: '0.75rem',
              fontFamily: "'Be Vietnam Pro', sans-serif", padding: 0,
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color='#8B1A1A'}
            onMouseLeave={e => e.currentTarget.style.color='rgba(61,43,26,0.45)'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>logout</span>
            Đăng Xuất
          </button>
        </div>
      </aside>
    </>
  )
}
