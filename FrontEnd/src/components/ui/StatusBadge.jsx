const CONTENT_CONFIG = {
  draft:     { label: 'Nháp',         cls: 'border-[#D4B896]',        style: { background: 'rgba(61,43,26,0.06)', color: '#A0794E' } },
  published: { label: 'Đã Xuất Bản', cls: 'border-[#8B1A1A]/30',     style: { background: 'rgba(139,26,26,0.07)', color: '#8B1A1A' } },
  archived:  { label: 'Lưu Trữ',     cls: 'border-[#D4B896]/50',     style: { background: '#FAE8DA', color: '#A0794E' } },
}

const DONATION_CONFIG = {
  pending:   { label: 'Chờ Xác Nhận', cls: 'border-[#C4956A]/40',    style: { background: 'rgba(196,149,106,0.12)', color: '#8B5E2A' } },
  confirmed: { label: 'Đã Xác Nhận', cls: 'border-green-600/30',     style: { background: 'rgba(34,139,34,0.07)', color: '#2D7A2D' } },
  rejected:  { label: 'Từ Chối',     cls: 'border-[#8B1A1A]/30',     style: { background: 'rgba(139,26,26,0.07)', color: '#8B1A1A' } },
}

export default function StatusBadge({ status, type = 'content' }) {
  const map  = type === 'donation' ? DONATION_CONFIG : CONTENT_CONFIG
  const conf = map[status] || { label: status, cls: 'border-[#D4B896]', style: { background: 'rgba(61,43,26,0.05)', color: '#A0794E' } }
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem] uppercase tracking-wide border ${conf.cls}`}
      style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600, ...conf.style }}
    >
      {conf.label}
    </span>
  )
}
