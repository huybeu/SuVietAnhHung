// src/components/article/ArticleRelatedSection.jsx
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { articleService } from '../../services/articleService'
import { queryKeys } from '../../lib/queryKeys'
import { formatDateShort } from '../../lib/format'

function RelatedCard({ article }) {
  const thumbnail = article.thumbnailUrl || article.thumbnail_url || article.image_url
  const publishedAt = article.publishedAt || article.published_at

  return (
    <Link to={`/bai-viet/${article.slug || article.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        background: '#FDF5EE', border: '0.5px solid #D4B896', borderRadius: '0.75rem', overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(61,43,26,0.07)', transition: 'transform 0.2s, box-shadow 0.2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.transform='scale(1.02)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(61,43,26,0.12)' }}
        onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='0 2px 10px rgba(61,43,26,0.07)' }}
      >
        <div style={{ position: 'relative', paddingBottom: '55%', background: 'linear-gradient(135deg, #FAE8DA, #F5D5C0)' }}>
          {thumbnail
            ? <img src={thumbnail} alt={article.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
            : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>📜</div>
          }
        </div>
        <div style={{ padding: '0.9rem 1rem' }}>
          <h4 style={{
            color: '#3D2B1A', fontFamily: "'Playfair Display', serif", fontSize: '0.9rem', fontWeight: 600,
            margin: '0 0 0.4rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {article.title}
          </h4>
          {publishedAt && (
            <span style={{ color: '#A0794E', fontSize: '0.72rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              {formatDateShort(publishedAt)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function ArticleRelatedSection({ article }) {
  const tags = article?.tags ?? []
  const heroes = article?.heroes ?? []
  const tagSlug = tags[0]?.slug
  const heroId = heroes[0]?.id

  const tagParams = { status: 'published', tag: tagSlug, limit: 4 }
  const heroParams = { status: 'published', hero: heroId, limit: 4 }

  const { data: byTag } = useQuery({
    queryKey: queryKeys.articles.list(tagParams),
    queryFn: ({ signal }) => articleService.getArticles(tagParams, { signal }),
    enabled: !!tagSlug,
  })

  const { data: byHero } = useQuery({
    queryKey: queryKeys.articles.list(heroParams),
    queryFn: ({ signal }) => articleService.getArticles(heroParams, { signal }),
    enabled: !tagSlug && !!heroId,
  })

  const raw = (byTag?.data ?? byHero?.data ?? [])
    .filter(a => a.id !== article?.id)
    .slice(0, 3)

  if (!raw.length) return null

  return (
    <section style={{ padding: '3.5rem 1.5rem', background: '#FAE8DA', borderTop: '0.5px solid #D4B896' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(196,149,106,0.4), transparent)', marginBottom: '1.25rem' }} />
          <p style={{ color: '#8B1A1A', fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}>
            CÓ THỂ BẠN QUAN TÂM
          </p>
          <h2 style={{ color: '#3D2B1A', fontSize: '1.35rem', margin: 0, fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
            Bài Viết Liên Quan
          </h2>
          <div style={{ height: 2, width: 60, background: '#8B1A1A', margin: '0.75rem auto 0', opacity: 0.5 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {raw.map(a => <RelatedCard key={a.id} article={a} />)}
        </div>
      </div>
    </section>
  )
}
