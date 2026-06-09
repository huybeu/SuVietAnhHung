// src/components/article/TagFilter.jsx
import { useTags } from '../../hooks/useTags'

export default function TagFilter({ selectedTags = [], onChange }) {
  const { data: tags = [], isLoading } = useTags()

  const toggle = (slug) => {
    if (selectedTags.includes(slug)) {
      onChange(selectedTags.filter(s => s !== slug))
    } else {
      onChange([...selectedTags, slug])
    }
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse" style={{ height: 28, width: 60 + i * 12, borderRadius: 20, background: 'rgba(196,149,106,0.15)' }} />
        ))}
      </div>
    )
  }

  if (!tags.length) return null

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
      <span style={{ color: '#A0794E', fontSize: '0.78rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600, flexShrink: 0 }}>
        Tags:
      </span>
      {tags.map(tag => {
        const active = selectedTags.includes(tag.slug)
        return (
          <button
            key={tag.id || tag.slug}
            onClick={() => toggle(tag.slug)}
            style={{
              padding: '3px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600,
              fontFamily: "'Be Vietnam Pro', sans-serif", cursor: 'pointer',
              transition: 'all 0.15s',
              background: active ? '#8B1A1A' : 'transparent',
              color: active ? '#FDF5EE' : '#5C3A1E',
              border: active ? '0.5px solid #8B1A1A' : '0.5px solid rgba(196,149,106,0.5)',
              boxShadow: active ? '0 2px 8px rgba(139,26,26,0.25)' : 'none',
            }}
          >
            {tag.name}
          </button>
        )
      })}
      {selectedTags.length > 0 && (
        <button
          onClick={() => onChange([])}
          style={{
            padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600,
            fontFamily: "'Be Vietnam Pro', sans-serif", cursor: 'pointer',
            background: 'none', color: '#8B1A1A', border: '0.5px solid rgba(139,26,26,0.25)',
            transition: 'all 0.15s',
          }}
        >
          ✕ Xoá tags
        </button>
      )}
    </div>
  )
}
