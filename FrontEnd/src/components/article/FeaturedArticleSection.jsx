// src/components/article/FeaturedArticleSection.jsx
import { Link } from 'react-router-dom'
import { useArticles } from '../../hooks/useArticles'
import { formatDateShort } from '../../lib/format'
import FeaturedBadge from '../hero/FeaturedBadge'

function FeaturedCard({ article }) {
  const thumbnail = article.thumbnailUrl || article.thumbnail_url || article.image_url
  const publishedAt = article.publishedAt || article.published_at
  const summary = article.summary || article.excerpt
  const tags = article.tags || []

  return (
    <Link to={`/bai-viet/${article.slug || article.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: '#FDF5EE',
          border: '0.5px solid rgba(196,149,106,0.4)',
          boxShadow: '0 4px 20px rgba(139,26,26,0.1)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          height: '100%', display: 'flex', flexDirection: 'column',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 36px rgba(139,26,26,0.16)' }}
        onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 20px rgba(139,26,26,0.1)' }}
      >
        <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: 'linear-gradient(135deg, #FAE8DA, #F5D5C0)', flexShrink: 0 }}>
          {thumbnail
            ? <img src={thumbnail} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'rgba(196,149,106,0.35)' }}>article</span>
              </div>
          }
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <FeaturedBadge />
          </div>
        </div>
        <div style={{ padding: '1rem 1.1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <h3 style={{
            color: '#3D2B1A', fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, lineHeight: 1.3,
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {article.title}
          </h3>
          {summary && (
            <p style={{
              color: '#5C3A1E', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.8rem', lineHeight: 1.55,
              overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}>
              {summary}
            </p>
          )}
          {tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {tags.slice(0, 2).map(tag => (
                <span key={tag.id || tag.slug} style={{
                  padding: '1px 8px', borderRadius: 20, fontSize: '0.67rem', fontWeight: 600,
                  background: 'rgba(139,26,26,0.07)', color: '#8B1A1A', border: '0.5px solid rgba(139,26,26,0.18)',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                }}>
                  {tag.name}
                </span>
              ))}
            </div>
          )}
          {publishedAt && (
            <span style={{ color: 'rgba(61,43,26,0.38)', fontFamily: 'monospace', fontSize: '0.7rem', marginTop: 'auto', paddingTop: '0.3rem' }}>
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
      <section style={{ padding: '2rem 0 0' }}>
        <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="animate-pulse" style={{ height: 20, width: 160, background: 'rgba(196,149,106,0.2)', borderRadius: 4 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.1rem' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl overflow-hidden" style={{ background: '#FAE8DA', border: '0.5px solid rgba(196,149,106,0.3)' }}>
              <div style={{ height: 200, background: 'rgba(196,149,106,0.18)' }} />
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ height: 14, background: 'rgba(196,149,106,0.22)', borderRadius: 4, width: '80%' }} />
                <div style={{ height: 11, background: 'rgba(196,149,106,0.15)', borderRadius: 4, width: '60%' }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (!articles.length) return null

  return (
    <section style={{ paddingBottom: '2.5rem', borderBottom: '0.5px solid rgba(196,149,106,0.3)', marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.1rem' }}>⭐</span>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 700,
            color: '#3D2B1A', margin: 0,
          }}>
            Bài Viết <span style={{ color: '#8B1A1A' }}>Nổi Bật</span>
          </h2>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.1rem' }}>
        {articles.map(article => <FeaturedCard key={article.id} article={article} />)}
      </div>
    </section>
  )
}
