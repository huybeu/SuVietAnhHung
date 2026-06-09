import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const location = useLocation()
  const isRegister = location.pathname === '/dang-ky'

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { login, register } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    setUsername('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setError('')
  }, [isRegister])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!username.trim()) { setError('Vui lòng nhập tên đăng nhập.'); return }
    if (!password)         { setError('Vui lòng nhập mật khẩu.'); return }

    setSubmitting(true)
    try {
      const user = await login(username.trim(), password)
      navigate(user.isAdmin ? '/admin' : '/ho-so')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim())                { setError('Vui lòng nhập email.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('Email không hợp lệ.'); return }
    if (!username.trim())             { setError('Vui lòng nhập tên đăng nhập.'); return }
    if (password.length < 6)          { setError('Mật khẩu phải có ít nhất 6 ký tự.'); return }
    if (password !== confirmPassword)  { setError('Mật khẩu xác nhận không khớp.'); return }

    setSubmitting(true)
    try {
      await register(email.trim(), username.trim(), password)
      navigate('/ho-so')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const pageBg = 'linear-gradient(135deg, #FAE8DA 0%, #F5D5C0 100%)'

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: pageBg }}
    >
      {/* Đông Sơn subtle pattern */}
      <div className="dong-son-bg" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      <div className="w-full max-w-[400px]" style={{ position: 'relative', zIndex: 1 }}>

        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" style={{ textDecoration: 'none', fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
            <span style={{ color: '#8B1A1A' }}>SỬ VIỆT</span>
            <span style={{ color: '#C4956A', marginLeft: '0.25rem' }}>ANH HÙNG</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1 font-vietnam text-xs transition-colors"
            style={{ color: '#5C3A1E', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = '#8B1A1A'}
            onMouseLeave={e => e.currentTarget.style.color = '#5C3A1E'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
            Trang chủ
          </Link>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#3D2B1A', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            {isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}
          </h1>
          <p className="font-vietnam text-sm" style={{ color: '#5C3A1E' }}>
            {isRegister
              ? 'Tham gia cộng đồng gìn giữ lịch sử Việt Nam'
              : 'Chào mừng bạn trở lại'}
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: '#FEFAF6',
            border: '0.5px solid #D4B896',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 4px 24px rgba(61,43,26,0.10), 0 1px 4px rgba(61,43,26,0.06)',
          }}
        >
          {/* Tab switcher */}
          <div
            style={{
              display: 'flex',
              background: '#FAE8DA',
              borderRadius: '8px',
              padding: '4px',
              marginBottom: '1.5rem',
            }}
          >
            <Link
              to="/dang-nhap"
              className="font-vietnam"
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: '6px',
                textDecoration: 'none',
                transition: 'all 0.2s',
                background: !isRegister ? '#FDF5EE' : 'transparent',
                color: !isRegister ? '#3D2B1A' : '#A0794E',
                boxShadow: !isRegister ? '0 1px 4px rgba(61,43,26,0.10)' : 'none',
              }}
            >
              Đăng nhập
            </Link>
            <Link
              to="/dang-ky"
              className="font-vietnam"
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: '6px',
                textDecoration: 'none',
                transition: 'all 0.2s',
                background: isRegister ? '#FDF5EE' : 'transparent',
                color: isRegister ? '#3D2B1A' : '#A0794E',
                boxShadow: isRegister ? '0 1px 4px rgba(61,43,26,0.10)' : 'none',
              }}
            >
              Đăng ký
            </Link>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.625rem',
                padding: '0.75rem 0.875rem',
                borderRadius: '8px',
                background: '#FAE8DA',
                borderLeft: '3px solid #8B1A1A',
                color: '#8B1A1A',
                fontSize: '0.875rem',
                fontFamily: "'Be Vietnam Pro', sans-serif",
              }}
            >
              <span className="material-symbols-outlined text-base flex-shrink-0 mt-0.5">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Login form */}
          {!isRegister && (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <FormField
                id="username" label="Tên đăng nhập" type="text"
                placeholder="Nhập tên đăng nhập..." value={username}
                onChange={setUsername} autoComplete="username"
              />
              <FormPasswordField
                id="password" label="Mật khẩu" placeholder="Nhập mật khẩu..."
                value={password} onChange={setPassword}
                show={showPassword} onToggle={() => setShowPassword(!showPassword)}
                extra={
                  <a href="#"
                    className="font-vietnam text-xs transition-colors"
                    style={{ color: '#8B1A1A', textDecoration: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#6B1414'}
                    onMouseLeave={e => e.currentTarget.style.color = '#8B1A1A'}
                  >
                    Quên mật khẩu?
                  </a>
                }
              />
              <button
                type="submit"
                disabled={submitting}
                style={{
                  marginTop: '0.5rem',
                  width: '100%',
                  padding: '0.7rem',
                  background: '#8B1A1A',
                  color: '#FDF5EE',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.65 : 1,
                  transition: 'all 0.15s',
                  boxShadow: '0 4px 14px rgba(139,26,26,0.30)',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  letterSpacing: '0.03em',
                }}
                onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = '#6B1414'; }}
                onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.background = '#8B1A1A'; }}
              >
                {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>
          )}

          {/* Register form */}
          {isRegister && (
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <FormField
                id="reg-email" label="Email" type="email"
                placeholder="email@example.com" value={email}
                onChange={setEmail} autoComplete="email"
              />
              <FormField
                id="reg-username" label="Tên đăng nhập" type="text"
                placeholder="Tên đăng nhập..." value={username}
                onChange={setUsername} autoComplete="username"
              />
              <FormPasswordField
                id="reg-password" label="Mật khẩu" placeholder="Ít nhất 6 ký tự..."
                value={password} onChange={setPassword}
                show={showPassword} onToggle={() => setShowPassword(!showPassword)}
              />
              <FormPasswordField
                id="confirm-password" label="Xác nhận mật khẩu" placeholder="Nhập lại mật khẩu..."
                value={confirmPassword} onChange={setConfirmPassword}
                show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)}
              />
              <button
                type="submit"
                disabled={submitting}
                style={{
                  marginTop: '0.5rem',
                  width: '100%',
                  padding: '0.7rem',
                  background: '#8B1A1A',
                  color: '#FDF5EE',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.65 : 1,
                  transition: 'all 0.15s',
                  boxShadow: '0 4px 14px rgba(139,26,26,0.30)',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  letterSpacing: '0.03em',
                }}
                onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = '#6B1414'; }}
                onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.background = '#8B1A1A'; }}
              >
                {submitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
              </button>
            </form>
          )}
        </div>

        {/* Footer link */}
        <p className="text-center font-vietnam text-sm mt-5" style={{ color: '#5C3A1E' }}>
          {isRegister ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}
          <Link
            to={isRegister ? '/dang-nhap' : '/dang-ky'}
            className="font-semibold transition-colors"
            style={{ color: '#8B1A1A', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = '#6B1414'}
            onMouseLeave={e => e.currentTarget.style.color = '#8B1A1A'}
          >
            {isRegister ? 'Đăng nhập' : 'Đăng ký'}
          </Link>
        </p>

      </div>
    </div>
  )
}

/* ── Shared sub-components ── */

function FormField({ id, label, type, placeholder, value, onChange, autoComplete }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-vietnam text-sm font-medium" style={{ color: '#3D2B1A' }}>
        {label}
      </label>
      <input
        id={id} type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)} autoComplete={autoComplete}
        style={{
          width: '100%',
          padding: '0.625rem 0.875rem',
          background: '#FDF5EE',
          border: '0.5px solid #C4956A',
          borderRadius: '8px',
          color: '#3D2B1A',
          fontSize: '0.875rem',
          fontFamily: "'Be Vietnam Pro', sans-serif",
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        onFocus={(e) => {
          e.currentTarget.style.border = '1px solid #C4956A';
          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(196,149,106,0.18)';
          e.currentTarget.style.outline = '2px solid #C4956A';
          e.currentTarget.style.outlineOffset = '2px';
        }}
        onBlur={(e) => {
          e.currentTarget.style.border = '0.5px solid #C4956A';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.outline = 'none';
        }}
      />
    </div>
  )
}

function FormPasswordField({ id, label, placeholder, value, onChange, show, onToggle, extra }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="font-vietnam text-sm font-medium" style={{ color: '#3D2B1A' }}>{label}</label>
        {extra}
      </div>
      <div className="relative">
        <input
          id={id} type={show ? 'text' : 'password'} placeholder={placeholder}
          value={value} onChange={e => onChange(e.target.value)}
          style={{
            width: '100%',
            padding: '0.625rem 2.75rem 0.625rem 0.875rem',
            background: '#FDF5EE',
            border: '0.5px solid #C4956A',
            borderRadius: '8px',
            color: '#3D2B1A',
            fontSize: '0.875rem',
            fontFamily: "'Be Vietnam Pro', sans-serif",
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = '1px solid #C4956A';
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(196,149,106,0.18)';
            e.currentTarget.style.outline = '2px solid #C4956A';
            e.currentTarget.style.outlineOffset = '2px';
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = '0.5px solid #C4956A';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.outline = 'none';
          }}
        />
        <button
          type="button" onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
          style={{ color: '#A0794E', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
          onMouseEnter={e => e.currentTarget.style.color = '#8B1A1A'}
          onMouseLeave={e => e.currentTarget.style.color = '#A0794E'}
          aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        >
          <span className="material-symbols-outlined text-lg">
            {show ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>
    </div>
  )
}
