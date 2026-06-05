import { Link } from 'react-router-dom'

export default function HeroBreadcrumb({ era, heroName }) {
  return (
    <nav style={{
      position: 'sticky', top: 64, zIndex: 40,
      backdropFilter: 'blur(12px)', backgroundColor: 'rgba(10,4,2,0.85)',
      borderBottom: '1px solid rgba(246,190,59,0.18)', height: 48,
      display: 'flex', alignItems: 'center',
    }}>
      {/* Mobile: just back link */}
      <div className="sm:hidden" style={{ padding: '0 1.5rem' }}>
        <Link
          to={era ? `/anh-hung?era=${era.id}` : '/anh-hung'}
          className="font-cinzel"
          style={{ color: '#f6be3b', fontSize: '0.8rem', textDecoration: 'none' }}
        >
          ‹ {era?.name || 'Anh Hùng'}
        </Link>
      </div>

      {/* Desktop: full breadcrumb */}
      <div className="hidden sm:flex" style={{
        maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem',
        alignItems: 'center', gap: '0.35rem', width: '100%',
      }}>
        {[
          { label: 'Trang Chủ', href: '/' },
          { label: 'Anh Hùng',  href: '/anh-hung' },
          era ? { label: era.name, href: `/anh-hung?era=${era.id}` } : null,
          { label: heroName, href: null },
        ].filter(Boolean).map((item, i, arr) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {i > 0 && <span className="font-cinzel" style={{ color: 'rgba(246,190,59,0.3)', fontSize: '0.75rem' }}>›</span>}
            {item.href
              ? <Link to={item.href} className="font-cinzel" style={{ color: 'rgba(232,220,200,0.5)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color='#f6be3b'}
                  onMouseLeave={e => e.target.style.color='rgba(232,220,200,0.5)'}>{item.label}</Link>
              : <span className="font-cinzel" style={{ color: '#f2dfd6', fontSize: '0.8rem' }}>{item.label}</span>
            }
          </span>
        ))}
      </div>
    </nav>
  )
}
