import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { heroService } from '../services/heroService'
import { queryKeys } from '../lib/queryKeys'
import { formatYear } from '../lib/format'
import PageMeta from '../components/PageMeta'
import HeroBanner from '../components/hero/HeroBanner'
import HeroBreadcrumb from '../components/hero/HeroBreadcrumb'
import HeroLifespanBar from '../components/hero/HeroLifespanBar'
import HeroBiography from '../components/hero/HeroBiography'
import VideoEmbed from '../components/hero/VideoEmbed'
import RelatedArticles from '../components/hero/RelatedArticles'

function Skeleton() {
  return (
    <div style={{ background: '#FDF5EE' }}>
      <div style={{ height: '70vh', background: 'linear-gradient(180deg, #FAE8DA, #F5D5C0)' }} className="animate-pulse" />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem', display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[100, 80, 90, 70, 85, 60].map((w, i) => (
            <div key={i} className="animate-pulse" style={{ height: 16, background: 'rgba(196,149,106,0.18)', borderRadius: 4, width: `${w}%` }} />
          ))}
        </div>
        <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="animate-pulse" style={{ height: 120, background: 'rgba(196,149,106,0.12)', borderRadius: 12 }} />
          <div className="animate-pulse" style={{ height: 160, background: 'rgba(196,149,106,0.12)', borderRadius: 12 }} />
        </div>
      </div>
    </div>
  )
}

export default function HeroDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!slug || !slug.trim()) {
      navigate('/404', { replace: true })
    }
  }, [slug, navigate])

  const { data: heroResponse, isLoading, isError } = useQuery({
    queryKey: queryKeys.heroes.bySlug(slug),
    queryFn:  ({ signal }) => heroService.getHeroBySlug(slug, { signal }),
    enabled:  !!slug,
  })
  const hero = heroResponse?.data

  // document.title / og tags handled by <PageMeta> below

  if (!slug) return null
  if (isLoading) return <Skeleton />

  if (isError || !hero) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '1rem',
        backgroundColor: '#FDF5EE', color: '#3D2B1A',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#C4956A' }}>sentiment_dissatisfied</span>
        <h2 style={{ color: '#3D2B1A', fontSize: '1.5rem', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>Không tìm thấy anh hùng</h2>
        <Link to="/anh-hung" style={{ color: '#8B1A1A', fontSize: '0.9rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}>← Danh sách anh hùng</Link>
      </div>
    )
  }

  const sidebarTop = 112

  const metaTitle = hero ? `${hero.name} — ${hero.title || 'Anh Hùng Lịch Sử'}` : ''
  const metaDesc  = hero ? (hero.biography ? hero.biography.replace(/<[^>]+>/g, '').slice(0, 160) : `Tìm hiểu về anh hùng ${hero.name}`) : ''

  return (
    <div style={{ backgroundColor: '#FDF5EE', minHeight: '100vh' }}>
      <PageMeta title={metaTitle} description={metaDesc} image={hero.avatar_url || hero.image_url} />
      <HeroBanner hero={hero} era={hero.era} />
      <HeroBreadcrumb era={hero.era} heroName={hero.name} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem 3rem' }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Biography column */}
          <div style={{ flex: '1 1 400px', minWidth: 0 }}>
            <HeroLifespanBar birthYear={hero.birth_year} deathYear={hero.death_year} era={hero.era} />

            {/* Mô tả chi tiết */}
            {hero.biography ? (
              <HeroBiography content={hero.biography} />
            ) : (
              <div style={{
                marginBottom: '2.5rem',
                padding: '2rem',
                background: 'rgba(196,149,106,0.06)',
                border: '0.5px solid rgba(196,149,106,0.2)',
                borderRadius: '0.75rem',
                color: '#A0794E',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: '0.9rem',
                textAlign: 'center',
              }}>
                Chưa có mô tả chi tiết về anh hùng này.
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ width: 280, flexShrink: 0, position: 'sticky', top: sidebarTop, alignSelf: 'flex-start' }}>
            {/* Era card */}
            <div style={{
              background: '#FDF5EE', border: '0.5px solid #D4B896', borderRadius: '0.75rem',
              padding: '1.25rem', marginBottom: '1rem',
              boxShadow: '0 2px 12px rgba(61,43,26,0.07)',
            }}>
              <div style={{ color: '#C4956A', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>Thời Đại</div>
              {hero.era ? (
                <>
                  <div style={{ color: '#3D2B1A', fontSize: '1.15rem', marginBottom: '0.25rem', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>{hero.era.name}</div>
                  {hero.era.period && <div style={{ color: '#5C3A1E', fontSize: '0.8rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{hero.era.period}</div>}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <span style={{ color: '#A0794E', fontSize: '0.75rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{formatYear(hero.era.year_start)}</span>
                    <span style={{ color: 'rgba(196,149,106,0.45)' }}>–</span>
                    <span style={{ color: '#A0794E', fontSize: '0.75rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{formatYear(hero.era.year_end)}</span>
                  </div>
                  <Link to={`/anh-hung?era=${hero.era.id}`} style={{ display: 'block', marginTop: '0.75rem', color: '#8B1A1A', fontSize: '0.8rem', textDecoration: 'none', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}
                    onMouseEnter={e => e.target.style.color='#6B1414'}
                    onMouseLeave={e => e.target.style.color='#8B1A1A'}>
                    → Xem thời đại
                  </Link>
                </>
              ) : <span style={{ color: '#A0794E', fontSize: '0.8rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>—</span>}
            </div>

            {/* Quick facts card */}
            <div style={{
              background: '#FDF5EE', border: '0.5px solid #D4B896', borderRadius: '0.75rem',
              padding: '1.25rem', boxShadow: '0 2px 12px rgba(61,43,26,0.07)',
            }}>
              <div style={{ color: '#C4956A', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>Tiểu Sử Nhanh</div>
              {[
                { label: 'Năm sinh',  value: formatYear(hero.birth_year) },
                { label: 'Năm mất',  value: formatYear(hero.death_year) },
                { label: 'Thời đại', value: hero.era?.name || '—' },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '0.5px solid rgba(212,184,150,0.5)' }}>
                  <span style={{ color: '#A0794E', fontSize: '0.8rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{f.label}</span>
                  <span style={{ color: '#3D2B1A', fontSize: '0.8rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500 }}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <RelatedArticles articles={hero.articles || []} heroId={hero.id} heroName={hero.name} />

      {hero.videos?.length > 0 && (
        <section style={{ padding: '4rem 1.5rem', background: '#FAE8DA', borderTop: '0.5px solid #D4B896' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(196,149,106,0.4), transparent)', marginBottom: '1.25rem' }} />
              <p style={{ color: '#8B1A1A', fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}>
                KHO TƯ LIỆU
              </p>
              <h2 style={{ color: '#3D2B1A', fontSize: '1.4rem', margin: 0, fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                Video Liên Quan
              </h2>
              <div style={{ height: 2, width: 60, background: '#8B1A1A', margin: '0.75rem auto 0', opacity: 0.5 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {hero.videos.map(v => <VideoEmbed key={v.id} video={v} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
