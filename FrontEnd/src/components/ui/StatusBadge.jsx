const CONTENT_CONFIG = {
  draft:     { label: 'Nháp',           cls: 'bg-[#333]/60 text-[#e8dcc8]/60 border-[#e8dcc8]/20' },
  published: { label: 'Đã Xuất Bản',   cls: 'bg-[#f6be3b]/15 text-[#f6be3b] border-[#f6be3b]/40' },
  archived:  { label: 'Lưu Trữ',       cls: 'bg-[#1b110d] text-[#e8dcc8]/40 border-[#e8dcc8]/10' },
}

const DONATION_CONFIG = {
  pending:   { label: 'Chờ Xác Nhận',  cls: 'bg-yellow-900/30 text-yellow-400 border-yellow-600/40' },
  confirmed: { label: 'Đã Xác Nhận',   cls: 'bg-green-900/30 text-green-400 border-green-600/40' },
  rejected:  { label: 'Từ Chối',       cls: 'bg-red-900/30 text-red-400 border-red-600/40' },
}

export default function StatusBadge({ status, type = 'content' }) {
  const map  = type === 'donation' ? DONATION_CONFIG : CONTENT_CONFIG
  const conf = map[status] || { label: status, cls: 'bg-[#333] text-[#e8dcc8]/50 border-[#e8dcc8]/10' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem] font-cinzel uppercase tracking-wide border ${conf.cls}`}>
      {conf.label}
    </span>
  )
}
