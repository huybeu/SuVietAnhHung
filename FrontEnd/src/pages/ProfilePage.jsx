import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { user, isInitializing } = useAuth()
  const navigate = useNavigate()
  const avatarInputRef = useRef(null)

  /* ── Trạng thái form chỉnh sửa hồ sơ ── */
  const [formData, setFormData] = useState({ displayName: '', gender: '', birthDate: '', phone: '', bio: '' })
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [errors, setErrors]               = useState({})
  const [isSaving, setIsSaving]           = useState(false)
  const [saveSuccess, setSaveSuccess]     = useState(false)

  /* ── Trạng thái modal đổi mật khẩu ── */
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordData, setPasswordData]           = useState({ old: '', next: '', confirm: '' })
  const [passwordErrors, setPasswordErrors]       = useState({})
  const [isSavingPwd, setIsSavingPwd]             = useState(false)
  const [passwordSuccess, setPasswordSuccess]     = useState(false)
  const [showOld, setShowOld]                     = useState(false)
  const [showNew, setShowNew]                     = useState(false)
  const [showConfirm, setShowConfirm]             = useState(false)

  /* ── Khởi tạo form từ dữ liệu user ── */
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName ?? user.name ?? '',
        gender:      user.gender    ?? '',
        birthDate:   user.birthDate ?? '',
        phone:       user.phone     ?? '',
        bio:         user.bio       ?? '',
      })
    }
  }, [user])

  /* ── Chuyển hướng nếu chưa đăng nhập ── */
  useEffect(() => {
    if (!isInitializing && !user) navigate('/dang-nhap')
  }, [user, isInitializing, navigate])

  /* ── Reveal on scroll ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('revealed')),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  /* ── Handlers ── */
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => setAvatarPreview(evt.target.result)
    reader.readAsDataURL(file)
  }

  const validate = () => {
    const e = {}
    if (!formData.displayName.trim())                  e.displayName = 'Tên hiển thị không được để trống'
    else if (formData.displayName.trim().length < 2)   e.displayName = 'Tên hiển thị phải có ít nhất 2 ký tự'
    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, '')))
      e.phone = 'Số điện thoại không hợp lệ (10–11 chữ số)'
    if (formData.bio.length > 300)
      e.bio   = `Giới thiệu tối đa 300 ký tự (hiện tại: ${formData.bio.length})`
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSave = async () => {
    if (!validate()) return
    setIsSaving(true)
    /* Gọi API cập nhật hồ sơ ở đây trong tương lai */
    await new Promise(r => setTimeout(r, 700))
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const validatePwd = () => {
    const e = {}
    if (!passwordData.old)                           e.old     = 'Vui lòng nhập mật khẩu cũ'
    if (!passwordData.next)                          e.next    = 'Vui lòng nhập mật khẩu mới'
    else if (passwordData.next.length < 6)           e.next    = 'Mật khẩu mới phải ít nhất 6 ký tự'
    if (passwordData.next !== passwordData.confirm)  e.confirm = 'Mật khẩu xác nhận không khớp'
    setPasswordErrors(e)
    return !Object.keys(e).length
  }

  const handleChangePassword = async () => {
    if (!validatePwd()) return
    setIsSavingPwd(true)
    /* Gọi API đổi mật khẩu ở đây trong tương lai */
    await new Promise(r => setTimeout(r, 700))
    setIsSavingPwd(false)
    setPasswordSuccess(true)
    setTimeout(() => {
      setPasswordSuccess(false)
      setShowPasswordModal(false)
      setPasswordData({ old: '', next: '', confirm: '' })
      setPasswordErrors({})
    }, 2200)
  }

  const closePasswordModal = () => {
    setShowPasswordModal(false)
    setPasswordData({ old: '', next: '', confirm: '' })
    setPasswordErrors({})
    setPasswordSuccess(false)
  }

  if (isInitializing) return null

  /* ── Giá trị hiển thị ── */
  const displayName = formData.displayName || user?.displayName || user?.name || '—'

  /* ── Styles tái sử dụng ── */
  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '0.65rem 0.875rem',
    border: `0.5px solid ${hasError ? '#8B1A1A' : 'rgba(196,149,106,0.5)'}`,
    borderRadius: '8px',
    background: '#FDF5EE',
    color: '#3D2B1A',
    fontSize: '0.9rem',
    fontFamily: "'Be Vietnam Pro', sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  })

  const readonlyStyle = {
    ...inputStyle(false),
    background: 'rgba(61,43,26,0.04)',
    color: '#A0794E',
    cursor: 'not-allowed',
    border: '0.5px solid rgba(61,43,26,0.12)',
  }

  const labelStyle = {
    display: 'block',
    color: '#7B4A00',
    fontSize: '0.78rem',
    fontWeight: 600,
    marginBottom: '0.4rem',
    fontFamily: "'Be Vietnam Pro', sans-serif",
    letterSpacing: '0.03em',
  }

  const errorStyle = {
    color: '#8B1A1A',
    fontSize: '0.75rem',
    marginTop: '0.3rem',
    fontFamily: "'Be Vietnam Pro', sans-serif",
  }

  const readonlyBadge = (
    <span style={{
      background: 'rgba(61,43,26,0.07)', color: '#A0794E',
      fontSize: '0.65rem', padding: '0.1rem 0.45rem',
      borderRadius: '4px', fontWeight: 500, marginLeft: '0.4rem',
    }}>
      Chỉ đọc
    </span>
  )

  const badges = [
    { icon: 'auto_awesome', fill: 1, color: '#C4956A', label: 'Hào Khí',   rank: 'Sơ Cấp'    },
    { icon: 'favorite',     fill: 1, color: '#8B1A1A', label: 'Tâm Huyết', rank: 'Cao Cấp'   },
    { icon: 'history_edu',  fill: 0, color: '#7B4A00', label: 'Sử Gia',    rank: 'Bậc Thầy'  },
    { icon: 'shield',       fill: 1, color: '#C4956A', label: 'Hộ Quốc',   rank: 'Kiên Định' },
  ]

  const contributions = [
    {
      icon: 'castle', iconColor: '#8B1A1A',
      title: 'Phục dựng 3D Hoàng Thành Thăng Long',
      date: '15 Tháng 05, 2024', amount: '+5.000.000 VND',
      status: 'Hoàn tất', statusBg: 'rgba(45,160,45,0.10)', statusColor: '#2A7A2A', statusBorder: 'rgba(45,160,45,0.3)',
    },
    {
      icon: 'menu_book', iconColor: '#C4956A',
      title: 'Đại Việt Sử Ký Toàn Thư - Bản Giới Hạn',
      date: '02 Tháng 04, 2024', amount: '+2.500.000 VND',
      status: 'Đã nhận hàng', statusBg: 'rgba(30,120,200,0.08)', statusColor: '#1A5A9A', statusBorder: 'rgba(30,120,200,0.3)',
    },
    {
      icon: 'theater_comedy', iconColor: '#7B4A00',
      title: 'Quỹ Duy trì Nghệ thuật Hát Bội Nam Bộ',
      date: '20 Tháng 02, 2024', amount: '+10.000.000 VND',
      status: 'Vinh danh Đồng', statusBg: 'rgba(196,149,106,0.12)', statusColor: '#7B4A00', statusBorder: 'rgba(196,149,106,0.45)',
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#FDF5EE', color: '#3D2B1A' }}>

      {/* ── Scoped styles ── */}
      <style>{`
        .profile-progress-fill {
          background: linear-gradient(90deg, #8B1A1A, #C4956A);
          height: 100%;
          border-radius: 9999px;
          transition: width 1.2s cubic-bezier(0.4,0,0.2,1);
        }
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.75s ease, transform 0.75s ease; }
        .reveal.revealed { opacity: 1; transform: translateY(0); }
        .may-tan-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(196,149,106,0.45), transparent);
          margin: 0;
        }

        /* Avatar upload zone */
        .avatar-upload-zone { position: relative; cursor: pointer; display: inline-block; }
        .avatar-upload-zone:hover .avatar-overlay { opacity: 1; }
        .avatar-overlay {
          position: absolute; inset: 0; border-radius: 50%;
          background: rgba(139,26,26,0.45);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.25s;
        }

        /* Password modal */
        .password-modal-backdrop {
          position: fixed; inset: 0; background: rgba(26,10,0,0.6);
          z-index: 200; display: flex; align-items: center; justify-content: center;
          padding: 1.5rem; backdrop-filter: blur(4px);
        }
        .password-modal-card {
          background: #FDF5EE; border: 0.5px solid #D4B896; border-radius: 16px;
          padding: 2.5rem; width: 100%; max-width: 480px;
          box-shadow: 0 24px 64px rgba(61,43,26,0.22);
          animation: modal-in 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.93) translateY(14px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }

        /* Password input toggle */
        .pwd-input-wrap { position: relative; }
        .pwd-toggle {
          position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #A0794E;
          display: flex; align-items: center; padding: 0;
        }
        .pwd-toggle:hover { color: #7B4A00; }

        /* Save success toast */
        .save-success-toast {
          position: fixed; bottom: 2rem; right: 1.5rem;
          background: #2A7A2A; color: #fff;
          padding: 0.75rem 1.25rem; border-radius: 10px;
          font-family: 'Be Vietnam Pro', sans-serif; font-size: 0.88rem; font-weight: 600;
          z-index: 300; display: flex; align-items: center; gap: 0.5rem;
          box-shadow: 0 4px 20px rgba(42,122,42,0.35);
          animation: toast-in 0.3s ease;
        }
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Spin cho nút loading */
        @keyframes spin-anim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin-anim { animation: spin-anim 0.8s linear infinite; }

        /* Input focus ring */
        .profile-field input:focus, .profile-field textarea:focus {
          border-color: #C4956A !important;
          box-shadow: 0 0 0 3px rgba(196,149,106,0.12);
        }
      `}</style>

      {/* ════════════════════════════════════════
          1. PROFILE HEADER
      ════════════════════════════════════════ */}
      <section style={{ padding: '7rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px,100%), 1fr))',
            gap: '2.5rem', alignItems: 'center',
          }}>

            {/* Avatar hiển thị */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  width: 'clamp(140px, 15vw, 200px)', height: 'clamp(140px, 15vw, 200px)',
                  borderRadius: '50%', border: '2px solid rgba(196,149,106,0.45)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#FAE8DA', boxShadow: '0 2px 16px rgba(196,149,106,0.15)',
                  overflow: 'hidden',
                }}>
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{
                      fontFamily: "'Playfair Display', serif", color: '#C4956A',
                      fontSize: 'clamp(3.5rem, 9vw, 5rem)', lineHeight: 1,
                      fontWeight: 700, userSelect: 'none',
                    }}>
                      {(displayName[0] ?? '?').toUpperCase()}
                    </span>
                  )}
                </div>
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  border: '0.5px solid rgba(196,149,106,0.18)',
                  transform: 'scale(1.1)', pointerEvents: 'none',
                }} />
              </div>
            </div>

            {/* Thông tin */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h1 style={{
                fontFamily: "'Playfair Display', serif", color: '#C4956A',
                fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 700, margin: 0,
              }}>
                {displayName}
              </h1>

              <div style={{
                display: 'inline-flex', alignItems: 'center', alignSelf: 'flex-start',
                gap: '0.5rem', padding: '0.35rem 1rem',
                background: 'rgba(196,149,106,0.1)', color: '#7B4A00',
                border: '0.5px solid rgba(196,149,106,0.35)', borderRadius: '9999px',
                fontSize: '0.85rem', fontWeight: 600, fontFamily: "'Be Vietnam Pro', sans-serif",
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1rem', fontVariationSettings: "'FILL' 1" }}>
                  {user?.isAdmin ? 'admin_panel_settings' : 'workspace_premium'}
                </span>
                {user?.isAdmin ? 'Quản Trị Viên' : 'Người Gìn Giữ Sử Việt'}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#A0794E', fontSize: '0.88rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                <span className="material-symbols-outlined" style={{ color: '#C4956A', fontSize: '1rem', fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span>Thành viên cấp 8</span>
              </div>

              {formData.bio && (
                <blockquote style={{
                  fontFamily: "'Merriweather', serif", fontStyle: 'italic', fontWeight: 300,
                  color: '#5C3A1E', fontSize: '0.9rem', lineHeight: 1.85,
                  borderLeft: '2px solid rgba(196,149,106,0.45)', paddingLeft: '1rem',
                  margin: '0.25rem 0', maxWidth: '56ch',
                }}>
                  "{formData.bio}"
                </blockquote>
              )}

              {/* Thống kê */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', marginTop: '0.5rem', borderLeft: '0.5px solid #D4B896' }}>
                {[
                  { val: '24.500.000 VND', label: 'Tổng Đóng Góp' },
                  { val: '12',             label: 'Chiến Dịch'    },
                  { val: '8.420',          label: 'Điểm Uy Danh'  },
                ].map(({ val, label }) => (
                  <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 1.25rem', borderRight: '0.5px solid #D4B896' }}>
                    <span style={{ color: '#C4956A', fontWeight: 700, fontSize: '1.1rem', fontFamily: "'Playfair Display', serif" }}>{val}</span>
                    <span style={{ color: '#A0794E', fontSize: '0.72rem', marginTop: '0.25rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          2. CHỈNH SỬA HỒ SƠ
      ════════════════════════════════════════ */}
      <section className="reveal" style={{ padding: '0 1.5rem 4rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            background: '#FDF5EE', border: '0.5px solid #D4B896',
            borderRadius: '16px', padding: '2.5rem',
            boxShadow: '0 4px 24px rgba(61,43,26,0.08)',
          }}>

            {/* Tiêu đề section */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              marginBottom: '2rem', paddingBottom: '1rem',
              borderBottom: '0.5px solid rgba(196,149,106,0.3)',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', color: '#C4956A', fontVariationSettings: "'FILL' 1" }}>manage_accounts</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#3D2B1A', fontWeight: 700, margin: 0 }}>
                Chỉnh Sửa Hồ Sơ
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px,100%), 1fr))', gap: '2.5rem', alignItems: 'flex-start' }}>

              {/* Cột trái: upload avatar */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <p style={{ ...labelStyle, alignSelf: 'flex-start' }}>Ảnh Đại Diện</p>

                <div className="avatar-upload-zone" onClick={() => avatarInputRef.current?.click()}>
                  <div style={{
                    width: 160, height: 160, borderRadius: '50%',
                    border: '2px dashed rgba(196,149,106,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#FAE8DA', overflow: 'hidden',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}>
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Preview ảnh đại diện" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontFamily: "'Playfair Display', serif", color: '#C4956A', fontSize: '4rem', lineHeight: 1, fontWeight: 700, userSelect: 'none' }}>
                        {(displayName[0] ?? '?').toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="avatar-overlay">
                    <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '2rem', fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
                  </div>
                </div>

                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />

                <button
                  onClick={() => avatarInputRef.current?.click()}
                  style={{
                    background: 'transparent', border: '0.5px solid rgba(196,149,106,0.5)',
                    borderRadius: '8px', padding: '0.5rem 1rem',
                    color: '#7B4A00', fontSize: '0.82rem', fontWeight: 600,
                    cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif",
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    transition: 'background 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(196,149,106,0.1)'; e.currentTarget.style.borderColor = '#C4956A' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(196,149,106,0.5)' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>upload</span>
                  Tải ảnh lên
                </button>

                <p style={{ color: '#A0794E', fontSize: '0.72rem', textAlign: 'center', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                  JPG, PNG, GIF, WebP · Tối đa 5 MB
                </p>
              </div>

              {/* Cột phải: form fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Tên hiển thị — có thể chỉnh sửa */}
                <div className="profile-field">
                  <label style={labelStyle}>
                    Tên Hiển Thị <span style={{ color: '#8B1A1A' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={e => { setFormData(p => ({ ...p, displayName: e.target.value })); setErrors(p => ({ ...p, displayName: '' })) }}
                    style={inputStyle(!!errors.displayName)}
                    placeholder="Nhập tên hiển thị"
                  />
                  {errors.displayName && <p style={errorStyle}>{errors.displayName}</p>}
                </div>

                {/* Email — chỉ đọc */}
                <div className="profile-field">
                  <label style={{ ...labelStyle, display: 'flex', alignItems: 'center' }}>
                    Email {readonlyBadge}
                  </label>
                  <input
                    type="email"
                    value={user?.email ?? user?.username ?? '—'}
                    readOnly
                    style={readonlyStyle}
                  />
                </div>

                {/* Giới tính — lựa chọn dạng pill */}
                <div className="profile-field">
                  <label style={labelStyle}>Giới Tính</label>
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {[
                      { value: 'male',   label: 'Nam',  icon: 'male'   },
                      { value: 'female', label: 'Nữ',   icon: 'female' },
                      { value: 'other',  label: 'Khác', icon: 'transgender' },
                    ].map(opt => {
                      const selected = formData.gender === opt.value
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, gender: opt.value }))}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.5rem 1.1rem',
                            borderRadius: '9999px',
                            border: selected ? '1.5px solid #8B1A1A' : '0.5px solid rgba(196,149,106,0.5)',
                            background: selected ? 'rgba(139,26,26,0.08)' : '#FDF5EE',
                            color: selected ? '#8B1A1A' : '#7B4A00',
                            fontFamily: "'Be Vietnam Pro', sans-serif",
                            fontSize: '0.85rem', fontWeight: selected ? 700 : 500,
                            cursor: 'pointer',
                            transition: 'all 0.18s',
                            boxShadow: selected ? '0 0 0 3px rgba(139,26,26,0.08)' : 'none',
                          }}
                          onMouseEnter={e => { if (!selected) { e.currentTarget.style.borderColor = '#C4956A'; e.currentTarget.style.background = 'rgba(196,149,106,0.07)' } }}
                          onMouseLeave={e => { if (!selected) { e.currentTarget.style.borderColor = 'rgba(196,149,106,0.5)'; e.currentTarget.style.background = '#FDF5EE' } }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: selected ? "'FILL' 1" : "'FILL' 0" }}>
                            {opt.icon}
                          </span>
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Ngày sinh — có thể chỉnh sửa */}
                <div className="profile-field">
                  <label style={labelStyle}>Ngày Sinh</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={e => setFormData(p => ({ ...p, birthDate: e.target.value }))}
                    style={{ ...inputStyle(false), colorScheme: 'light' }}
                  />
                </div>

                {/* Số điện thoại — có thể chỉnh sửa */}
                <div className="profile-field">
                  <label style={labelStyle}>Số Điện Thoại</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => { setFormData(p => ({ ...p, phone: e.target.value })); setErrors(p => ({ ...p, phone: '' })) }}
                    style={inputStyle(!!errors.phone)}
                    placeholder="0912 345 678"
                  />
                  {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
                </div>

                {/* Giới thiệu bản thân — có thể chỉnh sửa */}
                <div className="profile-field">
                  <label style={{ ...labelStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Giới Thiệu Bản Thân</span>
                    <span style={{ color: formData.bio.length > 280 ? '#8B1A1A' : '#A0794E', fontSize: '0.7rem', fontWeight: 400 }}>
                      {formData.bio.length}/300
                    </span>
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={e => { setFormData(p => ({ ...p, bio: e.target.value })); setErrors(p => ({ ...p, bio: '' })) }}
                    style={{ ...inputStyle(!!errors.bio), minHeight: '90px', resize: 'vertical', lineHeight: 1.65 }}
                    placeholder="Vài dòng giới thiệu về bản thân bạn..."
                  />
                  {errors.bio && <p style={errorStyle}>{errors.bio}</p>}
                </div>

              </div>
            </div>

            {/* Nút hành động */}
            <div style={{
              display: 'flex', gap: '1rem', flexWrap: 'wrap',
              marginTop: '2rem', paddingTop: '1.5rem',
              borderTop: '0.5px solid rgba(196,149,106,0.3)',
            }}>
              {/* Lưu thay đổi */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  background: isSaving ? 'rgba(139,26,26,0.6)' : '#8B1A1A',
                  color: '#FDF5EE', border: 'none', borderRadius: '8px',
                  padding: '0.75rem 2rem', fontWeight: 700, fontSize: '0.88rem',
                  letterSpacing: '0.04em', cursor: isSaving ? 'not-allowed' : 'pointer',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(139,26,26,0.30)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (!isSaving) e.currentTarget.style.background = '#6B1414' }}
                onMouseLeave={e => { if (!isSaving) e.currentTarget.style.background = '#8B1A1A' }}
              >
                <span className={`material-symbols-outlined${isSaving ? ' spin-anim' : ''}`} style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>
                  {isSaving ? 'refresh' : 'save'}
                </span>
                {isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
              </button>

              {/* Đổi mật khẩu */}
              <button
                onClick={() => setShowPasswordModal(true)}
                style={{
                  background: 'transparent', border: '0.5px solid rgba(196,149,106,0.5)',
                  borderRadius: '8px', padding: '0.75rem 2rem',
                  color: '#7B4A00', fontWeight: 600, fontSize: '0.88rem',
                  letterSpacing: '0.04em', cursor: 'pointer',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(196,149,106,0.1)'; e.currentTarget.style.borderColor = '#C4956A' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(196,149,106,0.5)' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>lock</span>
                Đổi Mật Khẩu
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          3. HUY HIỆU VINH DỰ
      ════════════════════════════════════════ */}
      <section style={{ padding: '0 1.5rem 3rem', background: '#FAE8DA', borderTop: '0.5px solid #D4B896', borderBottom: '0.5px solid #D4B896' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', paddingTop: '3rem' }}>
          <h2 className="reveal" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: '#3D2B1A', marginBottom: '2rem', fontWeight: 700 }}>
            Huy Hiệu Vinh Dự
          </h2>
          <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
            {badges.map((badge, i) => (
              <div
                key={i}
                style={{
                  background: '#FDF5EE', border: '0.5px solid #D4B896', padding: '1.25rem',
                  borderRadius: '12px', boxShadow: '0 2px 8px rgba(61,43,26,0.06)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
                  cursor: 'default', transition: 'box-shadow 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(139,26,26,0.10)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(61,43,26,0.06)'; e.currentTarget.style.transform = '' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: badge.color, fontVariationSettings: `'FILL' ${badge.fill}` }}>
                  {badge.icon}
                </span>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#3D2B1A', fontWeight: 600, fontSize: '0.85rem', margin: 0, fontFamily: "'Playfair Display', serif" }}>{badge.label}</p>
                  <p style={{ color: '#A0794E', fontSize: '0.72rem', margin: '0.2rem 0 0', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{badge.rank}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem' }}>
        <div className="may-tan-divider" />
      </div>

      {/* ════════════════════════════════════════
          4. LỊCH SỬ ĐÓNG GÓP
      ════════════════════════════════════════ */}
      <section style={{ padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: '#3D2B1A', fontWeight: 700, margin: 0 }}>
              Lịch Sử Đóng Góp
            </h2>
            <span style={{ color: '#A0794E', fontSize: '0.85rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              3 giao dịch gần nhất
            </span>
          </div>
          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {contributions.map((item, i) => (
              <div
                key={i}
                style={{
                  background: '#FDF5EE', border: '0.5px solid #D4B896', borderRadius: '12px',
                  padding: '1rem 1.25rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem',
                  cursor: 'default', transition: 'all 0.25s',
                  boxShadow: '0 2px 8px rgba(61,43,26,0.05)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C4956A'; e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(61,43,26,0.10)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#D4B896'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(61,43,26,0.05)' }}
              >
                <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: '10px', background: '#FAE8DA', border: '0.5px solid #D4B896', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.3rem', color: item.iconColor, fontVariationSettings: "'FILL' 1" }}>
                    {item.icon}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: '#3D2B1A', fontWeight: 600, fontSize: '0.9rem', margin: 0, fontFamily: "'Be Vietnam Pro', sans-serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.title}
                  </p>
                  <p style={{ color: '#A0794E', fontSize: '0.75rem', margin: '0.2rem 0 0', display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '0.75rem' }}>calendar_today</span>
                    {item.date}
                  </p>
                </div>
                <div style={{ flexShrink: 0, color: '#8B1A1A', fontWeight: 700, fontSize: '0.9rem', fontFamily: "'Playfair Display', serif", whiteSpace: 'nowrap' }}>
                  {item.amount}
                </div>
                <div style={{
                  flexShrink: 0, padding: '0.25rem 0.75rem', borderRadius: '9999px',
                  border: `0.5px solid ${item.statusBorder}`,
                  background: item.statusBg, color: item.statusColor,
                  fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                }}>
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          5. HÀNH TRÌNH DI SẢN + CTA
      ════════════════════════════════════════ */}
      <section style={{ padding: '3rem 1.5rem', background: '#FAE8DA', borderTop: '0.5px solid #D4B896' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px,100%), 1fr))', gap: '1.5rem' }}>

            {/* Tiến trình hành trình */}
            <div style={{
              background: '#FDF5EE', border: '0.5px solid #D4B896', borderRadius: '12px',
              padding: '2rem', boxShadow: '0 2px 12px rgba(61,43,26,0.07)', gridColumn: 'span 2',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.75rem', color: '#C4956A', fontVariationSettings: "'FILL' 1" }}>route</span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#3D2B1A', fontWeight: 700, margin: 0 }}>
                  Hành Trình Di Sản
                </h3>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#A0794E', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Tiến độ hoàn thành</span>
                  <span style={{ color: '#8B1A1A', fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>72%</span>
                </div>
                <div style={{ width: '100%', height: 10, background: 'rgba(61,43,26,0.08)', borderRadius: 9999, overflow: 'hidden' }}>
                  <div className="profile-progress-fill" style={{ width: '72%' }} />
                </div>
                <p style={{ color: '#A0794E', fontSize: '0.78rem', marginTop: '0.5rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                  Đã đạt <span style={{ color: '#8B1A1A', fontWeight: 600 }}>72%</span> cột mốc — chỉ còn một chặng nữa để hoàn tất hành trình vinh danh di sản.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {['Khởi Nguồn', 'Khai Sáng', 'Thịnh Vượng', 'Anh Hùng'].map((m, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: idx < 3 ? '#C4956A' : 'transparent',
                      border: idx < 3 ? '1.5px solid #C4956A' : '1.5px solid rgba(196,149,106,0.35)',
                    }} />
                    <span style={{ fontSize: '0.78rem', color: idx < 3 ? '#7B4A00' : '#A0794E', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: idx < 3 ? 500 : 400 }}>{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{
              background: '#FDF5EE', border: '0.5px solid rgba(196,149,106,0.35)', borderRadius: '12px',
              padding: '2rem', boxShadow: '0 2px 12px rgba(61,43,26,0.07)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', textAlign: 'center',
            }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(196,149,106,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: '#C4956A', fontVariationSettings: "'FILL' 1" }}>military_tech</span>
              </div>
              <div>
                <p style={{ color: '#3D2B1A', fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>Lời Kêu Gọi</p>
                <p style={{ color: '#A0794E', fontSize: '0.85rem', marginTop: '0.3rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Tái thiết Điện Cần Chánh</p>
              </div>
              <Link
                to="/quyen-gop"
                style={{
                  marginTop: '0.25rem', padding: '0.6rem 1.5rem', borderRadius: '9999px',
                  border: '1px solid rgba(196,149,106,0.45)', color: '#7B4A00',
                  fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none',
                  fontFamily: "'Be Vietnam Pro', sans-serif", transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(196,149,106,0.1)'; e.currentTarget.style.borderColor = '#C4956A' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(196,149,106,0.45)' }}
              >
                Tham Gia Ngay
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#FAE8DA', borderTop: '1px solid rgba(196,149,106,0.35)', padding: '3rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', color: '#8B1A1A', fontWeight: 700, letterSpacing: '0.05em' }}>SỬ VIỆT ANH HÙNG</span>
            <div style={{ color: '#A0794E', fontSize: '0.75rem', marginTop: '0.25rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Gìn giữ hồn thiêng sông núi</div>
          </div>
          <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
            {['Trang Chủ', 'Chiến Dịch', 'Vinh Danh', 'Liên Hệ'].map(l => (
              <Link key={l} to="/"
                style={{ color: '#5C3A1E', fontSize: '0.85rem', textDecoration: 'none', fontFamily: "'Be Vietnam Pro', sans-serif", transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#8B1A1A'}
                onMouseLeave={e => e.currentTarget.style.color = '#5C3A1E'}
              >
                {l}
              </Link>
            ))}
          </nav>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['facebook', 'smart_display', 'language'].map(icon => (
              <a key={icon} href="#" className="social-icon" aria-label={icon}>
                <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: '#8B1A1A', fontVariationSettings: "'FILL' 1" }}>{icon}</span>
              </a>
            ))}
          </div>
        </div>
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(196,149,106,0.45), transparent)', marginBottom: '1.5rem' }} />
        <p style={{ textAlign: 'center', color: '#A0794E', fontSize: '0.78rem', fontFamily: "'Be Vietnam Pro', sans-serif", margin: 0 }}>
          © 2025 Sử Việt Anh Hùng. Bảo lưu mọi quyền.
        </p>
      </footer>

      {/* ════════════════════════════════════════
          MODAL: ĐỔI MẬT KHẨU
      ════════════════════════════════════════ */}
      {showPasswordModal && (
        <div
          className="password-modal-backdrop"
          onClick={e => { if (e.target === e.currentTarget) closePasswordModal() }}
        >
          <div className="password-modal-card">

            {/* Header modal */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="material-symbols-outlined" style={{ color: '#C4956A', fontSize: '1.5rem', fontVariationSettings: "'FILL' 1" }}>lock</span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#3D2B1A', fontWeight: 700, margin: 0 }}>
                  Đổi Mật Khẩu
                </h3>
              </div>
              <button
                onClick={closePasswordModal}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A0794E', display: 'flex', alignItems: 'center', padding: '0.25rem', borderRadius: '6px', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(61,43,26,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>close</span>
              </button>
            </div>

            {/* Trạng thái thành công */}
            {passwordSuccess ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#2A7A2A', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <p style={{ color: '#2A7A2A', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600, marginTop: '0.75rem', fontSize: '0.95rem' }}>
                  Đổi mật khẩu thành công!
                </p>
                <p style={{ color: '#A0794E', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.82rem', marginTop: '0.35rem' }}>
                  Cửa sổ sẽ tự đóng sau vài giây...
                </p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                  {/* Mật khẩu cũ */}
                  <div className="profile-field">
                    <label style={labelStyle}>
                      Mật Khẩu Cũ <span style={{ color: '#8B1A1A' }}>*</span>
                    </label>
                    <div className="pwd-input-wrap">
                      <input
                        type={showOld ? 'text' : 'password'}
                        value={passwordData.old}
                        onChange={e => { setPasswordData(p => ({ ...p, old: e.target.value })); setPasswordErrors(p => ({ ...p, old: '' })) }}
                        style={{ ...inputStyle(!!passwordErrors.old), paddingRight: '2.5rem' }}
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                      <button className="pwd-toggle" type="button" onClick={() => setShowOld(p => !p)}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>
                          {showOld ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                    {passwordErrors.old && <p style={errorStyle}>{passwordErrors.old}</p>}
                  </div>

                  {/* Mật khẩu mới */}
                  <div className="profile-field">
                    <label style={labelStyle}>
                      Mật Khẩu Mới <span style={{ color: '#8B1A1A' }}>*</span>
                    </label>
                    <div className="pwd-input-wrap">
                      <input
                        type={showNew ? 'text' : 'password'}
                        value={passwordData.next}
                        onChange={e => { setPasswordData(p => ({ ...p, next: e.target.value })); setPasswordErrors(p => ({ ...p, next: '' })) }}
                        style={{ ...inputStyle(!!passwordErrors.next), paddingRight: '2.5rem' }}
                        placeholder="Tối thiểu 6 ký tự"
                      />
                      <button className="pwd-toggle" type="button" onClick={() => setShowNew(p => !p)}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>
                          {showNew ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                    {passwordErrors.next && <p style={errorStyle}>{passwordErrors.next}</p>}
                  </div>

                  {/* Xác nhận mật khẩu mới */}
                  <div className="profile-field">
                    <label style={labelStyle}>
                      Xác Nhận Mật Khẩu Mới <span style={{ color: '#8B1A1A' }}>*</span>
                    </label>
                    <div className="pwd-input-wrap">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={passwordData.confirm}
                        onChange={e => { setPasswordData(p => ({ ...p, confirm: e.target.value })); setPasswordErrors(p => ({ ...p, confirm: '' })) }}
                        style={{ ...inputStyle(!!passwordErrors.confirm), paddingRight: '2.5rem' }}
                        placeholder="Nhập lại mật khẩu mới"
                      />
                      <button className="pwd-toggle" type="button" onClick={() => setShowConfirm(p => !p)}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>
                          {showConfirm ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                    {passwordErrors.confirm && <p style={errorStyle}>{passwordErrors.confirm}</p>}
                  </div>

                </div>

                {/* Nút modal */}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
                  <button
                    onClick={handleChangePassword}
                    disabled={isSavingPwd}
                    style={{
                      flex: 1, background: isSavingPwd ? 'rgba(139,26,26,0.6)' : '#8B1A1A',
                      color: '#FDF5EE', border: 'none', borderRadius: '8px',
                      padding: '0.8rem', fontWeight: 700, fontSize: '0.88rem',
                      cursor: isSavingPwd ? 'not-allowed' : 'pointer',
                      fontFamily: "'Be Vietnam Pro', sans-serif",
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => { if (!isSavingPwd) e.currentTarget.style.background = '#6B1414' }}
                    onMouseLeave={e => { if (!isSavingPwd) e.currentTarget.style.background = '#8B1A1A' }}
                  >
                    <span className={`material-symbols-outlined${isSavingPwd ? ' spin-anim' : ''}`} style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>
                      {isSavingPwd ? 'refresh' : 'check'}
                    </span>
                    {isSavingPwd ? 'Đang xử lý...' : 'Xác Nhận'}
                  </button>

                  <button
                    onClick={closePasswordModal}
                    style={{
                      flex: 1, background: 'transparent', border: '0.5px solid #D4B896',
                      borderRadius: '8px', padding: '0.8rem',
                      color: '#5C3A1E', fontWeight: 600, fontSize: '0.88rem',
                      cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif",
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(61,43,26,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    Huỷ
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* ── Toast thông báo lưu thành công ── */}
      {saveSuccess && (
        <div className="save-success-toast">
          <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          Lưu thay đổi thành công!
        </div>
      )}

    </div>
  )
}
