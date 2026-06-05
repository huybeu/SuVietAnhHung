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

// ── Stat Card ─────────────────────────────────────────────────────────────────
const colorMap = {
  crimson: { ring: 'bg-[#dc143c]/20 text-[#dc143c]', value: 'text-[#dc143c]' },
  gold:    { ring: 'bg-[#f6be3b]/20 text-[#f6be3b]', value: 'text-[#f6be3b]' },
  green:   { ring: 'bg-emerald-500/20 text-emerald-400', value: 'text-emerald-400' },
  blue:    { ring: 'bg-sky-500/20 text-sky-400', value: 'text-sky-400' },
}

function StatCard({ icon, label, value, sub, color = 'gold' }) {
  const c = colorMap[color] || colorMap.gold
  return (
    <div className="glass-panel rounded-xl p-5 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${c.ring}`}>
        <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{icon}</span>
      </div>
      <div className="min-w-0">
        <div className={`font-cinzel text-2xl font-bold ${c.value}`}>{value}</div>
        <div className="text-[#e8dcc8]/70 text-sm mt-0.5">{label}</div>
        {sub && <div className="text-[#e8dcc8]/40 text-xs mt-1">{sub}</div>}
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
    <div className="glass-panel rounded-xl p-5">
      <div className="font-cinzel text-[#f6be3b] text-xs tracking-widest mb-4 uppercase">Tiến Độ Chiến Dịch</div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="font-cinzel text-2xl text-[#f2dfd6]">{formatVND(raised)}</span>
        <span className="text-[#e8dcc8]/50 text-sm">/ {formatVND(goal)}</span>
      </div>
      <div className="h-3 bg-[#1b110d] rounded-full overflow-hidden mb-3">
        <div className="h-full rounded-full crimson-to-gold transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-cinzel text-[#f6be3b]">{pct}%</span>
        <span className="text-[#e8dcc8]/50">{daysLeft > 0 ? `Còn ${daysLeft} ngày` : 'Đã kết thúc'}</span>
        <span className="text-[#e8dcc8]/40">Hạn: {formatDateShort(deadline.toISOString())}</span>
      </div>
    </div>
  )
}

// ── Pending Tasks Panel ───────────────────────────────────────────────────────
function PendingTasksPanel({ pendingDonations, draftCount }) {
  const donations = pendingDonations?.data || []
  const donationCount = pendingDonations?.total || donations.length

  return (
    <div className="glass-panel p-5 rounded-xl">
      <div className="font-cinzel text-[#f6be3b] text-xs tracking-widest uppercase mb-5">Cần Xử Lý</div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#e8dcc8]/70 text-sm">Đóng góp chờ xác nhận</span>
          {donationCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#dc143c] flex items-center justify-center text-white text-xs font-bold">
              {donationCount > 9 ? '9+' : donationCount}
            </span>
          )}
        </div>
        {donations.length === 0 ? (
          <p className="text-[#e8dcc8]/30 text-xs italic py-2">Không có đóng góp nào đang chờ.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {donations.slice(0, 5).map((d) => (
              <div key={d.id} className="flex items-center justify-between py-2 border-b border-[#f6be3b]/10 last:border-0">
                <div className="flex flex-col min-w-0">
                  <span className="text-[#e8dcc8]/80 text-sm truncate">
                    {d.is_anonymous ? 'Ẩn danh' : (d.donor_name || d.user?.name || 'Ẩn danh')}
                  </span>
                  <span className="text-[#e8dcc8]/40 text-xs">{formatDateShort(d.created_at)}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  <span className="font-cinzel text-[#f6be3b] text-sm">{formatVND(d.amount)}</span>
                  <StatusBadge status={d.status} />
                </div>
              </div>
            ))}
          </div>
        )}
        <Link to="/admin/quyen-gop" className="mt-3 inline-flex items-center gap-1 text-xs text-[#dc143c] hover:text-[#f6be3b] transition-colors">
          Xem tất cả
          <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>arrow_forward</span>
        </Link>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#e8dcc8]/70 text-sm">Bài nháp chưa đăng</span>
          {draftCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#f6be3b]/20 border border-[#f6be3b]/40 flex items-center justify-center text-[#f6be3b] text-xs font-bold">
              {draftCount > 9 ? '9+' : draftCount}
            </span>
          )}
        </div>
        {draftCount === 0 ? (
          <p className="text-[#e8dcc8]/30 text-xs italic">Không có bài nháp nào.</p>
        ) : (
          <p className="text-[#e8dcc8]/50 text-sm">
            Có <span className="text-[#f6be3b] font-semibold">{draftCount}</span> bài viết đang chờ xuất bản.
          </p>
        )}
        <Link to="/admin/bai-viet?status=draft" className="mt-3 inline-flex items-center gap-1 text-xs text-[#dc143c] hover:text-[#f6be3b] transition-colors">
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
      <div className="mb-8">
        <h1 className="font-cinzel text-[#f2dfd6] text-2xl tracking-wide uppercase">Tổng Quan Hệ Thống</h1>
        <p className="text-[#e8dcc8]/40 text-sm mt-1 capitalize">{today}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="history_edu" label="Bài Viết"      value={articleCount.toLocaleString('vi-VN')} sub="Tổng số bài"  color="gold" />
        <StatCard icon="person"      label="Anh Hùng"      value={heroCount.toLocaleString('vi-VN')}    sub="Đã ghi danh" color="crimson" />
        <StatCard icon="payments"    label="Chờ Xác Nhận"  value={pendingCount.toLocaleString('vi-VN')} sub={`${formatVND(pendingAmount)} đang chờ`} color="green" />
        <StatCard icon="draft"       label="Bài Nháp"      value={draftCount.toLocaleString('vi-VN')}   sub="Chưa xuất bản" color="blue" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <PendingTasksPanel pendingDonations={pendingDonations} draftCount={draftCount} />
        <CampaignProgress goal={campaignGoal} raised={campaignRaised} />
      </div>
    </AdminLayout>
  )
}
