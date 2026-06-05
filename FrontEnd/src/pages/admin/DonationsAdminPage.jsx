import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable from '../../components/ui/DataTable'
import StatusBadge from '../../components/ui/StatusBadge'
import ConfirmModal from '../../components/ui/ConfirmModal'
import ViewerBanner from '../../components/admin/ViewerBanner'
import { can, useRole } from '../../lib/permissions'
import { donationService } from '../../services/donationService'
import { queryKeys }        from '../../lib/queryKeys'
import { formatVND, formatDateShort } from '../../lib/format'

const lightCard = {
  background: '#FDF5EE', border: '0.5px solid #D4B896', borderRadius: '0.85rem',
  boxShadow: '0 4px 20px rgba(61,43,26,0.10)',
}

// ── Confirm Modal ─────────────────────────────────────────────────────────────
function ConfirmDonationModal({ donation, onClose }) {
  const qc = useQueryClient()
  const [paymentRef, setPaymentRef] = useState('')
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: () => donationService.confirmDonation(donation.id, paymentRef),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: queryKeys.donations.all }); onClose() },
    onError:    (e) => setError(e.message),
  })

  function submit() {
    if (!paymentRef.trim()) { setError('Vui lòng nhập mã giao dịch'); return }
    setError('')
    mutation.mutate()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(61,43,26,0.45)' }} onClick={onClose} />
      <div style={{ ...lightCard, position: 'relative', width: '100%', maxWidth: 440, padding: '1.5rem' }}>
        <h3 style={{ color: '#3D2B1A', fontSize: '1.1rem', marginBottom: '0.5rem', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>Xác Nhận Đóng Góp</h3>
        <div style={{ background: 'rgba(196,149,106,0.08)', border: '0.5px solid rgba(196,149,106,0.30)', borderRadius: '0.5rem', padding: '0.85rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ color: '#A0794E', fontSize: '0.8rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Người đóng góp</span>
            <span style={{ color: '#3D2B1A', fontSize: '0.85rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}>{donation.is_anonymous ? '(Ẩn danh)' : (donation.donor_name || '—')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ color: '#A0794E', fontSize: '0.8rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Số tiền</span>
            <span style={{ color: '#C4956A', fontSize: '0.95rem', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>{formatVND(donation.amount)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#A0794E', fontSize: '0.8rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Email</span>
            <span style={{ color: '#5C3A1E', fontSize: '0.8rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{donation.donor_email}</span>
          </div>
        </div>
        <label style={{ display: 'block', color: '#5C3A1E', fontSize: '0.8rem', marginBottom: '0.4rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}>Mã giao dịch ngân hàng *</label>
        <input className="input-gold" value={paymentRef} onChange={e => { setPaymentRef(e.target.value); setError('') }}
          placeholder="VD: FT23154892301" style={{ width: '100%', boxSizing: 'border-box', marginBottom: '0.35rem' }}
          onKeyDown={e => e.key === 'Enter' && submit()} autoFocus />
        {error && <div style={{ color: '#8B1A1A', fontSize: '0.75rem', marginBottom: '0.75rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{error}</div>}
        <div style={{ color: '#A0794E', fontSize: '0.72rem', marginBottom: '1.25rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Mã này sẽ lưu vào hồ sơ đóng góp để đối soát</div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '0.55rem 1rem', border: '0.5px solid #D4B896', borderRadius: '0.4rem', background: 'transparent', color: '#A0794E', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>Huỷ</button>
          <button onClick={submit} disabled={mutation.isPending} className="btn-epic" style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {mutation.isPending && <span style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} className="animate-spin" />}
            Xác Nhận ✓
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Reject Modal ──────────────────────────────────────────────────────────────
function RejectDonationModal({ donation, onClose }) {
  const qc = useQueryClient()
  const [reason, setReason] = useState('')

  const mutation = useMutation({
    mutationFn: () => donationService.rejectDonation(donation.id, reason),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: queryKeys.donations.all }); onClose() },
  })

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(61,43,26,0.45)' }} onClick={onClose} />
      <div style={{ ...lightCard, position: 'relative', width: '100%', maxWidth: 400, padding: '1.5rem' }}>
        <h3 style={{ color: '#3D2B1A', fontSize: '1.1rem', marginBottom: '1rem', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>Từ Chối Đóng Góp</h3>
        <div style={{ marginBottom: '1rem', color: '#5C3A1E', fontSize: '0.88rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
          Từ chối đóng góp <strong style={{ color: '#C4956A' }}>{formatVND(donation.amount)}</strong> của <strong style={{ color: '#3D2B1A' }}>{donation.is_anonymous ? 'ẩn danh' : (donation.donor_name || '—')}</strong>?
        </div>
        <label style={{ display: 'block', color: '#5C3A1E', fontSize: '0.8rem', marginBottom: '0.4rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}>Lý do (tuỳ chọn)</label>
        <textarea className="input-gold" rows={3} value={reason} onChange={e => setReason(e.target.value)}
          placeholder="Lý do từ chối..." style={{ width: '100%', resize: 'none', marginBottom: '1.25rem', boxSizing: 'border-box' }} />
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '0.55rem 1rem', border: '0.5px solid #D4B896', borderRadius: '0.4rem', background: 'transparent', color: '#A0794E', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>Huỷ</button>
          <button onClick={() => mutation.mutate()} disabled={mutation.isPending}
            style={{ padding: '0.55rem 1.25rem', background: '#8B1A1A', border: 'none', borderRadius: '0.4rem', color: '#FDF5EE', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
            {mutation.isPending && <span style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} className="animate-spin" />}
            Từ Chối
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Filter Bar ────────────────────────────────────────────────────────────────
function DonationFilterBar({ searchParams, setSearchParams }) {
  const statuses = [
    { value: 'all', label: 'Tất cả' }, { value: 'pending', label: 'Chờ xác nhận' },
    { value: 'confirmed', label: 'Đã xác nhận' }, { value: 'rejected', label: 'Đã từ chối' },
  ]
  const active = searchParams.get('status') || 'all'
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
      {statuses.map(s => (
        <button key={s.value}
          onClick={() => setSearchParams(prev => {
            const next = new URLSearchParams(prev)
            if (s.value === 'all') next.delete('status'); else next.set('status', s.value)
            next.set('page', '1'); return next
          })}
          style={{
            padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.78rem', cursor: 'pointer',
            border: `0.5px solid ${active === s.value ? '#8B1A1A' : 'rgba(212,184,150,0.6)'}`,
            background: active === s.value ? 'rgba(139,26,26,0.08)' : 'transparent',
            color: active === s.value ? '#8B1A1A' : '#A0794E',
            fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: active === s.value ? 700 : 400,
            transition: 'all 0.15s',
          }}>
          {s.label}
        </button>
      ))}
    </div>
  )
}

// ── Stats Bar ─────────────────────────────────────────────────────────────────
function DonationStats({ data }) {
  const all       = data || []
  const pending   = all.filter(d => d.status === 'pending').length
  const confirmed = all.filter(d => d.status === 'confirmed')
  const total     = confirmed.reduce((s, d) => s + (d.amount || 0), 0)
  const stats = [
    { label: 'Chờ xác nhận', value: pending,          color: '#C4956A', icon: 'schedule',     bg: 'rgba(196,149,106,0.12)' },
    { label: 'Đã xác nhận',  value: confirmed.length, color: '#2D7A2D', icon: 'check_circle', bg: 'rgba(34,139,34,0.08)' },
    { label: 'Tổng thu',     value: formatVND(total),  color: '#8B1A1A', icon: 'payments',     bg: 'rgba(139,26,26,0.08)' },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
      {stats.map(s => (
        <div key={s.label} style={{ ...lightCard, display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem' }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: s.color }}>{s.icon}</span>
          </div>
          <div>
            <div style={{ color: s.color, fontSize: '1.1rem', lineHeight: 1.2, fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>{s.value}</div>
            <div style={{ color: '#A0794E', fontSize: '0.72rem', marginTop: 2, fontFamily: "'Be Vietnam Pro', sans-serif" }}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DonationsAdminPage() {
  const role = useRole()
  const canConfirm = can(role, 'donations:confirm')
  const [searchParams, setSearchParams] = useSearchParams()
  const [confirmModal, setConfirmModal] = useState(null)
  const [rejectModal,  setRejectModal]  = useState(null)

  const currentPage = parseInt(searchParams.get('page') || '1')

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.donations.admin(Object.fromEntries(searchParams)),
    queryFn:  ({ signal }) => donationService.getDonations({
      status:   searchParams.get('status') || '',
      page:     currentPage,
      pageSize: 20,
      sortBy:   'created_at',
      sortDir:  'desc',
    }, { signal }),
  })

  const { data: allData } = useQuery({
    queryKey: queryKeys.donations.adminStats(),
    queryFn:  ({ signal }) => donationService.getDonations({ pageSize: 999 }, { signal }),
    retry: false,
  })

  const donations    = Array.isArray(data)    ? data    : (data?.data    || [])
  const allDonations = Array.isArray(allData) ? allData : (allData?.data || [])

  const columns = [
    {
      key: 'donor',
      header: 'Người Đóng Góp',
      render: (row) => (
        <div>
          <div style={{ color: row.is_anonymous ? '#A0794E' : '#3D2B1A', fontSize: '0.88rem', fontStyle: row.is_anonymous ? 'italic' : 'normal', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500 }}>
            {row.is_anonymous ? '(Ẩn danh)' : (row.donor_name || '—')}
          </div>
          <div style={{ color: '#A0794E', fontSize: '0.75rem', marginTop: 2, fontFamily: "'Be Vietnam Pro', sans-serif" }}>{row.donor_email}</div>
        </div>
      ),
    },
    { key: 'amount', header: 'Số Tiền', sortable: true, render: (row) => <span style={{ color: '#C4956A', fontSize: '0.9rem', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>{formatVND(row.amount)}</span> },
    {
      key: 'payment_method', header: 'Hình Thức',
      render: (row) => <span style={{ color: '#5C3A1E', fontSize: '0.82rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
        {row.payment_method === 'bank_transfer' ? '🏦 Chuyển khoản' : row.payment_method === 'qr' ? '📱 QR Code' : row.payment_method || '—'}
      </span>,
    },
    { key: 'status', header: 'Trạng Thái', render: (row) => <StatusBadge status={row.status} type="donation" /> },
    { key: 'payment_ref', header: 'Mã GD', render: (row) => <span style={{ color: '#A0794E', fontSize: '0.78rem', fontFamily: 'monospace' }}>{row.payment_ref || <span style={{ color: 'rgba(61,43,26,0.3)' }}>—</span>}</span> },
    { key: 'created_at', header: 'Ngày', sortable: true, render: (row) => <span style={{ color: '#5C3A1E', fontSize: '0.82rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{formatDateShort(row.created_at)}</span> },
  ]

  const rowActions = (row) => [
    { label: 'Xác nhận thanh toán', icon: 'check_circle', onClick: () => setConfirmModal(row), hidden: !canConfirm || row.status !== 'pending' },
    { label: 'Từ chối', icon: 'cancel', variant: 'danger', onClick: () => setRejectModal(row), hidden: !canConfirm || row.status !== 'pending' },
    { label: 'Xem chi tiết', icon: 'info', onClick: () => {} },
  ]

  return (
    <AdminLayout
      topbarTitle="Quản Lý Đóng Góp"
      topbarBreadcrumbs={[{ label: 'Admin', path: '/admin' }, { label: 'Đóng Góp', path: '/admin/quyen-gop' }]}
    >
      {!canConfirm && <ViewerBanner />}
      <DonationStats data={allDonations} />
      <DataTable
        data={donations}
        columns={columns}
        totalCount={Array.isArray(data) ? data.length : (data?.total || 0)}
        page={currentPage}
        pageSize={20}
        onPageChange={(p) => setSearchParams(prev => { const n = new URLSearchParams(prev); n.set('page', String(p)); return n })}
        sortBy={searchParams.get('sortBy')}
        sortDir={searchParams.get('sortDir') || 'desc'}
        onSortChange={(k, d) => setSearchParams(prev => { const n = new URLSearchParams(prev); n.set('sortBy', k); n.set('sortDir', d); return n })}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        filterBar={<DonationFilterBar searchParams={searchParams} setSearchParams={setSearchParams} />}
        rowActions={rowActions}
        emptyState={<div style={{ textAlign: 'center', padding: '4rem 0', color: '#A0794E', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.9rem' }}>Hành trình ngàn dặm bắt đầu từ một bước nhỏ.</div>}
      />
      {confirmModal && <ConfirmDonationModal donation={confirmModal} onClose={() => setConfirmModal(null)} />}
      {rejectModal  && <RejectDonationModal  donation={rejectModal}  onClose={() => setRejectModal(null)} />}
    </AdminLayout>
  )
}
