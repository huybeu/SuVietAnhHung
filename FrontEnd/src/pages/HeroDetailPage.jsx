import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { heroService } from '../services/heroService'
import { queryKeys } from '../lib/queryKeys'
import { formatYear } from '../lib/format'
import HeroBanner from '../components/hero/HeroBanner'
import HeroBreadcrumb from '../components/hero/HeroBreadcrumb'
import HeroLifespanBar from '../components/hero/HeroLifespanBar'
import HeroBiography from '../components/hero/HeroBiography'
import VideoEmbed from '../components/hero/VideoEmbed'
import RelatedArticles from '../components/hero/RelatedArticles'

function Skeleton() {
  return (
    <div>
      <div style={{ height: '70vh', background: '#1b110d' }} className="animate-pulse" />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem', display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[100, 80, 90, 70, 85, 60].map((w, i) => (
            <div key={i} className="animate-pulse" style={{ height: 16, background: 'rgba(246,190,59,0.08)', borderRadius: 4, width: `${w}%` }} />
          ))}
        </div>
        <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="animate-pulse" style={{ height: 120, background: 'rgba(246,190,59,0.08)', borderRadius: 12 }} />
          <div className="animate-pulse" style={{ height: 160, background: 'rgba(246,190,59,0.08)', borderRadius: 12 }} />
        </div>
      </div>
    </div>
  )
}

export default function HeroDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()

  // FE-017: redirect 404 nếu slug không hợp lệ
  useEffect(() => {
    if (!slug || !slug.trim()) {
      navigate('/404', { replace: true })
    }
  }, [slug, navigate])

  const { data: hero, isLoading, isError } = useQuery({
    queryKey: queryKeys.heroes.bySlug(slug),
    queryFn:  ({ signal }) => heroService.getHeroBySlug(slug, { signal }),
    enabled:  !!slug,
  })

  useEffect(() => {
    if (hero) document.title = `${hero.name} — ${hero.title || 'Anh Hùng Lịch Sử'} | Sử Việt Anh Hùng`
    return () => { document.title = 'Sử Việt Anh Hùng' }
  }, [hero])

  if (!slug) return null
  if (isLoading) return <Skeleton />

  if (isError || !hero) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', backgroundColor: '#0a0402' }}>
        <span style={{ fontSize: '3rem' }}>⚔</span>
        <h2 className="font-cinzel" style={{ color: '#f2dfd6', fontSize: '1.5rem' }}>Không tìm thấy anh hùng</h2>
        <Link to="/anh-hung" className="font-cinzel" style={{ color: '#f6be3b', fontSize: '0.9rem' }}>← Danh sách anh hùng</Link>
      </div>
    )
  }

  const sidebarTop = 112

  return (
    <div style={{ backgroundColor: '#0a0402', minHeight: '100vh' }}>
      <HeroBanner hero={hero} era={hero.era} />
      <HeroBreadcrumb era={hero.era} heroName={hero.name} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Biography column */}
          <div style={{ flex: '1 1 400px', minWidth: 0 }}>
            <HeroLifespanBar birthYear={hero.birth_year} deathYear={hero.death_year} era={hero.era} />
            <HeroBiography content={hero.biography} />
          </div>

          {/* Sidebar */}
          <div style={{ width: 280, flexShrink: 0, position: 'sticky', top: sidebarTop, alignSelf: 'flex-start' }}>
            <div className="glass-panel" style={{ borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1rem' }}>
              <div className="font-cinzel" style={{ color: '#f6be3b', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Thời Đại</div>
              {hero.era ? (
                <>
                  <div className="font-cinzel" style={{ color: '#f2dfd6', fontSize: '1.15rem', marginBottom: '0.25rem' }}>{hero.era.name}</div>
                  {hero.era.period && <div style={{ color: 'rgba(232,220,200,0.6)', fontSize: '0.8rem', fontFamily: 'Noto Serif, serif' }}>{hero.era.period}</div>}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <span style={{ color: 'rgba(232,220,200,0.5)', fontSize: '0.75rem' }}>{formatYear(hero.era.year_start)}</span>
                    <span style={{ color: 'rgba(246,190,59,0.3)' }}>–</span>
                    <span style={{ color: 'rgba(232,220,200,0.5)', fontSize: '0.75rem' }}>{formatYear(hero.era.year_end)}</span>
                  </div>
                  <Link to={`/anh-hung?era=${hero.era.id}`} style={{ display: 'block', marginTop: '0.75rem', color: '#dc143c', fontSize: '0.8rem', textDecoration: 'none', fontFamily: 'Cinzel, serif' }}>
                    → Xem thời đại
                  </Link>
                </>
              ) : <span style={{ color: 'rgba(232,220,200,0.4)', fontSize: '0.8rem' }}>—</span>}
            </div>

            <div className="glass-panel" style={{ borderRadius: '0.75rem', padding: '1.25rem' }}>
              <div className="font-cinzel" style={{ color: '#f6be3b', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Tiểu Sử Nhanh</div>
              {[
                { label: 'Năm sinh',  value: formatYear(hero.birth_year) },
                { label: 'Năm mất',  value: formatYear(hero.death_year) },
                { label: 'Thời đại', value: hero.era?.name || '—' },
                { label: 'Nổi bật',  value: hero.is_featured ? '⭐ Có' : 'Không' },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(246,190,59,0.08)' }}>
                  <span style={{ color: 'rgba(232,220,200,0.5)', fontSize: '0.8rem' }}>{f.label}</span>
                  <span className="font-cinzel" style={{ color: '#e8dcc8', fontSize: '0.8rem' }}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <RelatedArticles articles={hero.articles || []} />

      {hero.videos?.length > 0 && (
        <section style={{ padding: '4rem 1.5rem', backgroundColor: '#0d0705' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(246,190,59,0.3), transparent)', marginBottom: '1.25rem' }} />
              <h2 className="font-cinzel" style={{ color: '#f2dfd6', fontSize: '1.4rem', margin: 0 }}>
                <span style={{ color: '#dc143c' }}>✦</span>{' '}VIDEO LIÊN QUAN{' '}<span style={{ color: '#dc143c' }}>✦</span>
              </h2>
              <div style={{ height: 2, width: 60, background: '#dc143c', margin: '0.75rem auto 0' }} />
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
