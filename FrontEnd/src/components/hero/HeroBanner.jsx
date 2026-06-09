import { formatYear } from '../../lib/format'

export default function HeroBanner({ hero, era }) {
  const { name, title, birth_year, death_year, avatar_url, cover_url } = hero

  return (
    <section style={{ position: 'relative', minHeight: '70vh', overflow: 'hidden', backgroundColor: '#FDF5EE' }}>
      {/* Background cover */}
      {cover_url && (
        <img
          src={cover_url} alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }}
        />
      )}
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(253,245,238,0.1) 0%, rgba(253,245,238,0.55) 50%, #FDF5EE 100%)'
      }} />
      {/* Đông Sơn pattern */}
      <div className="dong-son-bg" style={{ position: 'absolute', inset: 0, opacity: 0.6 }} />

      {/* Era badge */}
      {era && (
        <div style={{
          position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10,
          background: 'rgba(253,245,238,0.92)', backdropFilter: 'blur(8px)',
          border: '0.5px solid #D4B896', borderRadius: '9999px',
          padding: '0.35rem 1rem',
          boxShadow: '0 2px 8px rgba(61,43,26,0.08)',
        }}>
          <span style={{ color: '#7B4A00', fontSize: '0.8rem', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
            {era.name}
          </span>
        </div>
      )}

      {/* Content */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
        maxWidth: 1100, margin: '0 auto', padding: 'clamp(1rem, 4vw, 4rem) 1.5rem clamp(2rem, 5vw, 4rem)',
        display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap',
      }}>
        {/* Avatar */}
        <div style={{ flexShrink: 0 }}>
          <div style={{
            width: 'clamp(96px,12vw,160px)', height: 'clamp(96px,12vw,160px)',
            borderRadius: '50%', overflow: 'hidden',
            border: '2px solid #8B1A1A',
            boxShadow: '0 0 24px rgba(139,26,26,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #FAE8DA, #F5D5C0)',
          }}>
            {avatar_url
              ? <img src={avatar_url} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ color: '#8B1A1A', fontSize: '2.5rem', fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
                  {name?.[0] || '?'}
                </span>
            }
          </div>
        </div>

        {/* Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingBottom: '0.5rem' }}>
          <h1 style={{
            fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#3D2B1A',
            lineHeight: 1.1, margin: 0,
            fontFamily: "'Playfair Display', serif", fontWeight: 700,
            textShadow: '0 1px 4px rgba(253,245,238,0.8)',
          }}>
            {name}
          </h1>
          {title && (
            <p style={{ color: '#C4956A', fontSize: '1.1rem', margin: 0, fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
              {title}
            </p>
          )}
          <span style={{ color: 'rgba(196,149,106,0.6)', fontSize: '0.85rem', letterSpacing: '0.15em' }}>
            ─── ✦ ───
          </span>
          {(birth_year != null || death_year != null) && (
            <p style={{ color: '#5C3A1E', fontSize: '0.85rem', letterSpacing: '0.2em', margin: 0, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              {formatYear(birth_year)} &ndash; {formatYear(death_year)}
            </p>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="bounce-arrow" style={{
        position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)',
        color: 'rgba(196,149,106,0.55)', fontSize: '1.5rem', zIndex: 10, userSelect: 'none',
      }}>↓</div>
    </section>
  )
}
