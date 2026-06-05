import { Link } from 'react-router-dom'
import { formatDateShort } from '../../lib/format'

function ArticleCard({ article }) {
  return (
    <Link to={`/bai-viet/${article.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="glass-panel" style={{
        borderRadius: '0.75rem', overflow: 'hidden',
        transition: 'transform 0.2s, border-color 0.2s',
        border: '1px solid rgba(246,190,59,0.2)',
      }}
        onMouseEnter={e => { e.currentTarget.style.transform='scale(1.02)'; e.currentTarget.style.borderColor='rgba(246,190,59,0.5)' }}
        onMouseLeave={e => { e.currentTarget.style.transform='scale(1)';    e.currentTarget.style.borderColor='rgba(246,190,59,0.2)' }}
      >
        {/* Cover */}
        <div style={{ position: 'relative', paddingBottom: '50%', background: 'linear-gradient(135deg, #1b110d, #0a0402)' }}>
          {article.cover_url
            ? <img src={article.cover_url} alt={article.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', opacity: 0.3 }}>📜</div>
          }
        </div>
        {/* Body */}
        <div style={{ padding: '1rem 1.25rem' }}>
          <h3 className="font-cinzel" style={{
            color: '#f2dfd6', fontSize: '0.95rem', margin: '0 0 0.5rem',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{article.title}</h3>
          {article.excerpt && (
            <p style={{
              color: 'rgba(232,220,200,0.6)', fontSize: '0.8rem', lineHeight: 1.6, margin: '0 0 0.75rem',
              display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>{article.excerpt}</p>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="font-cinzel" style={{ color: 'rgba(246,190,59,0.55)', fontSize: '0.7rem' }}>
              {formatDateShort(article.published_at)}
            </span>
            <span style={{ color: '#dc143c', fontSize: '0.8rem' }}>→</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function RelatedArticles({ articles = [] }) {
  if (!articles.length) return null
  return (
    <section style={{ padding: '4rem 1.5rem', backgroundColor: '#0a0402' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(246,190,59,0.3), transparent)', marginBottom: '1.25rem' }} />
          <h2 className="font-cinzel" style={{ color: '#f2dfd6', fontSize: '1.4rem', margin: 0 }}>
            <span style={{ color: '#dc143c' }}>✦</span>{' '}BÀI VIẾT LIÊN QUAN{' '}<span style={{ color: '#dc143c' }}>✦</span>
          </h2>
          <div style={{ height: 2, width: 60, background: '#dc143c', margin: '0.75rem auto 0' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {articles.slice(0, 3).map(a => <ArticleCard key={a.id} article={a} />)}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/bai-viet" className="font-cinzel" style={{ color: '#f6be3b', fontSize: '0.85rem', textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.color='#f2dfd6'}
            onMouseLeave={e => e.target.style.color='#f6be3b'}>
            Xem tất cả bài viết →
          </Link>
        </div>
      </div>
    </section>
  )
}
