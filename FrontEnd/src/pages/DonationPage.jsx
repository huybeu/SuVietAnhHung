import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
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

export default function DonationPage() {
  useEffect(() => { document.title = 'Ủng Hộ Dự Án | Sử Việt Anh Hùng'; return () => { document.title = 'Sử Việt Anh Hùng' } }, [])

  const pct = Math.round(RAISED / GOAL * 100)

  const { data: donationsData } = useQuery({
    queryKey: ['donations-public'],
    queryFn: () => fetchDonations({ status: 'confirmed', show_on_board: true, limit: 50 }),
    retry: false,
  })
  const donations = Array.isArray(donationsData) ? donationsData : (donationsData?.data || [])

  return (
    <div style={{ backgroundColor: '#0a0402', minHeight: '100vh' }}>
      {/* Page header */}
      <div style={{ padding: '5rem 1.5rem 3rem', textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(246,190,59,0.4), transparent)', marginBottom: '1.5rem' }} />
        <h1 className="font-cinzel" style={{ color: '#f2dfd6', fontSize: 'clamp(1.8rem,4vw,2.5rem)', margin: '0 0 1rem' }}>
          <span style={{ color: '#dc143c' }}>✦</span> ĐỒNG HÀNH BẢO TỒN DI SẢN <span style={{ color: '#dc143c' }}>✦</span>
        </h1>
        <p style={{ color: 'rgba(232,220,200,0.65)', lineHeight: 1.8, fontSize: '1rem', margin: 0, fontFamily: 'Noto Serif, serif' }}>
          Mỗi đồng đóng góp của bạn giúp dự án "Sử Việt Anh Hùng" xây dựng kho tư liệu lịch sử cho thế hệ mai sau.
        </p>
      </div>

      {/* Campaign progress */}
      <div style={{ maxWidth: 700, margin: '0 auto 4rem', padding: '0 1.5rem' }}>
        <div className="glass-panel" style={{ borderRadius: '1rem', padding: '1.75rem 2rem' }}>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <div className="font-cinzel" style={{ color: '#f6be3b', fontSize: '1.8rem' }}>{formatVND(RAISED)}</div>
              <div style={{ color: 'rgba(232,220,200,0.5)', fontSize: '0.8rem', fontFamily: 'Cinzel, serif', letterSpacing: '0.05em' }}>đã quyên góp</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="font-cinzel" style={{ color: '#dc143c', fontSize: '1.8rem' }}>{pct}%</div>
              <div style={{ color: 'rgba(232,220,200,0.5)', fontSize: '0.8rem', fontFamily: 'Cinzel, serif' }}>mục tiêu</div>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ height: 12, background: 'rgba(26,17,13,0.8)', borderRadius: 9999, overflow: 'hidden', border: '1px solid rgba(246,190,59,0.15)' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(to right, #dc143c, #f6be3b)', borderRadius: 9999, transition: 'width 1s ease', boxShadow: '0 0 8px rgba(220,20,60,0.4)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <span style={{ color: 'rgba(232,220,200,0.4)', fontSize: '0.75rem', fontFamily: 'Cinzel, serif' }}>Mục tiêu: {formatVND(GOAL)}</span>
            <span style={{ color: 'rgba(232,220,200,0.4)', fontSize: '0.75rem', fontFamily: 'Cinzel, serif' }}>Còn lại: {formatVND(GOAL - RAISED)}</span>
          </div>
        </div>
      </div>

      {/* Wizard */}
      <DonationWizard />

      {/* Honor Board */}
      {donations.length > 0 && (
        <section id="board" style={{ padding: '4rem 1.5rem', backgroundColor: '#0d0705' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 className="font-cinzel" style={{ color: '#f2dfd6', fontSize: '1.4rem', margin: 0 }}>
                <span style={{ color: '#dc143c' }}>✦</span> BẢNG DANH DỰ ANH HÙNG <span style={{ color: '#dc143c' }}>✦</span>
              </h2>
            </div>

            {/* Marquee */}
            <div style={{ overflow: 'hidden', marginBottom: '1.5rem' }}>
              <div className="marquee-left" style={{ display: 'flex', gap: '2rem', whiteSpace: 'nowrap' }}>
                {[...donations, ...donations].map((d, i) => (
                  <span key={i} className="font-cinzel" style={{ color: '#e8dcc8', fontSize: '0.82rem', flexShrink: 0 }}>
                    {getTierEmoji(d.amount)} {d.is_anonymous ? 'Ẩn danh' : (d.donor_name || 'Ẩn danh')} · {formatVND(d.amount)}
                  </span>
                ))}
              </div>
            </div>

            {/* Table */}
            <div style={{ overflow: 'hidden', borderRadius: '0.75rem', border: '1px solid rgba(246,190,59,0.12)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#1b110d' }}>
                    {['Hạng', 'Người Đóng Góp', 'Số Tiền', 'Ngày'].map(h => (
                      <th key={h} className="font-cinzel" style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'rgba(246,190,59,0.6)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid rgba(246,190,59,0.12)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {donations.slice(0, 20).map((d, i) => (
                    <tr key={d.id || i} style={{ borderBottom: '1px solid rgba(246,190,59,0.06)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(220,20,60,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <td style={{ padding: '0.65rem 1rem', fontSize: '1.1rem' }}>{getTierEmoji(d.amount)}</td>
                      <td className="font-cinzel" style={{ padding: '0.65rem 1rem', color: d.is_anonymous ? 'rgba(232,220,200,0.4)' : '#e8dcc8', fontSize: '0.85rem', fontStyle: d.is_anonymous ? 'italic' : 'normal' }}>
                        {d.is_anonymous ? '(Ẩn danh)' : (d.donor_name || '—')}
                      </td>
                      <td className="font-cinzel" style={{ padding: '0.65rem 1rem', color: '#f6be3b', fontSize: '0.85rem' }}>{formatVND(d.amount)}</td>
                      <td style={{ padding: '0.65rem 1rem', color: 'rgba(232,220,200,0.45)', fontSize: '0.8rem', fontFamily: 'Noto Serif, serif' }}>{formatDateShort(d.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
