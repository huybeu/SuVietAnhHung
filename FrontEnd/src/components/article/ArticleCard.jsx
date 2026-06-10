// src/components/article/ArticleCard.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDateShort } from '../../lib/format'
import FeaturedBadge from '../hero/FeaturedBadge'

function highlight(text, query) {
  if (!query || !text) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
  return parts.map((part, i) =>
    new RegExp(`^${escaped}$`, 'i').test(part)
      ? <mark key={i} style={{ background: 'rgba(139,26,26,0.15)', color: '#8B1A1A', borderRadius: 2, padding: '0 1px' }}>{part}</mark>
      : part
  )
}

export default function ArticleCard({ article, searchQuery = '' }) {
  const [hovered, setHovered] = useState(false)
  const href = `/bai-viet/${article.slug || article.id}`
  const thumbnail = article.thumbnailUrl || article.thumbnail_url || article.image_url || article.cover_url
  const summary = article.summary || article.excerpt
  const publishedAt = article.publishedAt || article.published_at
  const isFeatured = article.isFeatured || article.is_featured
  const tags = article.tags || []

  return (
    <Link to={href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="rounded-2xl overflow-hidden transition-all duration-200"
        style={{
          background: '#FAE8DA',
          border: hovered ? '0.5px solid rgba(139,26,26,0.35)' : '0.5px solid rgba(196,149,106,0.3)',
          boxShadow: hovered
            ? '0 8px 32px rgba(139,26,26,0.14), 0 2px 8px rgba(61,43,26,0.08)'
            : '0 2px 8px rgba(61,43,26,0.06)',
          transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Thumbnail */}
        <div style={{ position: 'relative', height: 180, overflow: 'hidden', background: 'rgba(196,149,106,0.12)', flexShrink: 0 }}>
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={article.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease',
                transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
              loading="lazy"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(139,26,26,0.06), rgba(196,149,106,0.16))' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: 'rgba(196,149,106,0.4)' }}>article</span>
            </div>
          )}
          {isFeatured && (
            <div style={{ position: 'absolute', top: 8, left: 8 }}>
              <FeaturedBadge />
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '0.875rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <h3 style={{
            color: '#3D2B1A', fontFamily: "'Playfair Display', serif", fontSize: '0.95rem',
            fontWeight: 700, lineHeight: 1.35,
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {searchQuery ? highlight(article.title, searchQuery) : article.title}
          </h3>

          {summary && (
            <p style={{
              color: '#5C3A1E', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.78rem',
              lineHeight: 1.55,
              overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}>
              {summary.length > 150 ? summary.slice(0, 150) + '…' : summary}
            </p>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.1rem' }}>
              {tags.slice(0, 3).map(tag => (
                <span key={tag.id || tag.slug} style={{
                  padding: '1px 8px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 600,
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  background: 'rgba(139,26,26,0.07)', color: '#8B1A1A',
                  border: '0.5px solid rgba(139,26,26,0.18)',
                }}>
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Date */}
          <div style={{ marginTop: 'auto', paddingTop: '0.35rem' }}>
            {publishedAt && (
              <span style={{
                color: 'rgba(61,43,26,0.4)', fontFamily: 'monospace', fontSize: '0.7rem', flexShrink: 0,
              }}>
                {formatDateShort(publishedAt)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
