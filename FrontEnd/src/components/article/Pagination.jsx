// src/components/article/Pagination.jsx
export default function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null

  const pages = []
  const delta = 2
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
      pages.push(i)
    }
  }
  const withEllipsis = []
  for (let i = 0; i < pages.length; i++) {
    if (i > 0 && pages[i] - pages[i - 1] > 1) withEllipsis.push('…')
    withEllipsis.push(pages[i])
  }

  const btnBase = {
    fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.85rem', fontWeight: 600,
    minWidth: 36, height: 36, border: '0.5px solid rgba(196,149,106,0.4)',
    borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s', padding: '0 0.5rem',
    background: 'none',
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        style={{ ...btnBase, color: page <= 1 ? 'rgba(61,43,26,0.25)' : '#8B1A1A', cursor: page <= 1 ? 'default' : 'pointer' }}
      >
        ‹
      </button>

      {withEllipsis.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} style={{ color: 'rgba(61,43,26,0.35)', padding: '0 0.25rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            style={{
              ...btnBase,
              background: p === page ? '#8B1A1A' : 'none',
              color: p === page ? '#FDF5EE' : '#3D2B1A',
              borderColor: p === page ? '#8B1A1A' : 'rgba(196,149,106,0.4)',
              boxShadow: p === page ? '0 2px 8px rgba(139,26,26,0.25)' : 'none',
            }}
          >
            {p}
          </button>
        )
      )}

      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        style={{ ...btnBase, color: page >= totalPages ? 'rgba(61,43,26,0.25)' : '#8B1A1A', cursor: page >= totalPages ? 'default' : 'pointer' }}
      >
        ›
      </button>
    </div>
  )
}
