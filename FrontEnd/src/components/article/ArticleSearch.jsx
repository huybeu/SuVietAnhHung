// src/components/article/ArticleSearch.jsx
import { useState, useRef, useEffect } from 'react'

export default function ArticleSearch({ value, onChange, totalCount, isLoading }) {
  const [local, setLocal] = useState(value)
  const debounceRef = useRef(null)

  useEffect(() => { setLocal(value) }, [value])

  const handleChange = (val) => {
    setLocal(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => onChange(val), 300)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flex: 1 }}>
      <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 200 }}>
        <span className="material-symbols-outlined" style={{
          position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
          fontSize: 18, color: 'rgba(61,43,26,0.35)', pointerEvents: 'none',
        }}>
          search
        </span>
        <input
          type="text"
          value={local}
          onChange={e => handleChange(e.target.value)}
          placeholder="Tìm bài viết..."
          className="input-gold w-full"
          style={{ height: 40, paddingLeft: 36, paddingRight: local ? 32 : 10, fontSize: '0.88rem' }}
        />
        {local && (
          <button
            onClick={() => handleChange('')}
            style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', padding: 2,
              color: 'rgba(61,43,26,0.4)', lineHeight: 1, fontSize: '0.75rem',
            }}
          >
            ✕
          </button>
        )}
      </div>

      {!isLoading && (
        <span style={{ color: '#A0794E', fontSize: '0.82rem', fontFamily: "'Be Vietnam Pro', sans-serif", flexShrink: 0 }}>
          {totalCount?.toLocaleString('vi-VN') ?? 0} bài viết
        </span>
      )}
    </div>
  )
}
