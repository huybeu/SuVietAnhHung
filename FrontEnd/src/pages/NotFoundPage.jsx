import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div
        className="font-cinzel"
        style={{ fontSize: '7rem', lineHeight: 1, color: '#dc143c', opacity: 0.25, userSelect: 'none' }}
      >
        404
      </div>

      <h1 className="font-cinzel" style={{ color: '#f2dfd6', fontSize: '1.5rem', margin: 0 }}>
        Trang Không Tìm Thấy
      </h1>

      <p style={{ color: 'rgba(232,220,200,0.5)', maxWidth: 360, lineHeight: 1.75, margin: 0 }}>
        Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển sang nơi khác.
      </p>

      <Link
        to="/"
        className="font-cinzel"
        style={{
          color: '#f6be3b',
          fontSize: '0.875rem',
          padding: '0.6rem 1.5rem',
          border: '1px solid rgba(246,190,59,0.35)',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          transition: 'all 0.2s',
        }}
      >
        ← Về Trang Chủ
      </Link>
    </div>
  )
}
