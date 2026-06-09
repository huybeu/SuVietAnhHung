// src/components/hero/FeaturedBadge.jsx
export default function FeaturedBadge({ style }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.2rem',
        padding: '2px 8px',
        borderRadius: 20,
        background: 'linear-gradient(135deg, #8B1A1A 0%, #C4956A 100%)',
        color: '#FDF5EE',
        fontSize: '0.65rem',
        fontWeight: 700,
        fontFamily: "'Be Vietnam Pro', sans-serif",
        letterSpacing: '0.04em',
        boxShadow: '0 2px 6px rgba(139,26,26,0.28)',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        ...style,
      }}
    >
      ⭐ Nổi Bật
    </span>
  )
}
