import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminTopbar({ title, breadcrumbs = [], actions, onMenuToggle, pendingCount = 0 }) {
  const { user } = useAuth()
  const userName = user?.displayName ?? user?.name ?? user?.username ?? 'A'

  return (
    <header style={{
      height: 64, position: 'sticky', top: 0, zIndex: 30,
      background: 'rgba(253,245,238,0.98)',
      borderBottom: '0.5px solid rgba(196,149,106,0.30)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '1rem',
      boxShadow: '0 1px 8px rgba(61,43,26,0.07)',
    }}>
      {/* Hamburger (mobile) */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(61,43,26,0.45)', padding: '0.25rem', display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.color='#8B1A1A'}
        onMouseLeave={e => e.currentTarget.style.color='rgba(61,43,26,0.45)'}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 22 }}>menu</span>
      </button>

      {/* Breadcrumbs (desktop) */}
      <nav className="hidden sm:flex items-center gap-1 flex-1 min-w-0">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {i > 0 && <span style={{ color: 'rgba(196,149,106,0.5)', fontSize: '0.75rem' }}>/</span>}
            {i < breadcrumbs.length - 1
              ? <Link to={crumb.path} style={{ color: 'rgba(61,43,26,0.45)', fontSize: '0.82rem', textDecoration: 'none', fontFamily: "'Be Vietnam Pro', sans-serif", transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color='#8B1A1A'}
                  onMouseLeave={e => e.target.style.color='rgba(61,43,26,0.45)'}>{crumb.label}</Link>
              : <span style={{ color: '#3D2B1A', fontSize: '0.82rem', fontWeight: 600, fontFamily: "'Be Vietnam Pro', sans-serif" }}>{crumb.label}</span>
            }
          </span>
        ))}
      </nav>

      {/* Mobile: title */}
      <span className="sm:hidden flex-1 truncate" style={{ fontFamily: "'Playfair Display', serif", color: '#8B1A1A', fontSize: '0.9rem' }}>{title}</span>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
        {actions}

        {/* Notifications */}
        <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(61,43,26,0.45)', display: 'flex', alignItems: 'center', padding: '0.25rem', transition: 'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color='#8B1A1A'}
          onMouseLeave={e => e.currentTarget.style.color='rgba(61,43,26,0.45)'}>
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>notifications</span>
          {pendingCount > 0 && (
            <span style={{
              position: 'absolute', top: -2, right: -2, width: 16, height: 16,
              background: '#8B1A1A', borderRadius: '50%', fontSize: '0.6rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FDF5EE', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700,
            }}>{pendingCount}</span>
          )}
        </button>

        {/* Avatar */}
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(139,26,26,0.12)',
          border: '0.5px solid rgba(196,149,106,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0,
        }}>
          <span style={{ fontFamily: "'Playfair Display', serif", color: '#8B1A1A', fontSize: '0.8rem', fontWeight: 700 }}>
            {userName[0]?.toUpperCase() ?? 'A'}
          </span>
        </div>
      </div>
    </header>
  )
}
