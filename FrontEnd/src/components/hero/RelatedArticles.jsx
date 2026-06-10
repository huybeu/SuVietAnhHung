import { Link } from 'react-router-dom'
import { formatDateShort } from '../../lib/format'

function ArticleCard({ article }) {
  return (
    <Link to={`/bai-viet/${article.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{
          background: '#FDF5EE', border: '0.5px solid #D4B896', borderRadius: '0.75rem',
          overflow: 'hidden', boxShadow: '0 2px 12px rgba(61,43,26,0.07)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform='scale(1.02)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(61,43,26,0.12)' }}
        onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='0 2px 12px rgba(61,43,26,0.07)' }}
      >
        {/* Cover */}
        <div style={{ position: 'relative', paddingBottom: '50%', background: 'linear-gradient(135deg, #FAE8DA, #F5D5C0)' }}>
          {article.cover_url
            ? <img src={article.cover_url} alt={article.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', opacity: 0.4 }}>📜</div>
          }
        </div>
        {/* Body */}
        <div style={{ padding: '1rem 1.25rem' }}>
          <h3 style={{
            color: '#3D2B1A', fontSize: '0.95rem', margin: '0 0 0.5rem',
            fontFamily: "'Playfair Display', serif", fontWeight: 600,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{article.title}</h3>
          {article.excerpt && (
            <p style={{
              color: '#5C3A1E', fontSize: '0.8rem', lineHeight: 1.6, margin: '0 0 0.75rem',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>{article.excerpt}</p>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#A0794E', fontSize: '0.7rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              {formatDateShort(article.published_at)}
            </span>
            <span style={{ color: '#8B1A1A', fontSize: '0.8rem' }}>→</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function RelatedArticles({ articles = [], heroId, heroName }) {
  if (!articles.length) return null
  const shown = articles.slice(0, 5)
  const seeAllHref = heroId ? `/bai-viet?hero=${heroId}` : '/bai-viet'
  const seeAllLabel = heroName ? `Xem tất cả bài viết về ${heroName} →` : 'Xem tất cả bài viết →'

  return (
    <section style={{ padding: '4rem 1.5rem', background: '#FAE8DA', borderTop: '0.5px solid #D4B896', borderBottom: '0.5px solid #D4B896' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(196,149,106,0.4), transparent)', marginBottom: '1.25rem' }} />
          <p style={{ color: '#8B1A1A', fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}>
            TƯ LIỆU LIÊN QUAN
          </p>
          <h2 style={{ color: '#3D2B1A', fontSize: '1.4rem', margin: 0, fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
            Bài Viết Liên Quan
          </h2>
          <div style={{ height: 2, width: 60, background: '#8B1A1A', margin: '0.75rem auto 0', opacity: 0.6 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {shown.map(a => <ArticleCard key={a.id} article={a} />)}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link
            to={seeAllHref}
            style={{ color: '#8B1A1A', fontSize: '0.85rem', textDecoration: 'none', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
            onMouseEnter={e => e.target.style.color='#6B1414'}
            onMouseLeave={e => e.target.style.color='#8B1A1A'}
          >
            {seeAllLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
