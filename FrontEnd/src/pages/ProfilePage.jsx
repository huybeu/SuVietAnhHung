import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { user, isInitializing } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isInitializing && !user) navigate('/dang-nhap')
  }, [user, isInitializing, navigate])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('revealed')),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

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

  if (isInitializing) return null

  return (
    <div style={{ minHeight: '100vh', background: '#FDF5EE', color: '#3D2B1A' }}>

      {/* ── Profile Header ── */}
      <section style={{ paddingTop: '7rem', paddingBottom: '4rem', padding: '7rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px,100%), 1fr))', gap: '2.5rem', alignItems: 'center' }}>

            {/* Avatar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  width: 'clamp(140px, 15vw, 200px)', height: 'clamp(140px, 15vw, 200px)',
                  borderRadius: '50%', border: '2px solid rgba(196,149,106,0.45)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#FAE8DA', boxShadow: '0 2px 16px rgba(196,149,106,0.15)',
                }}>
                  {user && (
                    <span style={{
                      fontFamily: "'Playfair Display', serif", color: '#C4956A',
                      fontSize: 'clamp(3.5rem, 9vw, 5rem)', lineHeight: 1, fontWeight: 700, userSelect: 'none',
                    }}>
                      {user.name[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '0.5px solid rgba(196,149,106,0.18)', transform: 'scale(1.1)', pointerEvents: 'none' }} />
              </div>
            </div>

            {/* Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#C4956A', fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 700, margin: 0 }}>
                {user?.name ?? '—'}
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

              <blockquote style={{
                fontFamily: "'Merriweather', serif", fontStyle: 'italic', fontWeight: 300,
                color: '#5C3A1E', fontSize: '0.9rem', lineHeight: 1.85,
                borderLeft: '2px solid rgba(196,149,106,0.45)', paddingLeft: '1rem',
                margin: '0.25rem 0', maxWidth: '56ch',
              }}>
                "Đam mê phục dựng lịch sử qua mô hình 3D — mỗi chi tiết kiến trúc là một mảnh ký ức dân tộc được hồi sinh."
              </blockquote>

              {/* Stats row */}
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

      {/* ── Badges ── */}
      <section style={{ padding: '3rem 1.5rem', background: '#FAE8DA', borderTop: '0.5px solid #D4B896', borderBottom: '0.5px solid #D4B896' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 className="reveal" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: '#3D2B1A', marginBottom: '2rem', fontWeight: 700 }}>Huy Hiệu Vinh Dự</h2>
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
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 6px 20px rgba(139,26,26,0.10)'; e.currentTarget.style.transform='translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='0 2px 8px rgba(61,43,26,0.06)'; e.currentTarget.style.transform='' }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '2.5rem', color: badge.color, fontVariationSettings: `'FILL' ${badge.fill}` }}
                >
                  {badge.icon}
                </span>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#3D2B1A', fontWeight: 600, fontSize: '0.85rem', margin: 0, fontFamily: "'Playfair Display', serif" }}>{badge.label}</p>
                  <p style={{ color: '#A0794E', fontSize: '0.72rem', marginTop: '0.2rem', margin: '0.2rem 0 0', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{badge.rank}</p>
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

      {/* ── Contribution History ── */}
      <section style={{ padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: '#3D2B1A', fontWeight: 700, margin: 0 }}>Lịch Sử Đóng Góp</h2>
            <span style={{ color: '#A0794E', fontSize: '0.85rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>3 giao dịch gần nhất</span>
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
                onMouseEnter={e => { e.currentTarget.style.borderColor='#C4956A'; e.currentTarget.style.transform='translateX(4px)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(61,43,26,0.10)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='#D4B896'; e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 2px 8px rgba(61,43,26,0.05)' }}
              >
                <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: '10px', background: '#FAE8DA', border: '0.5px solid #D4B896', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.3rem', color: item.iconColor, fontVariationSettings: "'FILL' 1" }}>
                    {item.icon}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: '#3D2B1A', fontWeight: 600, fontSize: '0.9rem', margin: 0, fontFamily: "'Be Vietnam Pro', sans-serif' ", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
                  <p style={{ color: '#A0794E', fontSize: '0.75rem', margin: '0.2rem 0 0', display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '0.75rem' }}>calendar_today</span>
                    {item.date}
                  </p>
                </div>
                <div style={{ flexShrink: 0, color: '#8B1A1A', fontWeight: 700, fontSize: '0.9rem', fontFamily: "'Playfair Display', serif", whiteSpace: 'nowrap' }}>
                  {item.amount}
                </div>
                <div style={{ flexShrink: 0, padding: '0.25rem 0.75rem', borderRadius: '9999px', border: `0.5px solid ${item.statusBorder}`, background: item.statusBg, color: item.statusColor, fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Heritage journey + CTA ── */}
      <section style={{ padding: '3rem 1.5rem', background: '#FAE8DA', borderTop: '0.5px solid #D4B896' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px,100%), 1fr))', gap: '1.5rem' }}>

            {/* Journey progress */}
            <div style={{ background: '#FDF5EE', border: '0.5px solid #D4B896', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 12px rgba(61,43,26,0.07)', gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.75rem', color: '#C4956A', fontVariationSettings: "'FILL' 1" }}>route</span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#3D2B1A', fontWeight: 700, margin: 0 }}>Hành Trình Di Sản</h3>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#A0794E', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Tiến độ hoàn thành</span>
                  <span style={{ color: '#8B1A1A', fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>72%</span>
                </div>
                <div style={{ width: '100%', height: 10, background: 'rgba(61,43,26,0.08)', borderRadius: 9999, overflow: 'hidden' }}>
                  <div className="progress-fill" style={{ width: '72%' }} />
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

            {/* CTA card */}
            <div style={{ background: '#FDF5EE', border: '0.5px solid rgba(196,149,106,0.35)', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 12px rgba(61,43,26,0.07)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(196,149,106,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: '#C4956A', fontVariationSettings: "'FILL' 1" }}>military_tech</span>
              </div>
              <div>
                <p style={{ color: '#3D2B1A', fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>Lời Kêu Gọi</p>
                <p style={{ color: '#A0794E', fontSize: '0.85rem', marginTop: '0.3rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Tái thiết Điện Cần Chánh</p>
              </div>
              <Link to="/quyen-gop" style={{
                marginTop: '0.25rem', padding: '0.6rem 1.5rem', borderRadius: '9999px',
                border: '1px solid rgba(196,149,106,0.45)', color: '#7B4A00',
                fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none',
                fontFamily: "'Be Vietnam Pro', sans-serif", transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(196,149,106,0.1)'; e.currentTarget.style.borderColor='#C4956A' }}
                onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(196,149,106,0.45)' }}
              >
                Tham Gia Ngay
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#FAE8DA', borderTop: '1px solid rgba(196,149,106,0.35)', padding: '3rem 1.5rem 2rem', marginTop: '2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', color: '#8B1A1A', fontWeight: 700, letterSpacing: '0.05em' }}>SỬ VIỆT ANH HÙNG</span>
            <div style={{ color: '#A0794E', fontSize: '0.75rem', marginTop: '0.25rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Gìn giữ hồn thiêng sông núi</div>
          </div>
          <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
            {['Trang Chủ', 'Chiến Dịch', 'Vinh Danh', 'Liên Hệ'].map(l => (
              <Link key={l} to="/" style={{ color: '#5C3A1E', fontSize: '0.85rem', textDecoration: 'none', fontFamily: "'Be Vietnam Pro', sans-serif", transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color='#8B1A1A'}
                onMouseLeave={e => e.currentTarget.style.color='#5C3A1E'}
              >{l}</Link>
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
        <p style={{ textAlign: 'center', color: '#A0794E', fontSize: '0.78rem', fontFamily: "'Be Vietnam Pro', sans-serif", margin: 0 }}>© 2025 Sử Việt Anh Hùng. Bảo lưu mọi quyền.</p>
      </footer>
    </div>
  )
}
