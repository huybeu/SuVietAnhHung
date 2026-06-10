// src/pages/PublicHeroListPage.jsx
import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { heroService } from '../services/heroService'
import { queryKeys } from '../lib/queryKeys'
import PageMeta from '../components/PageMeta'
import FeaturedBadge from '../components/hero/FeaturedBadge'
import { useDebounce } from '../hooks/useDebounce'

const PAGE_SIZE = 12

// ── Skeleton card ─────────────────────────────────────────────────────────────
function HeroCardSkeleton() {
  return (
    <div
      className="animate-pulse rounded-2xl overflow-hidden"
      style={{ background: '#FAE8DA', border: '0.5px solid rgba(196,149,106,0.3)' }}
    >
      <div style={{ height: 200, background: 'rgba(196,149,106,0.18)' }} />
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ height: 14, background: 'rgba(196,149,106,0.22)', borderRadius: 4, width: '70%' }} />
        <div style={{ height: 11, background: 'rgba(196,149,106,0.15)', borderRadius: 4, width: '50%' }} />
        <div style={{ height: 10, background: 'rgba(196,149,106,0.12)', borderRadius: 4, width: '40%' }} />
      </div>
    </div>
  )
}

// ── Hero card ─────────────────────────────────────────────────────────────────
function HeroCard({ hero }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      to={`/anh-hung/${hero.slug}`}
      style={{ textDecoration: 'none' }}
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
        }}
      >
        {/* Ảnh */}
        <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: 'rgba(196,149,106,0.12)' }}>
          {hero.image_url || hero.banner_url ? (
            <img
              src={hero.image_url || hero.banner_url}
              alt={hero.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
              loading="lazy"
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(139,26,26,0.08), rgba(196,149,106,0.18))',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'rgba(196,149,106,0.5)' }}>
                person
              </span>
            </div>
          )}

          {/* Era badge */}
          {hero.era?.name && (
            <div style={{
              position: 'absolute', bottom: 8, left: 8,
              padding: '2px 8px', borderRadius: 20,
              background: 'rgba(61,43,26,0.72)',
              backdropFilter: 'blur(6px)',
              color: '#FAE8DA',
              fontSize: '0.68rem',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: 600,
              letterSpacing: '0.04em',
            }}>
              {hero.era.name}
            </div>
          )}

          {/* Featured badge */}
          {hero.is_featured && (
            <div style={{ position: 'absolute', top: 8, right: 8 }}>
              <FeaturedBadge />
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '0.875rem 1rem' }}>
          <h3 style={{
            color: '#3D2B1A',
            fontFamily: "'Playfair Display', serif",
            fontSize: '1rem',
            fontWeight: 700,
            lineHeight: 1.3,
            marginBottom: '0.2rem',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
          }}>
            {hero.name}
          </h3>
          {hero.title && (
            <p style={{
              color: '#8B1A1A',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: '0.78rem',
              fontWeight: 600,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
            }}>
              {hero.title}
            </p>
          )}
          {(hero.birth_year || hero.death_year) && (
            <p style={{
              color: '#A0794E',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              marginTop: '0.25rem',
            }}>
              {hero.birth_year ?? '?'} – {hero.death_year ?? '?'}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

// ── Anh Hùng Nổi Bật Section ─────────────────────────────────────────────────
function FeaturedSection() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.heroes.list({ is_featured: true, limit: 8, is_active: 'true' }),
    queryFn:  ({ signal }) => heroService.getHeroes({ is_featured: true, limit: 8, is_active: 'true' }, { signal }),
    staleTime: 2 * 60_000,
  })
  const heroes = data?.data ?? []
  if (isLoading || heroes.length === 0) return null

  return (
    <section style={{
      borderBottom: '0.5px solid rgba(196,149,106,0.3)',
      padding: '2.5rem 1.5rem',
      background: 'linear-gradient(180deg, rgba(250,232,218,0.6) 0%, transparent 100%)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.2rem',
            fontWeight: 700,
            color: '#3D2B1A',
            margin: 0,
          }}>
            ⭐ Anh Hùng Nổi Bật
          </h2>
          <div style={{
            flex: 1, height: '0.5px',
            background: 'linear-gradient(to right, rgba(196,149,106,0.4), transparent)',
          }} />
          <Link
            to="/anh-hung?featured=yes"
            style={{
              color: '#8B1A1A',
              fontSize: '0.8rem',
              textDecoration: 'none',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            Xem tất cả →
          </Link>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}>
          {heroes.map(hero => <HeroCard key={hero.id} hero={hero} />)}
        </div>
      </div>
    </section>
  )
}

// ── Era Chips ────────────────────────────────────────────────────────────────
// Chỉ render era-specific chips (không có "Tất Cả" — được render riêng bên ngoài)
function EraFilter({ eras, activeEra, onSelect }) {
  return (
    <>
      {eras.map(era => {
        const active = String(activeEra) === String(era.id)
        return (
          <button
            key={era.id}
            onClick={() => onSelect(String(era.id))}
            style={{
              height: 32,
              padding: '0 0.875rem',
              borderRadius: 20,
              border: active ? '1.5px solid #8B1A1A' : '0.5px solid rgba(196,149,106,0.45)',
              background: active ? '#8B1A1A' : 'transparent',
              color: active ? '#FDF5EE' : '#5C3A1E',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: '0.8rem',
              fontWeight: active ? 700 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
              boxShadow: active ? '0 2px 8px rgba(139,26,26,0.22)' : 'none',
            }}
          >
            {era.name}
          </button>
        )
      })}
    </>
  )
}

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ page, total, pageSize, onPageChange }) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null

  const pages = []
  const delta = 2
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
      pages.push(i)
    }
  }
  const withEllipsis = []
  for (let i = 0; i < pages.length; i++) {
    if (i > 0 && pages[i] - pages[i - 1] > 1) withEllipsis.push('...')
    withEllipsis.push(pages[i])
  }

  const btnBase = {
    fontFamily: "'Be Vietnam Pro', sans-serif",
    fontSize: '0.85rem',
    fontWeight: 600,
    minWidth: 36,
    height: 36,
    border: '0.5px solid rgba(196,149,106,0.4)',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.15s',
    padding: '0 0.5rem',
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: '0.4rem', marginTop: '2.5rem', flexWrap: 'wrap',
    }}>
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        style={{ ...btnBase, background: 'none', color: page <= 1 ? 'rgba(61,43,26,0.25)' : '#8B1A1A', cursor: page <= 1 ? 'default' : 'pointer' }}
      >
        ‹
      </button>

      {withEllipsis.map((p, i) =>
        p === '...' ? (
          <span key={`e${i}`} style={{ color: 'rgba(61,43,26,0.35)', padding: '0 0.25rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            style={{
              ...btnBase,
              background: p === page ? '#8B1A1A' : 'none',
              color: p === page ? '#FDF5EE' : '#3D2B1A',
              borderColor: p === page ? '#8B1A1A' : 'rgba(196,149,106,0.4)',
              boxShadow: p === page ? '0 2px 8px rgba(139,26,26,0.25)' : 'none',
            }}
          >
            {p}
          </button>
        )
      )}

      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        style={{ ...btnBase, background: 'none', color: page >= totalPages ? 'rgba(61,43,26,0.25)' : '#8B1A1A', cursor: page >= totalPages ? 'default' : 'pointer' }}
      >
        ›
      </button>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PublicHeroListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [localQ, setLocalQ] = useState(searchParams.get('q') || '')

  const currentPage     = parseInt(searchParams.get('page') || '1', 10)
  const currentEra      = searchParams.get('era') || ''
  const currentQ        = searchParams.get('q') || ''
  const currentFeatured = searchParams.get('featured') || ''

  const debouncedQ = useDebounce(localQ, 300)

  // Đồng bộ debounced search → URL (chỉ khi thực sự thay đổi)
  useEffect(() => {
    if (debouncedQ === currentQ) return
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (debouncedQ) next.set('q', debouncedQ); else next.delete('q')
      next.set('page', '1')
      return next
    })
  }, [debouncedQ]) // eslint-disable-line react-hooks/exhaustive-deps

  // Load eras for filter chips
  const { data: erasData } = useQuery({
    queryKey: queryKeys.eras.all(),
    queryFn:  ({ signal }) => heroService.getEras({ signal }),
    staleTime: 5 * 60_000,
  })
  const eras = Array.isArray(erasData) ? erasData : (erasData?.data ?? [])

  // Load heroes list
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.heroes.list({ q: currentQ, era_id: currentEra, featured: currentFeatured, page: currentPage, limit: PAGE_SIZE, is_active: 'true' }),
    queryFn:  ({ signal }) => heroService.getHeroes(
      {
        q:           currentQ,
        era_id:      currentEra,
        is_featured: currentFeatured === 'yes' ? true : undefined,
        page:        currentPage,
        limit:       PAGE_SIZE,
        is_active:   'true',
      },
      { signal }
    ),
  })

  const heroes     = data?.data ?? []
  const totalCount = data?.meta?.total ?? 0

  const setParam = (key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value) next.set(key, value); else next.delete(key)
      next.set('page', '1')
      return next
    })
  }

  const handleEraSelect = (eraId) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (eraId) next.set('era', eraId); else next.delete('era')
      next.set('page', '1')
      return next
    })
  }

  const handleFeaturedToggle = () => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (currentFeatured === 'yes') next.delete('featured')
      else next.set('featured', 'yes')
      next.set('page', '1')
      return next
    })
  }

  const handlePageChange = (page) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.set('page', String(page))
      return next
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
    setLocalQ('')
    setSearchParams(new URLSearchParams())
  }

  const hasFilters = !!(currentQ || currentEra || currentFeatured)

  return (
    <div style={{ background: '#FDF5EE', minHeight: '100vh', paddingTop: 64 }}>
      <PageMeta
        title="Anh Hùng Dân Tộc"
        description="Những anh hùng dân tộc đã viết nên những trang sử hào hùng của đất nước Việt Nam"
      />

      {/* Page header */}
      <div style={{
        background: 'linear-gradient(180deg, #FAE8DA 0%, #FDF5EE 100%)',
        borderBottom: '0.5px solid rgba(196,149,106,0.25)',
        padding: '3rem 1.5rem 2rem',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: "'Be Vietnam Pro', sans-serif",
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#C4956A',
          marginBottom: '0.5rem',
        }}>
          Trang sử Việt
        </p>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.8rem, 5vw, 3rem)',
          fontWeight: 700,
          color: '#3D2B1A',
          lineHeight: 1.2,
          marginBottom: '0.75rem',
        }}>
          Anh Hùng Dân Tộc
        </h1>
        <p style={{
          fontFamily: "'Be Vietnam Pro', sans-serif",
          fontSize: '0.95rem',
          color: '#5C3A1E',
          maxWidth: 480,
          margin: '0 auto',
          lineHeight: 1.6,
        }}>
          Những anh hùng dân tộc đã viết nên những trang sử hào hùng của đất nước
        </p>
      </div>

      {/* Anh Hùng Nổi Bật */}
      {!hasFilters && <FeaturedSection />}

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Filter bar */}
        <div style={{
          background: '#FAE8DA',
          border: '0.5px solid rgba(196,149,106,0.3)',
          borderRadius: 14,
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
        }}>
          {/* Search + meta row */}
          <div className="flex flex-wrap gap-3 items-center" style={{ marginBottom: '0.85rem' }}>
            {/* Search input */}
            <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 180 }}>
              <span
                className="material-symbols-outlined"
                style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: 'rgba(61,43,26,0.35)', pointerEvents: 'none' }}
              >
                search
              </span>
              <input
                type="text"
                value={localQ}
                onChange={e => setLocalQ(e.target.value)}
                placeholder="Tìm kiếm anh hùng..."
                className="input-gold w-full"
                style={{ height: 40, paddingLeft: 36, paddingRight: localQ ? 32 : 10, fontSize: '0.88rem' }}
              />
              {localQ && (
                <button
                  onClick={() => { setLocalQ(''); setParam('q', '') }}
                  style={{
                    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(61,43,26,0.4)', fontSize: 15, lineHeight: 1, padding: 2,
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Clear filters */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  height: 40, padding: '0 0.75rem',
                  background: 'none', border: '0.5px solid rgba(139,26,26,0.25)',
                  borderRadius: 8, cursor: 'pointer',
                  color: '#8B1A1A', fontSize: '0.85rem',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontWeight: 600, flexShrink: 0, transition: 'all 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,26,26,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>filter_alt_off</span>
                Xoá lọc
              </button>
            )}

            {/* Result count */}
            {!isLoading && (
              <span style={{
                marginLeft: 'auto',
                color: '#A0794E',
                fontSize: '0.82rem',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                flexShrink: 0,
              }}>
                {totalCount.toLocaleString('vi-VN')} anh hùng
              </span>
            )}
          </div>

          {/* Era chips + Nổi Bật toggle — một hàng */}
          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* "Tất Cả" luôn hiện, kể cả khi chưa load xong eras */}
            <button
              onClick={() => handleEraSelect('')}
              style={{
                height: 32, padding: '0 0.875rem', borderRadius: 20,
                border: !currentEra ? '1.5px solid #8B1A1A' : '0.5px solid rgba(196,149,106,0.45)',
                background: !currentEra ? '#8B1A1A' : 'transparent',
                color: !currentEra ? '#FDF5EE' : '#5C3A1E',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: '0.8rem', fontWeight: !currentEra ? 700 : 500,
                cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
                boxShadow: !currentEra ? '0 2px 8px rgba(139,26,26,0.22)' : 'none',
              }}
            >
              Tất Cả
            </button>

            {/* Era-specific chips chỉ hiện khi có data */}
            {eras.length > 0 && <EraFilter eras={eras} activeEra={currentEra} onSelect={handleEraSelect} />}

            {/* Divider — chỉ hiện khi có eras */}
            {eras.length > 0 && (
              <div style={{ width: 1, height: 22, background: 'rgba(196,149,106,0.35)', flexShrink: 0, alignSelf: 'center' }} />
            )}

            {/* Nổi Bật toggle chip */}
            <button
              onClick={handleFeaturedToggle}
              style={{
                height: 32,
                padding: '0 0.9rem',
                borderRadius: 20,
                border: currentFeatured === 'yes' ? '1.5px solid #C4956A' : '0.5px solid rgba(196,149,106,0.45)',
                background: currentFeatured === 'yes'
                  ? 'linear-gradient(135deg, #8B1A1A 0%, #C4956A 100%)'
                  : 'transparent',
                color: currentFeatured === 'yes' ? '#FDF5EE' : '#5C3A1E',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: '0.8rem',
                fontWeight: currentFeatured === 'yes' ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
                boxShadow: currentFeatured === 'yes' ? '0 2px 8px rgba(139,26,26,0.22)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              ⭐ Nổi Bật
            </button>
          </div>

          {/* Active filter chips */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2" style={{ marginTop: '0.6rem' }}>
              {currentQ && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                  padding: '2px 10px', borderRadius: 20, fontSize: '0.78rem',
                  background: 'rgba(139,26,26,0.08)', color: '#8B1A1A',
                  border: '0.5px solid rgba(139,26,26,0.25)',
                  fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600,
                }}>
                  Tên: {currentQ}
                  <button
                    onClick={() => { setLocalQ(''); setParam('q', '') }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B1A1A', padding: 0, lineHeight: 1, marginLeft: 2 }}
                  >
                    ✕
                  </button>
                </span>
              )}
              {currentFeatured === 'yes' && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                  padding: '2px 10px', borderRadius: 20, fontSize: '0.78rem',
                  background: 'rgba(139,26,26,0.08)', color: '#8B1A1A',
                  border: '0.5px solid rgba(139,26,26,0.25)',
                  fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600,
                }}>
                  ⭐ Nổi Bật
                  <button
                    onClick={handleFeaturedToggle}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B1A1A', padding: 0, lineHeight: 1, marginLeft: 2 }}
                  >
                    ✕
                  </button>
                </span>
              )}
              {currentEra && eras.length > 0 && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                  padding: '2px 10px', borderRadius: 20, fontSize: '0.78rem',
                  background: 'rgba(196,149,106,0.12)', color: '#C4956A',
                  border: '0.5px solid rgba(196,149,106,0.35)',
                  fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600,
                }}>
                  Thời kỳ: {eras.find(e => String(e.id) === String(currentEra))?.name ?? currentEra}
                  <button
                    onClick={() => handleEraSelect('')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C4956A', padding: 0, lineHeight: 1, marginLeft: 2 }}
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Hero grid */}
        {isError ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: '#8B1A1A' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem', color: '#C4956A' }}>error_outline</span>
            <p style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600, marginBottom: '1rem' }}>
              Không thể tải dữ liệu. Vui lòng thử lại.
            </p>
            <button
              onClick={refetch}
              style={{
                padding: '0.5rem 1.5rem', background: '#8B1A1A', color: '#FDF5EE',
                border: 'none', borderRadius: 8, cursor: 'pointer',
                fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600, fontSize: '0.9rem',
              }}
            >
              Thử lại
            </button>
          </div>
        ) : isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {Array.from({ length: PAGE_SIZE }).map((_, i) => <HeroCardSkeleton key={i} />)}
          </div>
        ) : heroes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: '#A0794E' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem', color: 'rgba(196,149,106,0.45)' }}>search_off</span>
            <p style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600, fontSize: '1rem', marginBottom: '0.5rem', color: '#5C3A1E' }}>
              Không tìm thấy anh hùng nào
            </p>
            <p style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.88rem' }}>
              {hasFilters ? 'Thử thay đổi hoặc xoá bộ lọc.' : 'Hệ thống chưa có dữ liệu.'}
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                style={{
                  marginTop: '1rem', padding: '0.5rem 1.25rem',
                  background: 'none', border: '0.5px solid rgba(139,26,26,0.3)',
                  borderRadius: 8, cursor: 'pointer', color: '#8B1A1A',
                  fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600, fontSize: '0.88rem',
                }}
              >
                Xoá bộ lọc
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {heroes.map(hero => <HeroCard key={hero.id} hero={hero} />)}
          </div>
        )}

        <Pagination
          page={currentPage}
          total={totalCount}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}
