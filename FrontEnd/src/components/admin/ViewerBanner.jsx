export default function ViewerBanner() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.6rem',
      background: 'rgba(246,190,59,0.08)', border: '1px solid rgba(246,190,59,0.25)',
      borderRadius: '0.6rem', padding: '0.65rem 1rem', marginBottom: '1.25rem',
    }}>
      <span className="material-symbols-outlined" style={{ color: '#f6be3b', fontSize: 18, flexShrink: 0 }}>visibility</span>
      <span className="font-cinzel" style={{ color: '#f6be3b', fontSize: '0.78rem' }}>Chế độ Xem</span>
      <span style={{ color: 'rgba(232,220,200,0.55)', fontSize: '0.78rem' }}>— Bạn không có quyền chỉnh sửa nội dung</span>
    </div>
  )
}
