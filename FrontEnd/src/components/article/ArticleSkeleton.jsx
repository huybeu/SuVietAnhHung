// src/components/article/ArticleSkeleton.jsx
export default function ArticleSkeleton() {
  return (
    <div
      className="animate-pulse rounded-2xl overflow-hidden"
      style={{ background: '#FAE8DA', border: '0.5px solid rgba(196,149,106,0.3)' }}
    >
      <div style={{ height: 180, background: 'rgba(196,149,106,0.18)' }} />
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ height: 14, background: 'rgba(196,149,106,0.22)', borderRadius: 4, width: '80%' }} />
        <div style={{ height: 11, background: 'rgba(196,149,106,0.15)', borderRadius: 4, width: '95%' }} />
        <div style={{ height: 11, background: 'rgba(196,149,106,0.15)', borderRadius: 4, width: '70%' }} />
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem' }}>
          <div style={{ height: 20, width: 48, background: 'rgba(196,149,106,0.12)', borderRadius: 20 }} />
          <div style={{ height: 20, width: 56, background: 'rgba(196,149,106,0.12)', borderRadius: 20 }} />
        </div>
        <div style={{ height: 10, background: 'rgba(196,149,106,0.10)', borderRadius: 4, width: '40%', marginTop: '0.25rem' }} />
      </div>
    </div>
  )
}
