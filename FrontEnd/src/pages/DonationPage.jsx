import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import DonationWizard from '../components/donation/DonationWizard'
import { fetchDonations } from '../lib/api'
import { formatVND, formatDateShort } from '../lib/format'

const GOAL   = 830_000_000
const RAISED = 622_500_000

function getTierEmoji(amount) {
  if (amount >= 500000) return '🥇'
  if (amount >= 200000) return '🥈'
  return '🥉'
}

const MARQUEE_DONORS =
  'Nguyễn Văn An • Trần Thị Bích • Lê Minh Đức • Phạm Thu Hà • Hoàng Quốc Bảo • Vũ Thị Lan • Đặng Hữu Phước • Bùi Thị Ngọc • Ngô Văn Thành • Lý Thị Mai • '.repeat(3)

export default function DonationPage() {
  useEffect(() => {
    document.title = 'Ủng Hộ Dự Án | Sử Việt Anh Hùng'
    return () => { document.title = 'Sử Việt Anh Hùng' }
  }, [])

  const pct = Math.round(RAISED / GOAL * 100)

  const { data: donationsData } = useQuery({
    queryKey: ['donations-public'],
    queryFn: () => fetchDonations({ status: 'confirmed', show_on_board: true, limit: 50 }),
    retry: false,
  })
  const donations = Array.isArray(donationsData) ? donationsData : (donationsData?.data || [])

  return (
    <div style={{ backgroundColor: '#FDF5EE', minHeight: '100vh', color: '#3D2B1A' }}>

      {/* ── Hero section ── */}
      <section style={{
        background: 'linear-gradient(180deg, #FDF5EE 0%, #FAE8DA 55%, #F5D5C0 100%)',
        padding: '5rem 1.5rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div className="dong-son-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto' }}>
          <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(196,149,106,0.4), transparent)', marginBottom: '1.5rem' }} />
          <p style={{ color: '#8B1A1A', fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}>
            Đóng Góp & Ủng Hộ
          </p>
          <h1 style={{ color: '#3D2B1A', fontSize: 'clamp(1.8rem,4vw,2.5rem)', margin: '0 0 1rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, lineHeight: 1.2 }}>
            Đồng Hành Bảo Tồn Di Sản
          </h1>
          <p style={{ color: '#5C3A1E', lineHeight: 1.8, fontSize: '1rem', margin: '0', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            Mỗi đồng đóng góp của bạn giúp dự án "Sử Việt Anh Hùng" xây dựng kho tư liệu lịch sử cho thế hệ mai sau.
          </p>
        </div>
      </section>

      {/* ── Campaign progress ── */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '3rem 1.5rem 0' }}>
        <div style={{
          background: '#FDF5EE', border: '0.5px solid #D4B896', borderRadius: '1rem',
          padding: '1.75rem 2rem', boxShadow: '0 2px 12px rgba(61,43,26,0.07)',
        }}>
          <h2 style={{ color: '#C4956A', fontSize: '1.1rem', marginBottom: '0.5rem', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
            Tiến Độ Gây Quỹ
          </h2>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <div style={{ color: '#8B1A1A', fontSize: '1.8rem', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>{formatVND(RAISED)}</div>
              <div style={{ color: '#A0794E', fontSize: '0.8rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>đã quyên góp</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#C4956A', fontSize: '1.8rem', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>{pct}%</div>
              <div style={{ color: '#A0794E', fontSize: '0.8rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>mục tiêu</div>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ height: 10, background: 'rgba(61,43,26,0.08)', borderRadius: 9999, overflow: 'hidden', marginBottom: '0.5rem' }}>
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <span style={{ color: '#A0794E', fontSize: '0.75rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Mục tiêu: {formatVND(GOAL)}</span>
            <span style={{ color: '#A0794E', fontSize: '0.75rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Còn lại: {formatVND(GOAL - RAISED)}</span>
          </div>
        </div>
      </section>

      {/* ── Donation wizard ── */}
      <DonationWizard />

      {/* ── Honor Board ── */}
      {donations.length > 0 && (
        <section id="board" style={{ padding: '4rem 1.5rem', background: '#FAE8DA', borderTop: '0.5px solid #D4B896' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(196,149,106,0.4), transparent)', marginBottom: '1.25rem' }} />
              <p style={{ color: '#8B1A1A', fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}>
                VINH DANH
              </p>
              <h2 style={{ color: '#3D2B1A', fontSize: '1.4rem', margin: 0, fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                Bảng Danh Dự Anh Hùng
              </h2>
            </div>

            {/* Marquee */}
            <div style={{ overflow: 'hidden', marginBottom: '1.5rem' }}>
              <div className="marquee-left" style={{ display: 'flex', gap: '2rem', whiteSpace: 'nowrap' }}>
                {[...donations, ...donations].map((d, i) => (
                  <span key={i} style={{ color: '#5C3A1E', fontSize: '0.82rem', flexShrink: 0, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                    {getTierEmoji(d.amount)} {d.is_anonymous ? 'Ẩn danh' : (d.donor_name || 'Ẩn danh')} · {formatVND(d.amount)}
                  </span>
                ))}
              </div>
            </div>

            {/* Table */}
            <div style={{ overflow: 'hidden', borderRadius: '0.75rem', border: '0.5px solid #D4B896', background: '#FDF5EE', boxShadow: '0 2px 12px rgba(61,43,26,0.07)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#FAE8DA' }}>
                    {['Hạng', 'Người Đóng Góp', 'Số Tiền', 'Ngày'].map(h => (
                      <th key={h} style={{
                        padding: '0.75rem 1rem', textAlign: 'left',
                        color: '#A0794E', fontSize: '0.65rem', textTransform: 'uppercase',
                        letterSpacing: '0.1em', borderBottom: '0.5px solid #D4B896',
                        fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {donations.slice(0, 20).map((d, i) => (
                    <tr key={d.id || i}
                      style={{ borderBottom: '0.5px solid rgba(212,184,150,0.4)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(196,149,106,0.06)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <td style={{ padding: '0.65rem 1rem', fontSize: '1.1rem' }}>{getTierEmoji(d.amount)}</td>
                      <td style={{ padding: '0.65rem 1rem', color: d.is_anonymous ? '#A0794E' : '#3D2B1A', fontSize: '0.85rem', fontStyle: d.is_anonymous ? 'italic' : 'normal', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                        {d.is_anonymous ? '(Ẩn danh)' : (d.donor_name || '—')}
                      </td>
                      <td style={{ padding: '0.65rem 1rem', color: '#8B1A1A', fontSize: '0.85rem', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>{formatVND(d.amount)}</td>
                      <td style={{ padding: '0.65rem 1rem', color: '#A0794E', fontSize: '0.8rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{formatDateShort(d.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ── */}
      <footer style={{ background: '#FAE8DA', borderTop: '1px solid rgba(196,149,106,0.35)', padding: '3rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(196,149,106,0.45), transparent)', marginBottom: '1.5rem' }} />
          <div style={{ textAlign: 'center', color: '#A0794E', fontSize: '0.78rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            © 2025 Sử Việt Anh Hùng. Tất cả quyền được bảo lưu. Dự án phi lợi nhuận vì cộng đồng.
          </div>
        </div>
      </footer>
    </div>
  )
}
