import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { user, isInitializing } = useAuth()
  const navigate = useNavigate()

  // FE-024: redirect /dang-nhap nếu không có session
  useEffect(() => {
    if (!isInitializing && !user) navigate('/dang-nhap')
  }, [user, isInitializing, navigate])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('active')),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const badges = [
    { icon: 'auto_awesome', fill: 1, colorClass: 'text-yellow-400', label: 'Hào Khí',  rank: 'Sơ Cấp'   },
    { icon: 'favorite',     fill: 1, colorClass: 'text-red-400',    label: 'Tâm Huyết', rank: 'Cao Cấp'  },
    { icon: 'history_edu',  fill: 0, colorClass: 'text-violet-400', label: 'Sử Gia',    rank: 'Bậc Thầy' },
    { icon: 'shield',       fill: 1, colorClass: 'text-yellow-400', label: 'Hộ Quốc',   rank: 'Kiên Định' },
  ]

  const contributions = [
    {
      icon: 'castle', iconColor: 'text-primary-container',
      title: 'Phục dựng 3D Hoàng Thành Thăng Long',
      date: '15 Tháng 05, 2024', amount: '+5.000.000 VND',
      status: 'Hoàn tất', statusColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    },
    {
      icon: 'menu_book', iconColor: 'text-secondary',
      title: 'Đại Việt Sử Ký Toàn Thư - Bản Giới Hạn',
      date: '02 Tháng 04, 2024', amount: '+2.500.000 VND',
      status: 'Đã nhận hàng', statusColor: 'text-sky-400 bg-sky-400/10 border-sky-400/30',
    },
    {
      icon: 'theater_comedy', iconColor: 'text-violet-400',
      title: 'Quỹ Duy trì Nghệ thuật Hát Bội Nam Bộ',
      date: '20 Tháng 02, 2024', amount: '+10.000.000 VND',
      status: 'Vinh danh Đồng', statusColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    },
  ]

  if (isInitializing) return null

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">

      {/* ─── Profile Header ─── */}
      <section className="pt-32 pb-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-12 gap-8 items-center reveal">

            {/* Avatar */}
            <div className="col-span-12 md:col-span-4 flex flex-col items-center">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-40 h-40 md:w-56 md:h-56 rounded-full border-2 border-secondary/50 flex items-center justify-center bg-surface-container gold-glow">
                  {user && (
                    <span
                      className="font-headline text-secondary select-none font-bold"
                      style={{ fontSize: 'clamp(3.5rem, 9vw, 5rem)', lineHeight: 1 }}
                    >
                      {user.name[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 rounded-full border border-secondary/15 scale-110 pointer-events-none" />
              </div>
            </div>

            {/* Info */}
            <div className="col-span-12 md:col-span-8 flex flex-col gap-4">
              <h1 className="text-display-lg-mobile md:text-display-lg text-secondary font-headline">
                {user?.name ?? '—'}
              </h1>

              <div className="inline-flex items-center self-start gap-2 px-4 py-1.5 bg-secondary/10 text-secondary border border-secondary/30 rounded-full text-sm font-semibold tracking-wide">
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {user?.isAdmin ? 'admin_panel_settings' : 'workspace_premium'}
                </span>
                {user?.isAdmin ? 'Quản Trị Viên' : 'Người Gìn Giữ Sử Việt'}
              </div>

              <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                <span className="material-symbols-outlined text-secondary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <span>Thành viên cấp 8</span>
              </div>

              <p className="italic text-on-surface-variant text-sm leading-relaxed border-l-2 border-secondary/40 pl-3 max-w-xl">
                "Đam mê phục dựng lịch sử qua mô hình 3D — mỗi chi tiết kiến trúc là một mảnh ký ức dân tộc được hồi sinh."
              </p>

              <div className="flex flex-wrap items-stretch mt-2 divide-x divide-secondary/20">
                <div className="flex flex-col items-center px-5 py-2 first:pl-0">
                  <span className="text-secondary font-bold text-lg font-headline">24.500.000 VND</span>
                  <span className="text-on-surface-variant text-xs mt-1">Tổng Đóng Góp</span>
                </div>
                <div className="flex flex-col items-center px-5 py-2">
                  <span className="text-secondary font-bold text-lg font-headline">12</span>
                  <span className="text-on-surface-variant text-xs mt-1">Chiến Dịch</span>
                </div>
                <div className="flex flex-col items-center px-5 py-2">
                  <span className="text-secondary font-bold text-lg font-headline">8.420</span>
                  <span className="text-on-surface-variant text-xs mt-1">Điểm Uy Danh</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Badges ─── */}
      <section className="py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-headline text-2xl text-secondary mb-8 reveal">Huy Hiệu Vinh Dự</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 reveal">
            {badges.map((badge, i) => (
              <div
                key={i}
                className="bg-surface-container-low border border-secondary/20 p-5 rounded-lg group hover:border-secondary/50 hover:bg-surface-container transition-all duration-300 flex flex-col items-center gap-3 cursor-default"
              >
                <span
                  className={`material-symbols-outlined text-4xl ${badge.colorClass} group-hover:scale-110 transition-transform duration-300`}
                  style={{ fontVariationSettings: `'FILL' ${badge.fill}` }}
                >
                  {badge.icon}
                </span>
                <div className="text-center">
                  <p className="text-on-surface font-semibold text-sm">{badge.label}</p>
                  <p className="text-on-surface-variant text-xs mt-0.5">{badge.rank}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="may-tan-divider" />
      </div>

      {/* ─── Contribution History ─── */}
      <section className="py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8 reveal">
            <h2 className="font-headline text-2xl text-secondary">Lịch Sử Đóng Góp</h2>
            <span className="text-on-surface-variant text-sm">3 giao dịch gần nhất</span>
          </div>
          <div className="flex flex-col gap-3 reveal">
            {contributions.map((item, i) => (
              <div
                key={i}
                className="bg-surface-container-low border border-secondary/15 rounded-lg p-4 md:p-5 flex flex-wrap md:flex-nowrap items-center gap-4 cursor-default transition-all duration-[250ms] hover:border-secondary/35 hover:translate-x-1.5 hover:shadow-[0_0_16px_2px_rgba(246,190,59,0.07)]"
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-surface-container flex items-center justify-center border border-secondary/15">
                  <span className={`material-symbols-outlined text-xl ${item.iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    {item.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-on-surface font-semibold text-sm md:text-base truncate">{item.title}</p>
                  <p className="text-on-surface-variant text-xs mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">calendar_today</span>
                    {item.date}
                  </p>
                </div>
                <div className="flex-shrink-0 text-secondary font-bold text-sm md:text-base whitespace-nowrap font-headline">
                  {item.amount}
                </div>
                <div className={`flex-shrink-0 px-3 py-1 rounded-full border text-xs font-semibold whitespace-nowrap ${item.statusColor}`}>
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Bento Grid ─── */}
      <section className="py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal">
            <div className="md:col-span-2 bg-surface-container-low border border-secondary/25 rounded-xl p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>route</span>
                <h3 className="font-headline text-xl text-secondary">Hành Trình Di Sản</h3>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-on-surface-variant">Tiến độ hoàn thành</span>
                  <span className="text-secondary font-bold font-headline">72%</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full rounded-full crimson-to-gold transition-all duration-700" style={{ width: '72%' }} />
                </div>
                <p className="text-on-surface-variant text-xs mt-1">
                  Đã đạt <span className="text-secondary font-semibold">72%</span> cột mốc — chỉ còn một chặng nữa để hoàn tất hành trình vinh danh di sản.
                </p>
              </div>
              <div className="flex gap-5 flex-wrap">
                {['Khởi Nguồn', 'Khai Sáng', 'Thịnh Vượng', 'Anh Hùng'].map((m, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full border ${idx < 3 ? 'bg-secondary border-secondary' : 'bg-transparent border-secondary/30'}`} />
                    <span className={`text-xs ${idx < 3 ? 'text-secondary' : 'text-on-surface-variant'}`}>{m}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-1 bg-surface-container border border-primary-container/30 rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-primary-container/15 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
              </div>
              <div>
                <p className="text-on-surface font-headline text-lg font-semibold">Lời Kêu Gọi</p>
                <p className="text-on-surface-variant text-sm mt-1">Tái thiết Điện Cần Chánh</p>
              </div>
              <button className="mt-1 px-5 py-2 rounded-full border border-secondary/40 text-secondary text-sm font-semibold hover:bg-secondary/10 hover:border-secondary/60 transition-all duration-200">
                Tham Gia Ngay
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-surface-container-lowest border-t border-secondary/15 mt-8 py-10 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex flex-col gap-1">
            <span className="font-headline text-lg text-secondary tracking-widest">SỬ VIỆT ANH HÙNG</span>
            <span className="text-on-surface-variant text-xs">Gìn giữ hồn thiêng sông núi</span>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm text-on-surface-variant">
            {['Trang Chủ', 'Chiến Dịch', 'Vinh Danh', 'Liên Hệ'].map(link => (
              <a key={link} href="#" className="hover:text-secondary transition-colors duration-200">{link}</a>
            ))}
          </nav>
          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="flex gap-3">
              {['facebook', 'youtube', 'language'].map(icon => (
                <a key={icon} href="#" className="w-9 h-9 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-secondary hover:border-secondary/40 transition-all duration-200" aria-label={icon}>
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                </a>
              ))}
            </div>
            <p className="text-on-surface-variant text-xs">© 2024 Sử Việt Anh Hùng. Bảo lưu mọi quyền.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
