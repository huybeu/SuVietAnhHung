export default function ViewerBanner() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.6rem',
      background: 'rgba(196,149,106,0.10)', border: '0.5px solid rgba(196,149,106,0.40)',
      borderRadius: '0.6rem', padding: '0.65rem 1rem', marginBottom: '1.25rem',
    }}>
      <span className="material-symbols-outlined" style={{ color: '#C4956A', fontSize: 18, flexShrink: 0 }}>visibility</span>
      <span style={{ color: '#8B1A1A', fontSize: '0.78rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700 }}>Chế Độ Xem</span>
      <span style={{ color: '#5C3A1E', fontSize: '0.78rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>— Bạn không có quyền chỉnh sửa nội dung</span>
    </div>
  )
}
