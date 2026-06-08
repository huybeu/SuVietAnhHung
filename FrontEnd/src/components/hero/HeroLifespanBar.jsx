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
    <div style={{
      background: '#FDF5EE', border: '0.5px solid #D4B896', borderRadius: '0.75rem',
      padding: '1.25rem 1.5rem', marginBottom: '1.5rem',
      boxShadow: '0 2px 12px rgba(61,43,26,0.07)',
    }}>
      <div style={{ color: '#C4956A', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
        Cuộc Đời Anh Hùng
      </div>

      {/* Era label */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
        <span style={{ color: '#A0794E', fontSize: '0.65rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{formatYear(era.year_start)}</span>
        <span style={{ color: '#7B4A00', fontSize: '0.65rem', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>{era.name}</span>
        <span style={{ color: '#A0794E', fontSize: '0.65rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{formatYear(era.year_end)}</span>
      </div>

      {/* Track */}
      <div style={{ position: 'relative', height: 12, backgroundColor: 'rgba(61,43,26,0.08)', borderRadius: 9999, border: '0.5px solid #D4B896' }}>
        <div
          title={age ? `${era.name} · ${age} năm` : era.name}
          style={{
            position: 'absolute', top: 0, height: '100%', borderRadius: 9999,
            left: `${left}%`, width: `${width}%`,
            background: 'linear-gradient(to right, #8B1A1A, #C4956A)',
            boxShadow: '0 0 6px rgba(139,26,26,0.3)',
          }}
        />
      </div>

      {/* Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
        {birthYear != null && (
          <span style={{ color: '#5C3A1E', fontSize: '0.7rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            ↑ {formatYear(birthYear)}
          </span>
        )}
        {age != null && (
          <span style={{ color: '#A0794E', fontSize: '0.7rem', fontFamily: "'Playfair Display', serif" }}>
            {age} năm
          </span>
        )}
        {deathYear != null && (
          <span style={{ color: '#5C3A1E', fontSize: '0.7rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            {formatYear(deathYear)} ↑
          </span>
        )}
      </div>
    </div>
  )
}
