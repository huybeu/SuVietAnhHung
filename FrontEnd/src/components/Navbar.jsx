import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const C = {
  bg: '#F5EFE6',
  border: '#C8A882',
  red: '#7B2226',
  gold: '#A0784A',
  text: '#5C4033',
}

function IconBell({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function IconUser({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

function ActionBtn({ children, onClick, style, badge, label }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      aria-label={label}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        width: 36,
        height: 36,
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: hov ? 'rgba(123,34,38,0.09)' : 'transparent',
        transition: 'background 0.18s',
        flexShrink: 0,
        ...style,
      }}
    >
      {children}
      {badge && (
        <span style={{
          position: 'absolute',
          top: 7,
          right: 7,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: C.red,
          border: `1.5px solid ${C.bg}`,
        }} />
      )}
    </button>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  const isAdmin = user?.isAdmin || ['superadmin', 'editor'].includes(user?.role)
  const userName = user?.displayName ?? user?.username ?? user?.name ?? ''
  const activeKey = location.pathname

  useEffect(() => {
    const fn = e => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleLogout = async () => {
    await logout()
    setMobileOpen(false)
    setDropdownOpen(false)
    navigate('/')
  }

  const links = [
    { label: 'Trang Chủ', key: '/', to: '/', exact: true },
    { label: 'Anh Hùng', key: '/anh-hung', to: '/anh-hung' },
    { label: 'Bài Viết', key: '/bai-viet', to: '/bai-viet' },
  ]

  return (
    <>
      <nav
        id="navbar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 64,
          background: C.bg,
          borderBottom: `1.5px solid ${C.border}`,
          boxShadow: scrolled ? '0 2px 12px rgba(91,48,26,0.10)' : 'none',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          transition: 'box-shadow 0.3s',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 40,
          paddingRight: 40,
        }}
      >
        {/* Logo — trái */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 17,
            fontWeight: 700,
            color: C.red,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            lineHeight: 1,
          }}>
            Sử Việt
          </span>
          <span style={{ width: 1, height: 18, background: C.border, flexShrink: 0 }} />
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            fontWeight: 500,
            color: C.gold,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            lineHeight: 1,
          }}>
            Anh Hùng
          </span>
        </Link>

        {/* Nav — căn giữa tuyệt đối */}
        <div
          className="hidden md:flex"
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {links.map(({ label, key, to, exact }) => {
            const isActive = exact ? activeKey === key : activeKey.startsWith(key)
            return (
              <NavLink key={key} to={to} isActive={isActive}>
                {label}
              </NavLink>
            )
          })}
        </div>

        {/* Actions — phải */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
          {/* Desktop actions */}
          <div className="hidden md:flex items-center" style={{ gap: 4 }}>
            <ActionBtn label="Thông báo" badge={false}>
              <IconBell />
            </ActionBtn>

            <span style={{ width: 1, height: 20, background: C.border, margin: '0 4px' }} />

            {/* Account button */}
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <ActionBtn label="Tài khoản" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {user ? (
                  <span style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: C.red,
                    lineHeight: 1,
                  }}>
                    {userName[0]?.toUpperCase() ?? '?'}
                  </span>
                ) : (
                  <IconUser />
                )}
              </ActionBtn>

              {/* Dropdown */}
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 10px)',
                  width: 240,
                  background: '#FDF8F2',
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  boxShadow: '0 8px 28px rgba(91,48,26,0.14)',
                  overflow: 'hidden',
                  opacity: dropdownOpen ? 1 : 0,
                  visibility: dropdownOpen ? 'visible' : 'hidden',
                  transform: dropdownOpen ? 'scale(1)' : 'scale(0.96)',
                  transformOrigin: 'top right',
                  transition: 'all 0.18s ease',
                  zIndex: 60,
                }}
              >
                {/* Header dropdown */}
                <div style={{ padding: '10px 14px', borderBottom: `1px solid ${C.border}`, background: '#F0E5D8' }}>
                  {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: 'rgba(123,34,38,0.12)',
                        border: `1px solid rgba(200,168,130,0.5)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: C.red }}>
                          {userName[0]?.toUpperCase() ?? '?'}
                        </span>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: C.text, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</p>
                        <p style={{ fontFamily: 'Inter', fontSize: 11, color: C.gold, margin: 0 }}>{isAdmin ? 'Quản trị viên' : 'Thành viên'}</p>
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontFamily: 'Inter', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: C.gold, margin: 0 }}>Tài khoản</p>
                  )}
                </div>

                {/* Items */}
                <div style={{ paddingTop: 4, paddingBottom: 4 }}>
                  {!user ? (
                    <>
                      <DropItem to="/dang-nhap" icon="→" label="Đăng nhập" onClick={() => setDropdownOpen(false)} />
                      <DropItem to="/dang-ky" icon="+" label="Đăng ký" onClick={() => setDropdownOpen(false)} />
                    </>
                  ) : (
                    <>
                      <DropItem to="/ho-so" icon="○" label="Thông tin cá nhân" onClick={() => setDropdownOpen(false)} />
                      {isAdmin && (
                        <>
                          <div style={{ height: 1, background: C.border, margin: '4px 12px' }} />
                          <p style={{ fontFamily: 'Inter', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: C.gold, margin: 0, padding: '6px 14px 2px' }}>Quản trị</p>
                          <DropItem to="/admin" icon="▪" label="Dashboard" onClick={() => setDropdownOpen(false)} />
                          <DropItem to="/admin/nguoi-dung" icon="▪" label="Quản lý người dùng" onClick={() => setDropdownOpen(false)} />
                        </>
                      )}
                      <div style={{ height: 1, background: C.border, margin: '4px 12px' }} />
                      <LogoutBtn onClick={handleLogout} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div
          className={`absolute top-[64px] right-0 w-72 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ background: C.bg, borderLeft: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, boxShadow: '-4px 0 20px rgba(91,48,26,0.12)' }}
        >
          <div style={{ borderBottom: `1px solid ${C.border}` }}>
            {links.map(({ label, key, to, exact }) => {
              const isActive = exact ? activeKey === key : activeKey.startsWith(key)
              return (
                <Link
                  key={key}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'block',
                    fontFamily: 'Inter',
                    fontSize: 12,
                    fontWeight: 500,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    padding: '14px 24px',
                    color: isActive ? C.red : C.text,
                    background: isActive ? 'rgba(123,34,38,0.07)' : 'transparent',
                    borderLeft: isActive ? `3px solid ${C.red}` : '3px solid transparent',
                  }}
                >
                  {label}
                </Link>
              )
            })}
          </div>

          <div style={{ padding: '8px 0' }}>
            {!user ? (
              <>
                <MobileItem to="/dang-nhap" label="Đăng nhập" onClick={() => setMobileOpen(false)} />
                <MobileItem to="/dang-ky" label="Đăng ký" onClick={() => setMobileOpen(false)} />
              </>
            ) : (
              <>
                <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid rgba(200,168,130,0.3)` }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(123,34,38,0.1)', border: `1px solid rgba(200,168,130,0.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 14, color: C.red }}>{userName[0]?.toUpperCase() ?? '?'}</span>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: C.text, margin: 0 }}>{userName}</p>
                    <p style={{ fontFamily: 'Inter', fontSize: 11, color: C.gold, margin: 0 }}>{isAdmin ? 'Quản trị viên' : 'Thành viên'}</p>
                  </div>
                </div>
                <MobileItem to="/ho-so" label="Thông tin cá nhân" onClick={() => setMobileOpen(false)} />
                {isAdmin && (
                  <>
                    <MobileItem to="/admin" label="Dashboard" onClick={() => setMobileOpen(false)} />
                    <MobileItem to="/admin/nguoi-dung" label="Quản lý người dùng" onClick={() => setMobileOpen(false)} />
                  </>
                )}
                <div style={{ height: 1, background: C.border, margin: '4px 16px' }} />
                <button
                  onClick={handleLogout}
                  style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: C.red, background: 'none', border: 'none', cursor: 'pointer', padding: '12px 24px', width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  Đăng xuất
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function NavLink({ to, isActive, children }) {
  const [hov, setHov] = useState(false)
  return (
    <Link
      to={to}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        color: isActive ? '#7B2226' : '#5C4033',
        padding: '6px 12px',
        borderRadius: 4,
        background: isActive ? 'rgba(123,34,38,0.10)' : hov ? 'rgba(123,34,38,0.07)' : 'transparent',
        borderBottom: isActive ? '2px solid #7B2226' : '2px solid transparent',
        transition: 'background 0.18s',
        position: 'relative',
      }}
    >
      {children}
    </Link>
  )
}

function DropItem({ to, label, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <Link
      to={to}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'block',
        fontFamily: 'Inter',
        fontSize: 13,
        fontWeight: 500,
        color: '#5C4033',
        textDecoration: 'none',
        padding: '9px 14px',
        background: hov ? 'rgba(123,34,38,0.06)' : 'transparent',
        transition: 'background 0.15s',
      }}
    >
      {label}
    </Link>
  )
}

function LogoutBtn({ onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: 'Inter',
        fontSize: 13,
        fontWeight: 600,
        color: '#7B2226',
        background: hov ? 'rgba(123,34,38,0.06)' : 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '9px 14px',
        width: '100%',
        textAlign: 'left',
        transition: 'background 0.15s',
      }}
    >
      Đăng xuất
    </button>
  )
}

function MobileItem({ to, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        display: 'block',
        fontFamily: 'Inter',
        fontSize: 13,
        fontWeight: 500,
        color: '#5C4033',
        textDecoration: 'none',
        padding: '12px 24px',
      }}
    >
      {label}
    </Link>
  )
}
