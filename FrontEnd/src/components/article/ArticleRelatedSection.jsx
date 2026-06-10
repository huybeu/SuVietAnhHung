// src/components/article/ArticleRelatedSection.jsx
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { articleService } from '../../services/articleService'
import { queryKeys } from '../../lib/queryKeys'
import { formatDateShort } from '../../lib/format'

function RelatedCard({ article, index }) {
  const thumbnail = article.thumbnailUrl || article.thumbnail_url || article.image_url
  const publishedAt = article.publishedAt || article.published_at
  const summary = article.summary || article.excerpt
  const tags = article.tags || []

  return (
    <Link to={`/bai-viet/${article.slug || article.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div
        style={{
          height: '100%', display: 'flex', flexDirection: 'column',
          background: '#FDF5EE', border: '0.5px solid rgba(196,149,106,0.35)',
          borderRadius: '1rem', overflow: 'hidden',
          boxShadow: '0 2px 14px rgba(61,43,26,0.07)',
          transition: 'transform 0.22s, box-shadow 0.22s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(61,43,26,0.14)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 14px rgba(61,43,26,0.07)' }}
      >
        {/* Image */}
        <div style={{ position: 'relative', paddingBottom: '56%', background: 'linear-gradient(135deg, #FAE8DA, #F0C9A8)', flexShrink: 0 }}>
          {thumbnail
            ? <img src={thumbnail} alt={article.title} loading="lazy"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: 'rgba(196,149,106,0.35)' }}>article</span>
              </div>
          }
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
            background: 'linear-gradient(to top, rgba(30,12,4,0.35), transparent)',
          }} />
          <div style={{
            position: 'absolute', top: 10, left: 10,
            width: 26, height: 26, borderRadius: '50%',
            background: 'rgba(139,26,26,0.85)', color: '#FAE8DA',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Playfair Display', serif", fontSize: '0.72rem', fontWeight: 700,
          }}>
            {index + 1}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '1rem 1.1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {tags.length > 0 && (
            <span style={{
              padding: '1px 9px', borderRadius: 20, fontSize: '0.65rem', fontWeight: 600, alignSelf: 'flex-start',
              background: 'rgba(139,26,26,0.07)', color: '#8B1A1A', border: '0.5px solid rgba(139,26,26,0.18)',
              fontFamily: "'Be Vietnam Pro', sans-serif",
            }}>
              {tags[0].name}
            </span>
          )}
          <h4 style={{
            color: '#3D2B1A', fontFamily: "'Playfair Display', serif", fontSize: '0.95rem', fontWeight: 700,
            lineHeight: 1.35, margin: 0,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {article.title}
          </h4>
          {summary && (
            <p style={{
              color: '#5C3A1E', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.78rem', lineHeight: 1.55,
              margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {summary}
            </p>
          )}
          <div style={{ marginTop: 'auto', paddingTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {publishedAt && (
              <span style={{ color: '#A0794E', fontSize: '0.7rem', fontFamily: "'Be Vietnam Pro', sans-serif", display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>calendar_today</span>
                {formatDateShort(publishedAt)}
              </span>
            )}
            <span style={{ color: '#8B1A1A', fontSize: '0.72rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              Đọc thêm
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>arrow_forward</span>
            </span>
          </div>
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

  const tagParams  = { status: 'published', tag: tagSlug, limit: 6 }
  const heroParams = { status: 'published', hero: heroId, limit: 6 }
  const latestParams = { status: 'published', limit: 4, sortBy: 'publishedAt', sortDir: 'desc' }

  const { data: byTag, isFetching: tagFetching } = useQuery({
    queryKey: queryKeys.articles.list(tagParams),
    queryFn: ({ signal }) => articleService.getArticles(tagParams, { signal }),
    enabled: !!tagSlug,
  })

  const { data: byHero, isFetching: heroFetching } = useQuery({
    queryKey: queryKeys.articles.list(heroParams),
    queryFn: ({ signal }) => articleService.getArticles(heroParams, { signal }),
    enabled: !!heroId,
  })

  // Merge tag + hero results, deduplicate, exclude current article
  const seen = new Set([article?.id])
  const merged = [...(byTag?.data ?? []), ...(byHero?.data ?? [])]
    .filter(a => { if (seen.has(a.id)) return false; seen.add(a.id); return true })

  const stillFetching = (!!tagSlug && tagFetching) || (!!heroId && heroFetching)
  const noRelated = !stillFetching && merged.length === 0

  const { data: latest } = useQuery({
    queryKey: queryKeys.articles.list(latestParams),
    queryFn: ({ signal }) => articleService.getArticles(latestParams, { signal }),
    enabled: noRelated,
  })

  const isLatestFallback = merged.length === 0
  const raw = isLatestFallback
    ? (latest?.data ?? []).filter(a => a.id !== article?.id).slice(0, 3)
    : merged.slice(0, 3)

  if (!raw.length) return null

  return (
    <section style={{ padding: '4rem 1.5rem 5rem', background: 'linear-gradient(180deg, #FAE8DA 0%, #F5D0B0 100%)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ height: 1, width: 40, background: 'rgba(139,26,26,0.3)' }} />
            <p style={{
              color: '#8B1A1A', fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase',
              fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700, margin: 0,
            }}>
              {isLatestFallback ? 'Khám phá thêm' : 'Có thể bạn quan tâm'}
            </p>
            <div style={{ height: 1, width: 40, background: 'rgba(139,26,26,0.3)' }} />
          </div>
          <h2 style={{
            color: '#3D2B1A', fontSize: 'clamp(1.3rem, 3vw, 1.75rem)', margin: '0 0 0.75rem',
            fontFamily: "'Playfair Display', serif", fontWeight: 700,
          }}>
            {isLatestFallback
              ? <>Bài Viết <span style={{ color: '#8B1A1A' }}>Mới Nhất</span></>
              : <>Bài Viết <span style={{ color: '#8B1A1A' }}>Liên Quan</span></>
            }
          </h2>
          <div style={{ height: 3, width: 50, background: 'linear-gradient(to right, #8B1A1A, #C4956A)', margin: '0 auto', borderRadius: 2 }} />
        </div>

        {/* Cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.25rem',
          alignItems: 'stretch',
        }}>
          {raw.map((a, i) => <RelatedCard key={a.id} article={a} index={i} />)}
        </div>

        {/* See all link */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link
            to="/bai-viet"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.65rem 1.75rem', borderRadius: 30,
              background: 'transparent', color: '#8B1A1A',
              border: '1.5px solid rgba(139,26,26,0.5)',
              fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600, fontSize: '0.85rem',
              textDecoration: 'none', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#8B1A1A'; e.currentTarget.style.color = '#FDF5EE'; e.currentTarget.style.borderColor = '#8B1A1A' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8B1A1A'; e.currentTarget.style.borderColor = 'rgba(139,26,26,0.5)' }}
          >
            Xem tất cả bài viết
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
