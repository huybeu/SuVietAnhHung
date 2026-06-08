import AdminLayout from '../../components/admin/AdminLayout'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { heroService }     from '../../services/heroService'
import { articleService }  from '../../services/articleService'
import { donationService } from '../../services/donationService'
import { queryKeys }       from '../../lib/queryKeys'
import { fetchSiteConfig } from '../../lib/api'
import { formatVND, formatDateShort } from '../../lib/format'
import StatusBadge from '../../components/ui/StatusBadge'

const cardStyle = {
  background: '#FDF5EE', border: '0.5px solid #D4B896', borderRadius: '0.75rem',
  padding: '1.25rem', boxShadow: '0 2px 12px rgba(61,43,26,0.06)',
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
const colorMap = {
  crimson: { ring: { background: 'rgba(139,26,26,0.10)', color: '#8B1A1A' }, value: '#8B1A1A' },
  gold:    { ring: { background: 'rgba(196,149,106,0.14)', color: '#C4956A' }, value: '#C4956A' },
  green:   { ring: { background: 'rgba(34,139,34,0.10)', color: '#2D7A2D' }, value: '#2D7A2D' },
  blue:    { ring: { background: 'rgba(14,110,180,0.10)', color: '#0E6EB4' }, value: '#0E6EB4' },
}

function StatCard({ icon, label, value, sub, color = 'gold' }) {
  const c = colorMap[color] || colorMap.gold
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...c.ring }}>
          <span className="material-symbols-outlined" style={{ fontSize: '22px', color: c.ring.color }}>{icon}</span>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: c.value, fontFamily: "'Playfair Display', serif", lineHeight: 1.2 }}>{value}</div>
          <div style={{ color: '#5C3A1E', fontSize: '0.82rem', marginTop: '0.2rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{label}</div>
          {sub && <div style={{ color: '#A0794E', fontSize: '0.72rem', marginTop: '0.2rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{sub}</div>}
        </div>
      </div>
    </div>
  )
}

// ── Campaign Progress ─────────────────────────────────────────────────────────
function CampaignProgress({ goal, raised }) {
  const pct = Math.min(100, Math.round((raised / goal) * 100))
  const deadline = new Date('2025-12-31')
  const now = new Date()
  const daysLeft = Math.max(0, Math.ceil((deadline - now) / (1000 * 60 * 60 * 24)))

  return (
    <div style={cardStyle}>
      <div style={{ color: '#C4956A', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700 }}>Tiến Độ Chiến Dịch</div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ color: '#3D2B1A', fontSize: '1.4rem', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>{formatVND(raised)}</span>
        <span style={{ color: '#A0794E', fontSize: '0.82rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>/ {formatVND(goal)}</span>
      </div>
      <div style={{ height: 10, background: 'rgba(61,43,26,0.08)', borderRadius: 9999, overflow: 'hidden', marginBottom: '0.75rem' }}>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', fontFamily: "'Be Vietnam Pro', sans-serif' " }}>
        <span style={{ color: '#8B1A1A', fontWeight: 700 }}>{pct}%</span>
        <span style={{ color: '#A0794E' }}>{daysLeft > 0 ? `Còn ${daysLeft} ngày` : 'Đã kết thúc'}</span>
        <span style={{ color: '#A0794E' }}>Hạn: {formatDateShort(deadline.toISOString())}</span>
      </div>
    </div>
  )
}

// ── Pending Tasks Panel ───────────────────────────────────────────────────────
function PendingTasksPanel({ pendingDonations, draftCount }) {
  const donations = pendingDonations?.data || []
  const donationCount = pendingDonations?.total || donations.length

  return (
    <div style={cardStyle}>
      <div style={{ color: '#8B1A1A', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.25rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700 }}>Cần Xử Lý</div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span style={{ color: '#5C3A1E', fontSize: '0.85rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Đóng góp chờ xác nhận</span>
          {donationCount > 0 && (
            <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#8B1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FDF5EE', fontSize: '0.72rem', fontWeight: 700, fontFamily: "'Be Vietnam Pro', sans-serif", flexShrink: 0 }}>
              {donationCount > 9 ? '9+' : donationCount}
            </span>
          )}
        </div>
        {donations.length === 0 ? (
          <p style={{ color: '#A0794E', fontSize: '0.78rem', fontStyle: 'italic', padding: '0.5rem 0', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Không có đóng góp nào đang chờ.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {donations.slice(0, 5).map((d) => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '0.5px solid rgba(212,184,150,0.4)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span style={{ color: '#5C3A1E', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                    {d.is_anonymous ? 'Ẩn danh' : (d.donor_name || d.user?.name || 'Ẩn danh')}
                  </span>
                  <span style={{ color: '#A0794E', fontSize: '0.72rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{formatDateShort(d.created_at)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, marginLeft: '0.75rem' }}>
                  <span style={{ color: '#C4956A', fontSize: '0.85rem', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>{formatVND(d.amount)}</span>
                  <StatusBadge status={d.status} />
                </div>
              </div>
            ))}
          </div>
        )}
        <Link to="/admin/quyen-gop" style={{ marginTop: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', color: '#8B1A1A', textDecoration: 'none', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}
          onMouseEnter={e => e.currentTarget.style.color='#C4956A'}
          onMouseLeave={e => e.currentTarget.style.color='#8B1A1A'}>
          Xem tất cả
          <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>arrow_forward</span>
        </Link>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span style={{ color: '#5C3A1E', fontSize: '0.85rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Bài nháp chưa đăng</span>
          {draftCount > 0 && (
            <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(196,149,106,0.18)', border: '0.5px solid rgba(196,149,106,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C4956A', fontSize: '0.72rem', fontWeight: 700, fontFamily: "'Be Vietnam Pro', sans-serif", flexShrink: 0 }}>
              {draftCount > 9 ? '9+' : draftCount}
            </span>
          )}
        </div>
        {draftCount === 0 ? (
          <p style={{ color: '#A0794E', fontSize: '0.78rem', fontStyle: 'italic', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Không có bài nháp nào.</p>
        ) : (
          <p style={{ color: '#5C3A1E', fontSize: '0.85rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            Có <span style={{ color: '#C4956A', fontWeight: 700 }}>{draftCount}</span> bài viết đang chờ xuất bản.
          </p>
        )}
        <Link to="/admin/bai-viet?status=draft" style={{ marginTop: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', color: '#8B1A1A', textDecoration: 'none', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}
          onMouseEnter={e => e.currentTarget.style.color='#C4956A'}
          onMouseLeave={e => e.currentTarget.style.color='#8B1A1A'}>
          Xem bài nháp
          <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>arrow_forward</span>
        </Link>
      </div>
    </div>
  )
}

// ── Dashboard Page ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const today = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const { data: articlesData } = useQuery({
    queryKey: queryKeys.articles.count(),
    queryFn:  ({ signal }) => articleService.getArticles({ pageSize: 1 }, { signal }),
  })

  const { data: heroesData } = useQuery({
    queryKey: queryKeys.heroes.count(),
    queryFn:  ({ signal }) => heroService.getHeroes({ pageSize: 1 }, { signal }),
  })

  const { data: pendingDonations } = useQuery({
    queryKey: queryKeys.donations.pending(),
    queryFn:  ({ signal }) => donationService.getDonations({ status: 'pending', pageSize: 5 }, { signal }),
  })

  const { data: draftArticles } = useQuery({
    queryKey: queryKeys.articles.draftCount(),
    queryFn:  ({ signal }) => articleService.getArticles({ status: 'draft', pageSize: 1 }, { signal }),
  })

  const { data: siteConfig } = useQuery({
    queryKey: queryKeys.siteConfig(),
    queryFn:  fetchSiteConfig,
  })

  const articleCount   = articlesData?.total ?? 47
  const heroCount      = heroesData?.total   ?? 23
  const pendingCount   = pendingDonations?.total ?? 4
  const pendingAmount  = pendingDonations?.data?.reduce((sum, d) => sum + (d.amount || 0), 0) ?? 4500000
  const draftCount     = draftArticles?.total ?? 3
  const campaignGoal   = siteConfig?.donation_goal   ?? 50000000
  const campaignRaised = siteConfig?.donation_raised ?? 18750000

  return (
    <AdminLayout topbarTitle="Tổng Quan" topbarBreadcrumbs={[{ label: 'Admin', path: '/admin' }]}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#3D2B1A', fontSize: '1.5rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, letterSpacing: '0.02em' }}>Tổng Quan Hệ Thống</h1>
        <p style={{ color: '#A0794E', fontSize: '0.82rem', marginTop: '0.25rem', textTransform: 'capitalize', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{today}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard icon="history_edu" label="Bài Viết"      value={articleCount.toLocaleString('vi-VN')} sub="Tổng số bài"  color="gold" />
        <StatCard icon="person"      label="Anh Hùng"      value={heroCount.toLocaleString('vi-VN')}    sub="Đã ghi danh" color="crimson" />
        <StatCard icon="payments"    label="Chờ Xác Nhận"  value={pendingCount.toLocaleString('vi-VN')} sub={`${formatVND(pendingAmount)} đang chờ`} color="green" />
        <StatCard icon="draft"       label="Bài Nháp"      value={draftCount.toLocaleString('vi-VN')}   sub="Chưa xuất bản" color="blue" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <PendingTasksPanel pendingDonations={pendingDonations} draftCount={draftCount} />
        <CampaignProgress goal={campaignGoal} raised={campaignRaised} />
      </div>
    </AdminLayout>
  )
}
