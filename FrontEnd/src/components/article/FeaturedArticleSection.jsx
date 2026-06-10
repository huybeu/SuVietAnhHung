// src/components/article/FeaturedArticleSection.jsx
import { Link } from 'react-router-dom'
import { useArticles } from '../../hooks/useArticles'
import { formatDateShort } from '../../lib/format'

function SpotlightCard({ article }) {
  const thumbnail = article.thumbnailUrl || article.thumbnail_url || article.image_url
  const publishedAt = article.publishedAt || article.published_at
  const summary = article.summary || article.excerpt
  const tags = article.tags || []

  return (
    <Link to={`/bai-viet/${article.slug || article.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div
        style={{
          position: 'relative', height: '100%', minHeight: 340, borderRadius: '1rem', overflow: 'hidden',
          background: 'linear-gradient(135deg, #FAE8DA, #F5D5C0)',
          boxShadow: '0 6px 28px rgba(139,26,26,0.13)', transition: 'transform 0.25s, box-shadow 0.25s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(139,26,26,0.2)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(139,26,26,0.13)' }}
      >
        {thumbnail && (
          <img
            src={thumbnail} alt={article.title} loading="lazy"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(30,12,4,0.82) 0%, rgba(30,12,4,0.3) 55%, transparent 100%)',
        }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C4956A', flexShrink: 0 }} />
            <span style={{ color: '#C4956A', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Nổi bật
            </span>
          </div>
          {tags.length > 0 && (
            <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              {tags.slice(0, 2).map(tag => (
                <span key={tag.id || tag.slug} style={{
                  padding: '1px 9px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 600,
                  background: 'rgba(196,149,106,0.25)', color: '#FAE8DA',
                  border: '0.5px solid rgba(196,149,106,0.4)',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                }}>
                  {tag.name}
                </span>
              ))}
            </div>
          )}
          <h3 style={{
            color: '#FDF5EE', fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', fontWeight: 700, lineHeight: 1.3,
            margin: '0 0 0.5rem',
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {article.title}
          </h3>
          {summary && (
            <p style={{
              color: 'rgba(253,245,238,0.75)', fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: '0.8rem', lineHeight: 1.55, margin: '0 0 0.75rem',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {summary}
            </p>
          )}
          {publishedAt && (
            <span style={{ color: 'rgba(253,245,238,0.5)', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.7rem' }}>
              {formatDateShort(publishedAt)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

function SideCard({ article }) {
  const thumbnail = article.thumbnailUrl || article.thumbnail_url || article.image_url
  const publishedAt = article.publishedAt || article.published_at
  const tags = article.tags || []

  return (
    <Link to={`/bai-viet/${article.slug || article.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{
          display: 'flex', gap: '0.75rem', padding: '0.75rem',
          background: '#FDF5EE', borderRadius: '0.75rem',
          border: '0.5px solid rgba(196,149,106,0.35)',
          boxShadow: '0 2px 12px rgba(61,43,26,0.07)', transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(61,43,26,0.13)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(61,43,26,0.07)' }}
      >
        <div style={{
          width: 90, height: 90, flexShrink: 0, borderRadius: '0.5rem', overflow: 'hidden',
          background: 'linear-gradient(135deg, #FAE8DA, #F5D5C0)',
        }}>
          {thumbnail
            ? <img src={thumbnail} alt={article.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.8rem', color: 'rgba(196,149,106,0.4)' }}>article</span>
              </div>
          }
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
          {tags.length > 0 && (
            <span style={{
              padding: '1px 8px', borderRadius: 20, fontSize: '0.65rem', fontWeight: 600,
              background: 'rgba(139,26,26,0.07)', color: '#8B1A1A', border: '0.5px solid rgba(139,26,26,0.18)',
              fontFamily: "'Be Vietnam Pro', sans-serif", alignSelf: 'flex-start',
            }}>
              {tags[0].name}
            </span>
          )}
          <h4 style={{
            color: '#3D2B1A', fontFamily: "'Playfair Display', serif", fontSize: '0.88rem', fontWeight: 700,
            lineHeight: 1.35, margin: '0.3rem 0 0',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {article.title}
          </h4>
          {publishedAt && (
            <span style={{ color: '#A0794E', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.68rem', marginTop: '0.3rem' }}>
              {formatDateShort(publishedAt)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function FeaturedArticleSection() {
  const { data, isLoading } = useArticles({ status: 'published', is_featured: true, limit: 5 })
  const articles = data?.data ?? []

  if (isLoading) {
    return (
      <section style={{ paddingBottom: '2.5rem', borderBottom: '0.5px solid rgba(196,149,106,0.3)', marginBottom: '2.5rem' }}>
        <div className="animate-pulse" style={{ height: 22, width: 180, background: 'rgba(196,149,106,0.2)', borderRadius: 4, marginBottom: '1.25rem' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="animate-pulse" style={{ height: 340, background: 'rgba(196,149,106,0.15)', borderRadius: '1rem' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1, 2].map(i => (
              <div key={i} className="animate-pulse" style={{ height: 110, background: 'rgba(196,149,106,0.12)', borderRadius: '0.75rem' }} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!articles.length) return null

  const [spotlight, ...rest] = articles
  const sideArticles = rest.slice(0, 2)

  return (
    <section style={{ paddingBottom: '2.5rem', borderBottom: '0.5px solid rgba(196,149,106,0.3)', marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '1.1rem' }}>⭐</span>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 700, color: '#3D2B1A', margin: 0 }}>
          Bài Viết <span style={{ color: '#8B1A1A' }}>Nổi Bật</span>
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: sideArticles.length ? 'minmax(0, 1.7fr) minmax(0, 1fr)' : '1fr',
        gap: '1rem',
        alignItems: 'stretch',
      }}>
        <SpotlightCard article={spotlight} />

        {sideArticles.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', justifyContent: 'stretch' }}>
            {sideArticles.map(a => <SideCard key={a.id} article={a} />)}
          </div>
        )}
      </div>
    </section>
  )
}
