import { Link } from 'react-router-dom'

export default function HeroBreadcrumb({ era, heroName }) {
  return (
    <nav style={{
      position: 'sticky', top: 64, zIndex: 40,
      backdropFilter: 'blur(12px)', backgroundColor: 'rgba(253,245,238,0.92)',
      borderBottom: '0.5px solid #D4B896', height: 48,
      display: 'flex', alignItems: 'center',
      boxShadow: '0 1px 8px rgba(61,43,26,0.06)',
    }}>
      {/* Mobile: back link */}
      <div className="sm:hidden" style={{ padding: '0 1.5rem' }}>
        <Link
          to={era ? `/anh-hung?era=${era.id}` : '/anh-hung'}
          style={{ color: '#8B1A1A', fontSize: '0.8rem', textDecoration: 'none', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
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
        ].filter(Boolean).map((item, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {i > 0 && <span style={{ color: 'rgba(196,149,106,0.5)', fontSize: '0.75rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>›</span>}
            {item.href
              ? <Link to={item.href} style={{ color: '#A0794E', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.15s', fontFamily: "'Be Vietnam Pro', sans-serif" }}
                  onMouseEnter={e => e.target.style.color='#8B1A1A'}
                  onMouseLeave={e => e.target.style.color='#A0794E'}>{item.label}</Link>
              : <span style={{ color: '#3D2B1A', fontSize: '0.8rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}>{item.label}</span>
            }
          </span>
        ))}
      </div>
    </nav>
  )
}
