import { useState } from 'react'
import { createPortal } from 'react-dom'
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
    { path: '/admin/video',    icon: 'play_circle',       label: 'Video',        permission: 'videos:read' },
    { path: '/admin/the-loai', icon: 'label',             label: 'Thẻ Nội Dung', permission: 'articles:write' },
  ]},
  { label: 'QUỸ & TÀI TRỢ', items: [
    { path: '/admin/quyen-gop',   icon: 'volunteer_activism', label: 'Đóng Góp',    permission: 'donations:read' },
    { path: '/admin/nha-tai-tro', icon: 'handshake',          label: 'Nhà Tài Trợ', permission: 'sponsors:write' },
  ]},
  { label: 'HỆ THỐNG', items: [
    { path: '/admin/media',      icon: 'perm_media', label: 'Media',          permission: 'media:upload' },
    { path: '/admin/cau-hinh',   icon: 'settings',   label: 'Cấu Hình Trang', permission: 'site_config:write', locked: true },
    { path: '/admin/nguoi-dung', icon: 'group',      label: 'Người Dùng',     permission: 'users:read' },
  ]},
]

// Portal tooltip — renders at fixed position so sidebar overflow:hidden doesn't clip it
function SidebarTooltip({ label, show, children }) {
  const [pos, setPos] = useState(null)

  if (!show) return children

  return (
    <div
      onMouseEnter={e => {
        const r = e.currentTarget.getBoundingClientRect()
        setPos({ top: r.top + r.height / 2, left: r.right + 10 })
      }}
      onMouseLeave={() => setPos(null)}
    >
      {children}
      {pos && createPortal(
        <div style={{
          position: 'fixed', top: pos.top, left: pos.left,
          transform: 'translateY(-50%)',
          background: '#3D2B1A', color: '#FAE8DA',
          padding: '4px 10px', borderRadius: 4,
          fontSize: '0.75rem', whiteSpace: 'nowrap',
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500,
          zIndex: 9999, pointerEvents: 'none',
          boxShadow: '0 2px 8px rgba(61,43,26,0.3)',
        }}>
          {label}
        </div>,
        document.body
      )}
    </div>
  )
}

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

export default function AdminSidebar({ currentPath, isOpen, onClose, isCollapsed, onToggleCollapse }) {
  const role = useRole()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const userName = user?.displayName ?? user?.name ?? user?.username ?? 'Admin'

  // Each group can be independently collapsed (only visible when sidebar is expanded)
  const [openGroups, setOpenGroups] = useState(() =>
    Object.fromEntries(NAV_GROUPS.map((_, i) => [i, true]))
  )

  function isActive(item) {
    return item.exact ? currentPath === item.path : currentPath.startsWith(item.path)
  }

  function handleLogout() {
    logout()
    navigate('/dang-nhap')
  }

  function toggleGroup(gi) {
    setOpenGroups(prev => ({ ...prev, [gi]: !prev[gi] }))
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="lg:hidden"
          style={{ position: 'fixed', inset: 0, background: 'rgba(61,43,26,0.45)', zIndex: 30 }}
        />
      )}

      {/* Sidebar
          Mobile:  translate-x-0 when open, -translate-x-full when closed (controlled by isOpen)
          Desktop: lg:translate-x-0 always visible; width changes with isCollapsed */}
      <aside
        className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{
          position: 'fixed', left: 0, top: 0, height: '100%',
          width: isCollapsed ? 64 : 240, zIndex: 40,
          background: '#FAE8DA',
          borderRight: '0.5px solid rgba(196,149,106,0.35)',
          display: 'flex', flexDirection: 'column',
          transition: 'width 0.25s ease, transform 0.25s ease',
          boxShadow: '2px 0 12px rgba(61,43,26,0.06)',
          overflow: 'hidden',
        }}
      >
        {/* Logo / Branding */}
        <div style={{
          padding: isCollapsed ? '1rem 0' : '1.1rem 1rem 1rem',
          borderBottom: '0.5px solid rgba(196,149,106,0.35)',
          display: 'flex', alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          minHeight: 64, gap: '0.5rem',
        }}>
          {isCollapsed ? (
            <SidebarTooltip label="SỬ VIỆT ANH HÙNG" show>
              <Link to="/admin" style={{ color: '#8B1A1A', fontSize: '1.25rem', textDecoration: 'none', display: 'flex' }}>⚔</Link>
            </SidebarTooltip>
          ) : (
            <Link to="/admin" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
              <span style={{ color: '#8B1A1A', fontSize: '1.1rem', flexShrink: 0 }}>⚔</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", color: '#8B1A1A', fontSize: '0.82rem', letterSpacing: '0.04em', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  SỬ VIỆT ANH HÙNG
                </div>
                <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", color: '#A0794E', fontSize: '0.6rem', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                  QUẢN TRỊ HỆ THỐNG
                </div>
              </div>
            </Link>
          )}

          {/* Desktop collapse/expand toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex"
            title={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(61,43,26,0.35)', padding: '0.2rem',
              alignItems: 'center', justifyContent: 'center',
              borderRadius: '0.25rem', transition: 'color 0.15s, background 0.15s',
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#8B1A1A'; e.currentTarget.style.background = 'rgba(139,26,26,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(61,43,26,0.35)'; e.currentTarget.style.background = 'transparent' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              {isCollapsed ? 'chevron_right' : 'chevron_left'}
            </span>
          </button>
        </div>

        {/* Navigation */}
        <nav
          className="admin-scrollbar"
          style={{
            flex: 1, overflowY: 'auto', overflowX: 'hidden',
            padding: isCollapsed ? '0.5rem 0' : '0.5rem 0.625rem',
            display: 'flex', flexDirection: 'column', gap: '0.05rem',
          }}
        >
          {/* "Về Trang Chủ" shortcut */}
          <SidebarTooltip label="Về Trang Chủ" show={isCollapsed}>
            <Link
              to="/"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: isCollapsed ? '0.55rem 0' : '0.45rem 0.625rem',
                borderRadius: '0.375rem', textDecoration: 'none',
                color: '#A0794E', background: 'transparent',
                borderLeft: '2.5px solid transparent',
                transition: 'all 0.15s',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,26,26,0.06)'; e.currentTarget.style.color = '#3D2B1A' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#A0794E' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 17, color: 'rgba(61,43,26,0.35)', flexShrink: 0 }}>home</span>
              {!isCollapsed && <span style={{ fontSize: '0.82rem' }}>Về Trang Chủ</span>}
            </Link>
          </SidebarTooltip>

          {/* Divider */}
          <div style={{ height: '0.5px', background: 'rgba(196,149,106,0.25)', margin: isCollapsed ? '0.25rem 0.5rem' : '0.4rem 0.25rem' }} />

          {NAV_GROUPS.map((group, gi) => (
            <div key={gi} style={{ marginTop: gi > 0 ? (isCollapsed ? '0.25rem' : '0.75rem') : 0 }}>

              {/* Group header — collapsible when sidebar is expanded */}
              {!isCollapsed && (
                <button
                  onClick={() => toggleGroup(gi)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                    padding: '0.15rem 0.625rem 0.4rem', borderRadius: '0.25rem',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,149,106,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                    color: 'rgba(61,43,26,0.40)', fontSize: '0.58rem', letterSpacing: '0.15em',
                    textTransform: 'uppercase', fontWeight: 600,
                  }}>
                    {group.label}
                  </span>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: 14, color: 'rgba(61,43,26,0.30)',
                      transition: 'transform 0.2s ease',
                      transform: openGroups[gi] ? 'rotate(0deg)' : 'rotate(-90deg)',
                    }}
                  >
                    expand_more
                  </span>
                </button>
              )}

              {/* Collapsed sidebar: thin divider instead of group label */}
              {isCollapsed && gi > 0 && (
                <div style={{ height: '0.5px', background: 'rgba(196,149,106,0.18)', margin: '0.2rem 0.75rem 0.4rem' }} />
              )}

              {/* Group items with slide animation */}
              <div style={{
                overflow: 'hidden',
                maxHeight: (isCollapsed || openGroups[gi]) ? '600px' : '0px',
                transition: 'max-height 0.22s ease',
              }}>
                {group.items.map(item => {
                  const allowed = !item.permission || can(role, item.permission)
                  const active  = isActive(item)

                  if (!allowed || item.locked) {
                    return (
                      <SidebarTooltip key={item.path} label={`${item.label} (cần quyền)`} show={isCollapsed}>
                        <div
                          onClick={() => !isCollapsed && alert(`Bạn cần quyền ${item.permission?.split(':')[0] || 'superadmin'} để truy cập`)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.6rem',
                            padding: isCollapsed ? '0.55rem 0' : '0.45rem 0.625rem',
                            borderRadius: '0.375rem',
                            color: 'rgba(61,43,26,0.25)', cursor: 'not-allowed',
                            justifyContent: isCollapsed ? 'center' : 'flex-start',
                            fontFamily: "'Be Vietnam Pro', sans-serif",
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 17, color: 'rgba(61,43,26,0.20)', flexShrink: 0 }}>{item.icon}</span>
                          {!isCollapsed && (
                            <>
                              <span style={{ flex: 1, fontSize: '0.82rem' }}>{item.label}</span>
                              <span className="material-symbols-outlined" style={{ fontSize: 13, color: 'rgba(61,43,26,0.22)' }}>lock</span>
                            </>
                          )}
                        </div>
                      </SidebarTooltip>
                    )
                  }

                  return (
                    <SidebarTooltip key={item.path} label={item.label} show={isCollapsed}>
                      <Link
                        to={item.path}
                        onClick={onClose}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.6rem',
                          padding: isCollapsed ? '0.55rem 0' : '0.45rem 0.625rem',
                          borderRadius: '0.375rem', textDecoration: 'none',
                          color: active ? '#3D2B1A' : '#A0794E',
                          background: active ? 'rgba(139,26,26,0.10)' : 'transparent',
                          borderLeft: !isCollapsed && active ? '2.5px solid #8B1A1A' : '2.5px solid transparent',
                          transition: 'all 0.15s',
                          fontWeight: active ? 600 : 400,
                          fontFamily: "'Be Vietnam Pro', sans-serif",
                          justifyContent: isCollapsed ? 'center' : 'flex-start',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(139,26,26,0.06)'; e.currentTarget.style.color = '#3D2B1A' } }}
                        onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#A0794E' } }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 17, color: active ? '#8B1A1A' : 'rgba(61,43,26,0.35)', flexShrink: 0 }}>{item.icon}</span>
                        {!isCollapsed && <span style={{ fontSize: '0.82rem', letterSpacing: '0.01em' }}>{item.label}</span>}
                      </Link>
                    </SidebarTooltip>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User info */}
        <div style={{ borderTop: '0.5px solid rgba(196,149,106,0.35)', padding: isCollapsed ? '0.75rem 0' : '0.875rem 1rem' }}>
          {isCollapsed ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <SidebarTooltip label={userName} show>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(139,26,26,0.12)',
                  border: '0.5px solid rgba(196,149,106,0.45)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'default',
                }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", color: '#8B1A1A', fontSize: '0.85rem', fontWeight: 700 }}>
                    {userName[0]?.toUpperCase() ?? 'A'}
                  </span>
                </div>
              </SidebarTooltip>
              <SidebarTooltip label="Đăng Xuất" show>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(61,43,26,0.40)', padding: '0.2rem',
                    borderRadius: '0.25rem', transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#8B1A1A'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(61,43,26,0.40)'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 17 }}>logout</span>
                </button>
              </SidebarTooltip>
            </div>
          ) : (
            <>
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
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(61,43,26,0.45)', fontSize: '0.75rem',
                  fontFamily: "'Be Vietnam Pro', sans-serif", padding: 0,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#8B1A1A'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(61,43,26,0.45)'}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>logout</span>
                Đăng Xuất
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  )
}
