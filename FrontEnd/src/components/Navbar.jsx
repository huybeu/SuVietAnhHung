import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar({ activePage }) {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('loggedInUser')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser')
    setUser(null)
    navigate('/')
  }

  const links = [
    { label: 'Khởi Kiến', key: 'khoi-kien', to: '/' },
    { label: 'Dự Án', key: 'du-an', to: '#' },
    { label: 'Biểu Bảng', key: 'bieu-bang', to: '#' },
    { label: 'Thời Đại', key: 'thoi-dai', to: '#' },
    { label: 'Vinh Danh', key: 'vinh-danh', to: '#' },
  ]

  return (
    <nav id="navbar" className="fixed w-full top-0 z-50 transition-all duration-500 h-20 flex items-center px-margin-desktop justify-between bg-surface/80 backdrop-blur-md border-b border-secondary/30">
      <Link to="/" className="flex items-center gap-2">
        <span className="font-headline text-2xl font-bold tracking-tighter">
          <span className="text-primary-container">SỬ VIỆT</span>
          <span className="text-secondary ml-1">ANH HÙNG</span>
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {links.map(({ label, key, to }) => (
          <Link key={key} to={to}
            className={`text-sm font-semibold tracking-wider uppercase transition-colors ${
              activePage === key ? 'text-secondary border-b-2 border-secondary pb-1' : 'text-on-surface-variant hover:text-secondary'
            }`}
          >{label}</Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button className="material-symbols-outlined text-on-surface-variant hover:text-secondary">notifications</button>
        <div className="relative group">
          <button className="text-on-surface-variant hover:text-secondary transition-all">
            {user ? (
              <span className="font-headline text-sm font-bold tracking-wider">
                <span className="text-secondary">Vinh Danh:</span>{' '}
                <span className="text-primary-container">{user.name}</span>
              </span>
            ) : (
              <span className="material-symbols-outlined">account_circle</span>
            )}
          </button>
          <div className="absolute right-0 mt-2 w-56 bg-surface border border-secondary/30 rounded-sm shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
            <div className="p-2 border-b border-outline-variant/20 bg-surface-container-low">
              <p className="text-[10px] uppercase tracking-widest text-secondary/60 px-3 py-1">Tài khoản</p>
            </div>
            <div className="flex flex-col">
              {!user && (
                <>
                  <Link to="/dang-nhap" className="px-4 py-3 text-sm font-semibold text-on-surface hover:bg-primary-container/10 hover:text-secondary transition-colors flex items-center gap-3">
                    <span className="material-symbols-outlined text-lg">login</span> Đăng nhập
                  </Link>
                  <a href="#" className="px-4 py-3 text-sm font-semibold text-on-surface hover:bg-primary-container/10 hover:text-secondary transition-colors flex items-center gap-3">
                    <span className="material-symbols-outlined text-lg">person_add</span> Đăng ký
                  </a>
                  <div className="h-px bg-outline-variant/20 mx-2" />
                </>
              )}
              <Link to="/ho-so" className="px-4 py-3 text-sm font-semibold text-on-surface hover:bg-primary-container/10 hover:text-secondary transition-colors flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">account_circle</span> Thông tin người dùng
              </Link>
              <Link to="/admin" className="px-4 py-3 text-sm font-semibold text-on-surface hover:bg-primary-container/10 hover:text-secondary transition-colors flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">admin_panel_settings</span> Quản trị hệ thống
              </Link>
              <div className="h-px bg-outline-variant/20 mx-2" />
              <button onClick={handleLogout} className="px-4 py-3 text-sm font-semibold text-primary-container hover:bg-primary-container/10 transition-colors flex items-center gap-3 text-left">
                <span className="material-symbols-outlined text-lg">logout</span> Đăng xuất
              </button>
            </div>
          </div>
        </div>
        <button className="bg-primary-container text-white px-6 py-2 rounded-sm font-headline font-bold text-sm tracking-widest hover:scale-105 active:scale-95 transition-all">ĐÓNG GÓP</button>
      </div>
    </nav>
  )
}
