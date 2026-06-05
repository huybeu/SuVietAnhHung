import { useEffect } from 'react'
import Navbar from '../components/Navbar'

export default function ProfilePage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('active')),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const badges = [
    { icon: 'auto_awesome', fill: 1, colorClass: 'text-secondary', label: 'Hào Khí', rank: 'Sơ Cấp' },
    { icon: 'favorite', fill: 1, colorClass: 'text-primary', label: 'Tâm Huyết', rank: 'Cao Cấp' },
    { icon: 'history_edu', fill: 0, colorClass: 'text-tertiary', label: 'Sử Gia', rank: 'Bậc Thầy' },
    { icon: 'shield', fill: 1, colorClass: 'text-secondary', label: 'Hộ Quốc', rank: 'Kiên Định' },
  ]

  const contributions = [
    {
      icon: 'castle',
      iconColor: 'text-primary',
      title: 'Phục dựng 3D Hoàng Thành Thăng Long',
      date: '15 Tháng 05, 2024',
      amount: '+5.000.000 VND',
      status: 'Hoàn tất',
      statusColor: 'text-secondary bg-secondary/10 border-secondary/30',
    },
    {
      icon: 'menu_book',
      iconColor: 'text-secondary',
      title: 'Đại Việt Sử Ký Toàn Thư - Bản Giới Hạn',
      date: '02 Tháng 04, 2024',
      amount: '+2.500.000 VND',
      status: 'Đã nhận hàng',
      statusColor: 'text-tertiary bg-tertiary/10 border-tertiary/30',
    },
    {
      icon: 'theater_comedy',
      iconColor: 'text-tertiary',
      title: 'Quỹ Duy trì Nghệ thuật Hát Bội Nam Bộ',
      date: '20 Tháng 02, 2024',
      amount: '+10.000.000 VND',
      status: 'Vinh danh Đồng',
      statusColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    },
  ]

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      <style>{`
        @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

        .gold-glow {
          box-shadow: 0 0 24px 4px rgba(212, 175, 55, 0.35), 0 0 8px 2px rgba(212, 175, 55, 0.18);
        }
        .crimson-to-gold {
          background: linear-gradient(90deg, #b91c1c 0%, #d4af37 100%);
        }
        .lacquer-texture {
          background-image: repeating-linear-gradient(
            135deg,
            transparent,
            transparent 2px,
            rgba(212,175,55,0.03) 2px,
            rgba(212,175,55,0.03) 4px
          );
        }
        .may-tan-divider {
          position: relative;
          height: 2px;
          margin: 3rem 0;
          background: linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.5) 20%, rgba(185,28,28,0.7) 50%, rgba(212,175,55,0.5) 80%, transparent 100%);
        }
        .may-tan-divider::before,
        .may-tan-divider::after {
          content: '✦';
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          color: #d4af37;
          font-size: 0.75rem;
        }
        .may-tan-divider::before { left: calc(50% - 1.5rem); }
        .may-tan-divider::after { left: calc(50% + 0.75rem); }

        .reveal {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }

        :root {
          --color-primary: #b91c1c;
          --color-secondary: #d4af37;
          --color-tertiary: #7c3aed;
          --color-surface: #0a0a0f;
          --color-surface-dim: #06060a;
          --color-surface-container: #111118;
          --color-surface-container-low: #0d0d14;
          --color-on-surface: #e8e0d0;
          --color-on-surface-variant: #a09880;
          --color-outline: #3a3528;
          --color-primary-container: #7f1d1d;
          --color-secondary-container: #5c4a0a;
          --color-tertiary-container: #3b0764;
        }

        .text-primary { color: #ef4444; }
        .text-secondary { color: #d4af37; }
        .text-tertiary { color: #a78bfa; }
        .text-on-surface { color: #e8e0d0; }
        .text-on-surface-variant { color: #a09880; }
        .bg-surface { background-color: #0a0a0f; }
        .bg-surface-dim { background-color: #06060a; }
        .bg-surface-container { background-color: #111118; }
        .bg-surface-container-low { background-color: #0d0d14; }
        .bg-primary-container { background-color: #7f1d1d; }
        .bg-secondary-container\\/20 { background-color: rgba(92,74,10,0.2); }
        .border-secondary { border-color: #d4af37; }
        .border-secondary\\/20 { border-color: rgba(212,175,55,0.2); }
        .border-secondary\\/30 { border-color: rgba(212,175,55,0.3); }
        .border-secondary\\/40 { border-color: rgba(212,175,55,0.4); }
        .border-primary { border-color: #ef4444; }
        .border-outline { border-color: #3a3528; }

        .text-display-lg { font-size: 3rem; font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; }
        .text-display-lg-mobile { font-size: 2rem; font-weight: 700; line-height: 1.2; letter-spacing: -0.01em; }

        .font-display { font-family: 'Cinzel', 'Times New Roman', serif; }
        .font-body { font-family: 'Lora', Georgia, serif; }

        .contribution-row {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <Navbar activePage="vinh-danh" />

      {/* ─── Section 1: Profile Header ─── */}
      <section className="pt-32 pb-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-12 gap-8 items-center reveal">

            {/* Avatar – col-span-4 */}
            <div className="col-span-12 md:col-span-4 flex flex-col items-center">
              <div className="relative inline-flex items-center justify-center">
                {/* Spinning ring */}
                <div
                  className="absolute inset-0 border border-secondary/20 rounded-full"
                  style={{ animation: 'spin 20s linear infinite', width: '110%', height: '110%', top: '-5%', left: '-5%' }}
                />
                {/* Avatar frame */}
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-secondary p-1 gold-glow overflow-hidden">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW2vG1P8u_xfZ2DWmm2QZbz4UBv14oaYFZ7KipGx6ISdt4xI7XKzqSEwkd5kG4O3h7-r6D2sKFAJjw7bAO70pyLGzcge-Vga-bw4gYexWPoTLONem-aM9r8zzjuczrK5S4_5DsN5zFZVqvOrDGaVy0N05Fvia-hWODCn0ucz4p2PgT5Y6B-8Wqm3WSCTR2j0_uq-OSnK5o8RbC-IHCiE0ZOvxvEvHEuqCdh18lytCo2Cf9USFb2azAHBEIySsVk7czQXzsZ1dM2d0"
                    alt="Nguyễn Thành Nam"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Info – col-span-8 */}
            <div className="col-span-12 md:col-span-8 flex flex-col gap-4">
              {/* Name */}
              <h1 className="text-display-lg-mobile md:text-display-lg text-secondary font-display">
                Nguyễn Thành Nam
              </h1>

              {/* Badge */}
              <div className="inline-flex items-center self-start gap-2 px-4 py-1.5 bg-secondary-container/20 text-secondary border border-secondary/40 rounded-full text-sm font-semibold tracking-wide">
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  workspace_premium
                </span>
                Người Gìn Giữ Sử Việt
              </div>

              {/* Verified + level */}
              <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                <span className="material-symbols-outlined text-secondary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <span>Thành viên cấp 8</span>
              </div>

              {/* Quote */}
              <p className="italic text-on-surface-variant text-sm leading-relaxed border-l-2 border-secondary/40 pl-3">
                "Đam mê phục dựng lịch sử qua mô hình 3D — mỗi chi tiết kiến trúc là một mảnh ký ức dân tộc được hồi sinh."
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-0 mt-2">
                <div className="flex flex-col items-center px-6 py-2 first:pl-0">
                  <span className="text-secondary font-bold text-xl">24.500.000 VND</span>
                  <span className="text-on-surface-variant text-xs mt-1 text-center">Tổng Đóng Góp</span>
                </div>
                <div className="w-px h-10 bg-secondary/20" />
                <div className="flex flex-col items-center px-6 py-2">
                  <span className="text-secondary font-bold text-xl">12</span>
                  <span className="text-on-surface-variant text-xs mt-1 text-center">Chiến Dịch Đã Tham Gia</span>
                </div>
                <div className="w-px h-10 bg-secondary/20" />
                <div className="flex flex-col items-center px-6 py-2">
                  <span className="text-secondary font-bold text-xl">8,420</span>
                  <span className="text-on-surface-variant text-xs mt-1 text-center">Điểm Uy Danh</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 2: Badges ─── */}
      <section className="py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-2xl text-secondary mb-8 reveal">
            Huy Hiệu Vinh Dự
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 reveal">
            {badges.map((badge, i) => (
              <div
                key={i}
                className="bg-surface-container-low border border-secondary/30 p-6 rounded-lg lacquer-texture group hover:border-secondary transition-all duration-300 flex flex-col items-center gap-3 cursor-default"
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

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="may-tan-divider" />
      </div>

      {/* ─── Section 3: Contribution History ─── */}
      <section className="py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-2xl text-secondary mb-8 reveal">
            Lịch Sử Đóng Góp
          </h2>
          <div className="flex flex-col gap-4 reveal">
            {contributions.map((item, i) => (
              <div
                key={i}
                className="contribution-row bg-surface-container-low border border-secondary/20 rounded-lg p-5 flex flex-wrap md:flex-nowrap items-center gap-4 cursor-default"
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateX(6px)'
                  e.currentTarget.style.boxShadow = '0 0 16px 2px rgba(212,175,55,0.1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateX(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center border border-secondary/20">
                  <span
                    className={`material-symbols-outlined text-2xl ${item.iconColor}`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {item.icon}
                  </span>
                </div>

                {/* Title + date */}
                <div className="flex-1 min-w-0">
                  <p className="text-on-surface font-semibold text-sm md:text-base truncate">{item.title}</p>
                  <p className="text-on-surface-variant text-xs mt-0.5">{item.date}</p>
                </div>

                {/* Amount */}
                <div className="flex-shrink-0 text-secondary font-bold text-sm md:text-base whitespace-nowrap">
                  {item.amount}
                </div>

                {/* Status */}
                <div className={`flex-shrink-0 px-3 py-1 rounded-full border text-xs font-semibold whitespace-nowrap ${item.statusColor}`}>
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section 4: Bento Grid ─── */}
      <section className="py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-6 reveal">

            {/* Wide card – col-span-2 */}
            <div className="col-span-3 md:col-span-2 bg-surface-container-low border border-secondary/30 rounded-xl p-8 lacquer-texture flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span
                  className="material-symbols-outlined text-3xl text-secondary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  route
                </span>
                <h3 className="font-display text-xl text-secondary">Hành Trình Di Sản</h3>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-on-surface-variant">Tiến độ hoàn thành</span>
                  <span className="text-secondary font-bold">72%</span>
                </div>
                <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full crimson-to-gold"
                    style={{ width: '72%' }}
                  />
                </div>
                <p className="text-on-surface-variant text-xs mt-1">
                  Đã đạt <span className="text-secondary font-semibold">72%</span> cột mốc — chỉ còn một chặng nữa để hoàn tất hành trình vinh danh di sản.
                </p>
              </div>

              {/* Mini milestones */}
              <div className="flex gap-4 flex-wrap">
                {['Khởi Nguồn', 'Khai Sáng', 'Thịnh Vượng', 'Anh Hùng'].map((m, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full border ${idx < 3 ? 'bg-secondary border-secondary' : 'bg-transparent border-secondary/40'}`} />
                    <span className={`text-xs ${idx < 3 ? 'text-secondary' : 'text-on-surface-variant'}`}>{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Narrow card */}
            <div className="col-span-3 md:col-span-1 bg-primary-container border border-primary/30 rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-center">
              <span
                className="material-symbols-outlined text-5xl text-secondary gold-glow rounded-full"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                military_tech
              </span>
              <div>
                <p className="text-on-surface font-display text-lg font-semibold">Lời Kêu Gọi</p>
                <p className="text-on-surface-variant text-sm mt-1">Tái thiết Điện Cần Chánh</p>
              </div>
              <button className="mt-2 px-5 py-2 rounded-full border border-secondary/40 text-secondary text-sm font-semibold hover:bg-secondary/10 transition-colors duration-200">
                Tham Gia Ngay
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-surface-dim border-t-2 border-secondary/20 mt-8 py-10 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

          {/* Brand */}
          <div className="flex flex-col gap-1">
            <span className="font-display text-xl text-secondary tracking-widest">SỬ VIỆT ANH HÙNG</span>
            <span className="text-on-surface-variant text-xs">Gìn giữ hồn thiêng sông núi</span>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-6 text-sm text-on-surface-variant">
            {['Trang Chủ', 'Chiến Dịch', 'Vinh Danh', 'Liên Hệ'].map(link => (
              <a
                key={link}
                href="#"
                className="hover:text-secondary transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Copyright + social */}
          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="flex gap-4">
              {['facebook', 'youtube', 'language'].map(icon => (
                <a
                  key={icon}
                  href="#"
                  className="text-on-surface-variant hover:text-secondary transition-colors duration-200"
                  aria-label={icon}
                >
                  <span
                    className="material-symbols-outlined text-xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {icon}
                  </span>
                </a>
              ))}
            </div>
            <p className="text-on-surface-variant text-xs">
              © 2024 Sử Việt Anh Hùng. Bảo lưu mọi quyền.
            </p>
          </div>

        </div>
      </footer>
    </div>
  )
}
