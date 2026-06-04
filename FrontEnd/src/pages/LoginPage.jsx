import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight
      document.querySelectorAll('.corner-glow').forEach((glow, index) => {
        const multiplier = (index + 1) * 20
        glow.style.transform = `translate(${x * multiplier}px, ${y * multiplier}px)`
      })
    }
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username.trim()) return
    if (username.trim().toLowerCase() === 'admin') {
      localStorage.setItem('loggedInUser', JSON.stringify({ name: 'Admin' }))
      navigate('/admin')
    } else {
      localStorage.setItem('loggedInUser', JSON.stringify({ name: username.trim() }))
      navigate('/ho-so')
    }
  }

  return (
    <div className="relative min-h-screen bg-[#0a0402] overflow-hidden">
      {/* Background layers */}
      <div className="dong-son-bg" style={{ position: 'fixed', inset: 0, zIndex: 0 }} />
      <div
        className="corner-glow glow-red"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(220,20,60,0.25) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none',
          transition: 'transform 0.1s ease-out',
        }}
      />
      <div
        className="corner-glow glow-gold"
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(246,190,59,0.2) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none',
          transition: 'transform 0.1s ease-out',
        }}
      />
      <div
        className="corner-glow glow-red"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(220,20,60,0.12) 0%, transparent 70%)',
          opacity: 0.2,
          zIndex: 0,
          pointerEvents: 'none',
          transition: 'transform 0.1s ease-out',
        }}
      />

      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <div
        className="relative z-10 flex items-center justify-center pt-20"
        style={{ minHeight: '100vh' }}
      >
        {/* Auth card */}
        <div
          className="auth-card p-10 rounded-lg relative overflow-hidden"
          style={{ maxWidth: '450px', width: '100%' }}
        >
          {/* Decorative corner borders */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '32px',
              height: '32px',
              borderTop: '2px solid rgba(246,190,59,0.4)',
              borderLeft: '2px solid rgba(246,190,59,0.4)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '32px',
              height: '32px',
              borderTop: '2px solid rgba(246,190,59,0.4)',
              borderRight: '2px solid rgba(246,190,59,0.4)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '32px',
              height: '32px',
              borderBottom: '2px solid rgba(246,190,59,0.4)',
              borderLeft: '2px solid rgba(246,190,59,0.4)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '32px',
              height: '32px',
              borderBottom: '2px solid rgba(246,190,59,0.4)',
              borderRight: '2px solid rgba(246,190,59,0.4)',
            }}
          />

          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(246,190,59,0.1)',
                marginBottom: '16px',
              }}
            >
              <span
                className="material-icons"
                style={{ color: '#f6be3b', fontSize: '28px' }}
              >
                history_edu
              </span>
            </div>

            <p
              style={{
                color: '#f6be3b',
                letterSpacing: '0.3em',
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                marginBottom: '8px',
                fontWeight: 600,
              }}
            >
              Sử Việt Anh Hùng
            </p>

            <h1
              className="text-headline-lg text-secondary"
              style={{
                color: '#f6be3b',
                fontSize: '2rem',
                fontWeight: 700,
                marginBottom: '12px',
                textAlign: 'center',
              }}
            >
              Đăng Nhập
            </h1>

            <div
              className="decorative-line"
              style={{
                width: '96px',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #dc143c, transparent)',
              }}
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Username field */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="username"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#f6be3b',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  marginBottom: '4px',
                }}
              >
                <span className="material-icons" style={{ fontSize: '16px' }}>
                  person
                </span>
                Danh tính
              </label>
              <input
                id="username"
                type="text"
                className="input-gold"
                placeholder="Nhập danh tính của bạn..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-1">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '4px',
                }}
              >
                <label
                  htmlFor="password"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#f6be3b',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                  }}
                >
                  <span className="material-icons" style={{ fontSize: '16px' }}>
                    lock
                  </span>
                  Mật khẩu
                </label>
                <a
                  href="#"
                  style={{
                    color: '#dc143c',
                    fontSize: '0.75rem',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = '#f6be3b')}
                  onMouseLeave={(e) => (e.target.style.color = '#dc143c')}
                >
                  Quên mật khẩu?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-gold"
                  placeholder="Nhập mật khẩu..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  style={{ width: '100%', paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgba(246,190,59,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = '#f6be3b')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = 'rgba(246,190,59,0.6)')
                  }
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  <span className="material-icons" style={{ fontSize: '20px' }}>
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="btn-epic group"
              style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              Đăng Nhập
              <span
                className="material-icons group-hover:translate-x-1"
                style={{
                  fontSize: '20px',
                  transition: 'transform 0.2s',
                }}
              >
                fort
              </span>
            </button>
          </form>

          {/* Footer */}
          <div
            style={{
              marginTop: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
              Chưa có tài khoản?{' '}
              <Link
                to="/dang-ky"
                style={{
                  color: '#f6be3b',
                  textDecoration: 'none',
                  fontWeight: 600,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.target.style.color = '#dc143c')}
                onMouseLeave={(e) => (e.target.style.color = '#f6be3b')}
              >
                Gia nhập sử sách
              </Link>
            </p>

            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'rgba(255,255,255,0.4)',
                fontSize: '0.8rem',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'rgba(246,190,59,0.8)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
              }}
            >
              <span className="material-icons" style={{ fontSize: '16px' }}>
                arrow_back
              </span>
              Trở về trang chủ
            </Link>
          </div>

          {/* Bottom text */}
          <p
            style={{
              marginTop: '24px',
              textAlign: 'center',
              color: 'rgba(246,190,59,0.25)',
              fontSize: '0.6rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
            }}
          >
            Hào khí ngàn năm • Vang vọng núi sông
          </p>
        </div>
      </div>
    </div>
  )
}
