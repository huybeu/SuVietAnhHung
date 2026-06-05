import { formatYear } from '../../lib/format'

export default function HeroBanner({ hero, era }) {
  const { name, title, birth_year, death_year, avatar_url, cover_url } = hero

  return (
    <section style={{ position: 'relative', minHeight: '70vh', overflow: 'hidden', backgroundColor: '#0a0402' }}>
      {/* Background cover */}
      {cover_url && (
        <img
          src={cover_url} alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }}
        />
      )}
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, transparent 20%, rgba(10,4,2,0.6) 55%, #0a0402 100%)'
      }} />
      {/* Pattern overlay */}
      <div className="dong-son-bg" style={{ position: 'absolute', inset: 0, opacity: 0.12 }} />

      {/* Era badge */}
      {era && (
        <div style={{
          position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10,
          background: 'rgba(26,17,13,0.85)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(246,190,59,0.35)', borderRadius: '9999px',
          padding: '0.35rem 1rem',
        }}>
          <span className="font-cinzel" style={{ color: '#f6be3b', fontSize: '0.8rem' }}>
            {era.name}
          </span>
        </div>
      )}

      {/* Content */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
        maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem 4rem',
        display: 'flex', gap: '1.5rem', alignItems: 'flex-end',
      }}>
        {/* Avatar */}
        <div style={{ flexShrink: 0 }}>
          <div style={{
            width: 'clamp(96px,12vw,160px)', height: 'clamp(96px,12vw,160px)',
            borderRadius: '50%', overflow: 'hidden',
            border: '2px solid #dc143c',
            boxShadow: '0 0 24px rgba(220,20,60,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #dc143c, #8b0000)',
          }}>
            {avatar_url
              ? <img src={avatar_url} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span className="font-cinzel" style={{ color: '#f6be3b', fontSize: '2.5rem', fontWeight: 700 }}>
                  {name?.[0] || '?'}
                </span>
            }
          </div>
        </div>

        {/* Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingBottom: '0.5rem' }}>
          <h1 className="font-cinzel" style={{
            fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#f2dfd6',
            lineHeight: 1.1, margin: 0, textShadow: '0 2px 12px rgba(0,0,0,0.6)',
          }}>
            {name}
          </h1>
          {title && (
            <p className="font-cinzel" style={{ color: '#f6be3b', fontSize: '1.1rem', margin: 0 }}>
              {title}
            </p>
          )}
          <span style={{ color: 'rgba(232,220,200,0.5)', fontSize: '0.85rem', letterSpacing: '0.15em' }}>
            ─── ✦ ───
          </span>
          {(birth_year != null || death_year != null) && (
            <p style={{ color: 'rgba(232,220,200,0.75)', fontSize: '0.85rem', letterSpacing: '0.2em', margin: 0, fontFamily: 'Noto Serif, serif' }}>
              {formatYear(birth_year)} &ndash; {formatYear(death_year)}
            </p>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="bounce-arrow" style={{
        position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)',
        color: 'rgba(246,190,59,0.4)', fontSize: '1.5rem', zIndex: 10, userSelect: 'none',
      }}>↓</div>
    </section>
  )
}
