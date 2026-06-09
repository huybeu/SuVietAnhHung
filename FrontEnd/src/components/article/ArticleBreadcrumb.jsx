// src/components/article/ArticleBreadcrumb.jsx
import { Link } from 'react-router-dom'

export default function ArticleBreadcrumb({ title }) {
  return (
    <nav style={{ padding: '0.75rem 1.5rem', borderBottom: '0.5px solid rgba(196,149,106,0.25)', background: '#FAE8DA' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: '#A0794E', fontSize: '0.8rem', textDecoration: 'none', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500 }}
          onMouseEnter={e => e.target.style.color='#8B1A1A'} onMouseLeave={e => e.target.style.color='#A0794E'}>
          Trang Chủ
        </Link>
        <span style={{ color: 'rgba(196,149,106,0.5)', fontSize: '0.75rem' }}>›</span>
        <Link to="/bai-viet" style={{ color: '#A0794E', fontSize: '0.8rem', textDecoration: 'none', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500 }}
          onMouseEnter={e => e.target.style.color='#8B1A1A'} onMouseLeave={e => e.target.style.color='#A0794E'}>
          Bài Viết
        </Link>
        {title && (
          <>
            <span style={{ color: 'rgba(196,149,106,0.5)', fontSize: '0.75rem' }}>›</span>
            <span style={{ color: '#3D2B1A', fontSize: '0.8rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '50vw' }}>
              {title}
            </span>
          </>
        )}
      </div>
    </nav>
  )
}
