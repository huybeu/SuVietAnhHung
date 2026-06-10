// src/pages/ArticleDetailPage.jsx
import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { useArticle } from '../hooks/useArticle'
import PageMeta from '../components/PageMeta'
import ArticleBreadcrumb from '../components/article/ArticleBreadcrumb'
import ArticleRelatedSection from '../components/article/ArticleRelatedSection'
import FeaturedBadge from '../components/hero/FeaturedBadge'
import { formatDate } from '../lib/format'

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div style={{ background: '#FDF5EE' }}>
      <div className="animate-pulse" style={{ height: 360, background: 'linear-gradient(180deg, #FAE8DA, #F5D5C0)' }} />
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[90, 70, 100, 80, 85, 60, 95, 75].map((w, i) => (
          <div key={i} className="animate-pulse" style={{ height: 15, background: 'rgba(196,149,106,0.18)', borderRadius: 4, width: `${w}%` }} />
        ))}
      </div>
    </div>
  )
}

// ── Content renderer ──────────────────────────────────────────────────────────
function ArticleContent({ html }) {
  const clean = DOMPurify.sanitize(html || '', {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
  })

  return (
    <div
      className="article-content"
      style={{
        color: '#3D2B1A',
        fontFamily: "'Be Vietnam Pro', sans-serif",
        fontSize: '1rem',
        lineHeight: 1.85,
      }}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ArticleDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const { data: article, isLoading, isError, error } = useArticle(slug)

  // Redirect if not published
  useEffect(() => {
    if (!article) return
    const status = article.status
    if (status && status !== 'published') {
      navigate('/404', { replace: true })
    }
  }, [article, navigate])

  // 404
  useEffect(() => {
    if (isError && error?.status === 404) {
      navigate('/404', { replace: true })
    }
  }, [isError, error, navigate])

  if (isLoading) return <Skeleton />

  if (isError || !article) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', background: '#FDF5EE' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#C4956A' }}>article</span>
        <h2 style={{ color: '#3D2B1A', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>Không tìm thấy bài viết</h2>
        <Link to="/bai-viet" style={{ color: '#8B1A1A', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600, fontSize: '0.9rem' }}>
          ← Danh sách bài viết
        </Link>
      </div>
    )
  }

  const thumbnail = article.thumbnailUrl || article.thumbnail_url || article.image_url
  const publishedAt = article.publishedAt || article.published_at
  const isFeatured = article.isFeatured || article.is_featured
  const tags = article.tags ?? []
  const heroes = article.heroes ?? []
  const summary = article.summary || article.excerpt

  return (
    <div style={{ background: '#FDF5EE', minHeight: '100vh' }}>
      <PageMeta
        title={`${article.title} | Sử Việt Anh Hùng`}
        description={summary ? summary.replace(/<[^>]+>/g, '').slice(0, 160) : article.title}
        image={thumbnail}
      />

      <ArticleBreadcrumb title={article.title} />

      {/* Hero image */}
      {thumbnail && (
        <div style={{ width: '100%', maxHeight: 400, overflow: 'hidden', background: '#FAE8DA' }}>
          <img
            src={thumbnail}
            alt={article.title}
            style={{ width: '100%', maxHeight: 400, objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      {/* Article body */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '2.5rem 1.5rem 3rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          {isFeatured && <div style={{ marginBottom: '0.75rem' }}><FeaturedBadge /></div>}

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: 700, color: '#3D2B1A', lineHeight: 1.25, marginBottom: '1rem',
          }}>
            {article.title}
          </h1>

          {/* Meta row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '0.5px solid rgba(196,149,106,0.35)' }}>
            {publishedAt && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#A0794E', fontSize: '0.85rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>calendar_today</span>
                {formatDate(publishedAt)}
              </span>
            )}
            {tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center' }}>
                {tags.map(tag => (
                  <Link
                    key={tag.id || tag.slug}
                    to={`/bai-viet?tag=${tag.slug}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <span style={{
                      padding: '2px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600,
                      background: 'rgba(139,26,26,0.07)', color: '#8B1A1A',
                      border: '0.5px solid rgba(139,26,26,0.22)',
                      fontFamily: "'Be Vietnam Pro', sans-serif",
                      transition: 'all 0.15s', display: 'inline-block',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background='#8B1A1A'; e.currentTarget.style.color='#FDF5EE' }}
                      onMouseLeave={e => { e.currentTarget.style.background='rgba(139,26,26,0.07)'; e.currentTarget.style.color='#8B1A1A' }}
                    >
                      {tag.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Summary / lead */}
        {summary && (
          <p style={{
            fontFamily: "'Lora', serif", fontSize: '1.05rem', lineHeight: 1.75,
            color: '#5C3A1E', fontStyle: 'italic', marginBottom: '2rem',
            padding: '1rem 1.25rem', background: '#FAE8DA',
            borderLeft: '3px solid #8B1A1A', borderRadius: '0 8px 8px 0',
          }}>
            {summary}
          </p>
        )}

        {/* Main content */}
        <ArticleContent html={article.content} />

        {/* Related heroes */}
        {heroes.length > 0 && (
          <div style={{ marginTop: '2.5rem', padding: '1.25rem', background: '#FAE8DA', borderRadius: 12, border: '0.5px solid rgba(196,149,106,0.35)' }}>
            <p style={{ color: '#A0794E', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}>
              ANH HÙNG LIÊN QUAN
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {heroes.map(hero => (
                <Link
                  key={hero.id}
                  to={`/anh-hung/${hero.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                    padding: '5px 14px', borderRadius: 20,
                    background: '#FDF5EE', color: '#3D2B1A',
                    border: '0.5px solid rgba(196,149,106,0.5)',
                    fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.85rem', fontWeight: 600,
                    transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background='#8B1A1A'; e.currentTarget.style.color='#FDF5EE'; e.currentTarget.style.borderColor='#8B1A1A' }}
                    onMouseLeave={e => { e.currentTarget.style.background='#FDF5EE'; e.currentTarget.style.color='#3D2B1A'; e.currentTarget.style.borderColor='rgba(196,149,106,0.5)' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 15 }}>person</span>
                    {hero.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related articles */}
      <ArticleRelatedSection article={article} />
    </div>
  )
}
