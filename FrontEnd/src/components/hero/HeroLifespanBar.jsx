import { formatYear } from '../../lib/format'

export default function HeroLifespanBar({ birthYear, deathYear, era }) {
  if (birthYear == null && deathYear == null) return null
  if (!era?.year_start || !era?.year_end) return null

  const span  = era.year_end - era.year_start
  const start = birthYear ?? era.year_start
  const end   = deathYear ?? era.year_end
  const left  = Math.max(0, Math.min(95, (start - era.year_start) / span * 100))
  const width = Math.max(2, Math.min(100 - left, (end - start) / span * 100))
  const age   = birthYear != null && deathYear != null ? deathYear - birthYear : null

  return (
    <div className="glass-panel" style={{ borderRadius: '0.75rem', padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
      <div className="font-cinzel" style={{ color: '#f6be3b', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
        Cuộc Đời Anh Hùng
      </div>

      {/* Era label */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
        <span className="font-cinzel" style={{ color: 'rgba(246,190,59,0.6)', fontSize: '0.65rem' }}>{formatYear(era.year_start)}</span>
        <span className="font-cinzel" style={{ color: 'rgba(246,190,59,0.7)', fontSize: '0.65rem' }}>{era.name}</span>
        <span className="font-cinzel" style={{ color: 'rgba(246,190,59,0.6)', fontSize: '0.65rem' }}>{formatYear(era.year_end)}</span>
      </div>

      {/* Track */}
      <div style={{ position: 'relative', height: 12, backgroundColor: 'rgba(246,190,59,0.1)', borderRadius: 9999, border: '1px solid rgba(246,190,59,0.2)' }}>
        <div
          title={age ? `${era.name} · ${age} năm` : era.name}
          style={{
            position: 'absolute', top: 0, height: '100%', borderRadius: 9999,
            left: `${left}%`, width: `${width}%`,
            background: 'linear-gradient(to right, #dc143c, #f6be3b)',
            boxShadow: '0 0 8px rgba(220,20,60,0.4)',
          }}
        />
      </div>

      {/* Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
        {birthYear != null && (
          <span style={{ color: 'rgba(232,220,200,0.5)', fontSize: '0.7rem', fontFamily: 'Noto Serif, serif' }}>
            ↑ {formatYear(birthYear)}
          </span>
        )}
        {age != null && (
          <span className="font-cinzel" style={{ color: 'rgba(246,190,59,0.6)', fontSize: '0.7rem' }}>
            {age} năm
          </span>
        )}
        {deathYear != null && (
          <span style={{ color: 'rgba(232,220,200,0.5)', fontSize: '0.7rem', fontFamily: 'Noto Serif, serif' }}>
            {formatYear(deathYear)} ↑
          </span>
        )}
      </div>
    </div>
  )
}
