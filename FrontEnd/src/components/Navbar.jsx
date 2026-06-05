import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ activePage }) {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  const isAdmin = user?.isAdmin

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    setMobileOpen(false)
    setDropdownOpen(false)
    navigate('/')
  }

  const links = [
    { label: 'Khởi Kiến', key: 'khoi-kien', to: '/' },
    { label: 'Dự Án',     key: 'du-an',     to: '#' },
    { label: 'Biểu Bảng', key: 'bieu-bang', to: '#' },
    { label: 'Thời Đại',  key: 'thoi-dai',  to: '#' },
    { label: 'Vinh Danh', key: 'vinh-danh', to: '#' },
  ]

  return (
    <>
      <nav
        id="navbar"
        style={{
          background: scrolled ? 'rgba(253,245,238,0.99)' : 'rgba(253,245,238,0.96)',
          borderBottom: '1px solid rgba(196,149,106,0.30)',
          paddingLeft: '2rem',
          paddingRight: '2rem',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: scrolled ? '0 2px 16px rgba(61,43,26,0.12)' : '0 1px 4px rgba(61,43,26,0.06)',
          transition: 'all 0.3s ease',
        }}
        className="fixed w-full top-0 z-50 h-18 flex items-center justify-between"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
            <span style={{ color: '#8B1A1A' }}>SỬ VIỆT</span>
            <span style={{ color: '#C4956A', marginLeft: '0.3rem' }}>ANH HÙNG</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ label, key, to }) => {
            const isActive = activePage === key
            return (
              <Link
                key={key}
                to={to}
                className="font-vietnam text-sm font-semibold tracking-wider uppercase transition-all"
                style={{
                  color: isActive ? '#8B1A1A' : 'rgba(61,43,26,0.55)',
                  borderBottom: isActive ? '2px solid #8B1A1A' : '2px solid transparent',
                  paddingBottom: '4px',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#8B1A1A' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'rgba(61,43,26,0.55)' }}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button
            className="hidden md:flex material-symbols-outlined"
            style={{ color: 'rgba(61,43,26,0.45)', fontSize: '22px', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#8B1A1A'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(61,43,26,0.45)'}
          >
            notifications
          </button>

          {/* Account dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 transition-all focus:outline-none"
            >
              {user ? (
                <>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(139,26,26,0.28)', border: '1.5px solid rgba(196,149,106,0.45)' }}
                  >
                    <span style={{ color: '#C4956A', fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '0.85rem', lineHeight: 1 }}>
                      {user.name[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:block font-vietnam text-sm font-semibold max-w-[120px] truncate"
                    style={{ color: '#3D2B1A' }}>
                    {user.name}
                  </span>
                  <span
                    className="hidden md:block material-symbols-outlined text-base"
                    style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', color: 'rgba(61,43,26,0.45)' }}
                  >
                    expand_more
                  </span>
                </>
              ) : (
                <span className="material-symbols-outlined text-2xl" style={{ color: 'rgba(61,43,26,0.55)' }}>account_circle</span>
              )}
            </button>

            {/* Dropdown panel — light cream for readability */}
            <div
              className={`absolute right-0 mt-3 w-64 rounded-xl z-50 overflow-hidden transition-all duration-200 origin-top-right ${
                dropdownOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'
              }`}
              style={{
                background: '#FDF5EE',
                border: '0.5px solid #D4B896',
                boxShadow: '0 8px 32px rgba(61,43,26,0.18), 0 2px 8px rgba(61,43,26,0.08)',
              }}
            >
              <div style={{ padding: '0.75rem 1rem', borderBottom: '0.5px solid #D4B896', background: '#FAE8DA' }}>
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(139,26,26,0.12)', border: '0.5px solid rgba(196,149,106,0.5)' }}>
                      <span style={{ color: '#8B1A1A', fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1rem' }}>
                        {user.name[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-vietnam text-sm font-semibold truncate" style={{ color: '#3D2B1A' }}>{user.name}</p>
                      <p className="font-vietnam text-xs" style={{ color: '#5C3A1E' }}>
                        {isAdmin ? 'Quản trị viên' : 'Thành viên'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="font-vietnam text-[10px] uppercase tracking-widest" style={{ color: '#A0794E' }}>Tài khoản</p>
                )}
              </div>

              <div className="flex flex-col py-1">
                {!user ? (
                  <>
                    <DropItem to="/dang-nhap" icon="login" label="Đăng nhập" onClick={() => setDropdownOpen(false)} />
                    <DropItem to="/dang-ky" icon="person_add" label="Đăng ký" onClick={() => setDropdownOpen(false)} />
                  </>
                ) : (
                  <>
                    <DropItem to="/ho-so" icon="account_circle" label="Thông tin cá nhân" onClick={() => setDropdownOpen(false)} />
                    {isAdmin && (
                      <>
                        <div style={{ height: '0.5px', background: '#D4B896', margin: '0.25rem 0.75rem' }} />
                        <div className="px-4 py-1.5">
                          <p className="font-vietnam text-[10px] uppercase tracking-widest flex items-center gap-1.5" style={{ color: '#A0794E' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 12 }}>admin_panel_settings</span>
                            Quản trị
                          </p>
                        </div>
                        <DropItem to="/admin" icon="dashboard" label="Dashboard" indent onClick={() => setDropdownOpen(false)} />
                        <DropItem to="/admin" icon="manage_accounts" label="Quản lý người dùng" indent onClick={() => setDropdownOpen(false)} />
                      </>
                    )}
                    <div style={{ height: '0.5px', background: '#D4B896', margin: '0.25rem 0.75rem' }} />
                    <button
                      onClick={handleLogout}
                      className="font-vietnam px-4 py-3 text-sm font-semibold flex items-center gap-3 text-left w-full transition-colors"
                      style={{ color: '#8B1A1A', background: 'none', border: 'none', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,26,26,0.06)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span className="material-symbols-outlined text-lg">logout</span>
                      Đăng xuất
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            className="hidden md:block font-vietnam font-bold text-sm tracking-widest rounded-lg transition-all hover:scale-[1.03] active:scale-95"
            style={{ background: '#8B1A1A', color: '#FDF5EE', padding: '0.5rem 1.25rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(139,26,26,0.40)' }}
            onMouseEnter={e => e.currentTarget.style.background = '#6B1414'}
            onMouseLeave={e => e.currentTarget.style.background = '#8B1A1A'}
          >
            ĐÓNG GÓP
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1 focus:outline-none"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span className={`block h-0.5 transition-all duration-300 ${mobileOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`}
              style={{ background: 'rgba(61,43,26,0.75)' }} />
            <span className={`block h-0.5 transition-all duration-300 ${mobileOpen ? 'opacity-0 w-0' : 'w-4'}`}
              style={{ background: 'rgba(61,43,26,0.75)' }} />
            <span className={`block h-0.5 transition-all duration-300 ${mobileOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-6'}`}
              style={{ background: 'rgba(61,43,26,0.75)' }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />

        <div
          className={`absolute top-[72px] right-0 w-72 transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ background: '#FDF5EE', borderLeft: '0.5px solid #D4B896', borderBottom: '0.5px solid #D4B896', boxShadow: '-4px 0 24px rgba(61,43,26,0.14)' }}
        >
          {/* Nav links */}
          <div className="flex flex-col" style={{ borderBottom: '0.5px solid #D4B896' }}>
            {links.map(({ label, key, to }) => (
              <Link
                key={key} to={to}
                onClick={() => setMobileOpen(false)}
                className="font-vietnam px-6 py-4 text-sm font-semibold tracking-wider uppercase transition-colors"
                style={{
                  color: activePage === key ? '#8B1A1A' : '#5C3A1E',
                  background: activePage === key ? 'rgba(139,26,26,0.07)' : 'transparent',
                  borderLeft: activePage === key ? '3px solid #8B1A1A' : '3px solid transparent',
                  textDecoration: 'none',
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col py-2">
            {!user ? (
              <>
                <MobileItem to="/dang-nhap" icon="login" label="Đăng nhập" onClick={() => setMobileOpen(false)} />
                <MobileItem to="/dang-ky" icon="person_add" label="Đăng ký" onClick={() => setMobileOpen(false)} />
              </>
            ) : (
              <>
                <div className="px-6 py-3 flex items-center gap-3" style={{ borderBottom: '0.5px solid rgba(212,184,150,0.3)' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(139,26,26,0.12)', border: '0.5px solid rgba(196,149,106,0.5)' }}>
                    <span style={{ color: '#8B1A1A', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                      {user.name[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-vietnam text-sm font-semibold" style={{ color: '#3D2B1A' }}>{user.name}</p>
                    <p className="font-vietnam text-xs" style={{ color: '#5C3A1E' }}>{isAdmin ? 'Quản trị viên' : 'Thành viên'}</p>
                  </div>
                </div>

                <MobileItem to="/ho-so" icon="account_circle" label="Thông tin cá nhân" onClick={() => setMobileOpen(false)} />

                {isAdmin && (
                  <>
                    <div className="px-6 py-1.5">
                      <p className="font-vietnam text-[10px] uppercase tracking-widest flex items-center gap-1" style={{ color: '#A0794E' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>admin_panel_settings</span>Quản trị
                      </p>
                    </div>
                    <MobileItem to="/admin" icon="dashboard" label="Dashboard" indent onClick={() => setMobileOpen(false)} />
                    <MobileItem to="/admin" icon="manage_accounts" label="Quản lý người dùng" indent onClick={() => setMobileOpen(false)} />
                  </>
                )}

                <div style={{ height: '0.5px', background: '#D4B896', margin: '0.25rem 1rem' }} />
                <button
                  onClick={handleLogout}
                  className="font-vietnam px-6 py-3.5 text-sm font-semibold flex items-center gap-3 text-left w-full"
                  style={{ color: '#8B1A1A', background: 'none', border: 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,26,26,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span className="material-symbols-outlined text-lg">logout</span>Đăng xuất
                </button>
              </>
            )}
          </div>

          <div style={{ padding: '1rem', borderTop: '0.5px solid #D4B896' }}>
            <button
              className="w-full font-vietnam font-bold text-sm tracking-widest rounded-lg"
              style={{ background: '#8B1A1A', color: '#FDF5EE', padding: '0.75rem', border: 'none', cursor: 'pointer' }}
            >
              ĐÓNG GÓP NGAY
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

/* ── Sub-components ── */

function DropItem({ to, icon, label, indent, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="font-vietnam text-sm font-semibold flex items-center gap-3 transition-colors"
      style={{
        color: '#3D2B1A',
        textDecoration: 'none',
        padding: indent ? '0.625rem 1rem 0.625rem 2rem' : '0.75rem 1rem',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,26,26,0.06)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span className="material-symbols-outlined" style={{ fontSize: indent ? 16 : 18, color: indent ? '#5C3A1E' : '#8B1A1A' }}>{icon}</span>
      {label}
    </Link>
  )
}

function MobileItem({ to, icon, label, indent, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="font-vietnam text-sm font-semibold flex items-center gap-3 transition-colors"
      style={{
        color: '#3D2B1A',
        textDecoration: 'none',
        padding: indent ? '0.75rem 1.5rem 0.75rem 2.5rem' : '0.875rem 1.5rem',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,26,26,0.05)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span className="material-symbols-outlined" style={{ fontSize: indent ? 16 : 18, color: indent ? '#5C3A1E' : '#8B1A1A' }}>{icon}</span>
      {label}
    </Link>
  )
}
