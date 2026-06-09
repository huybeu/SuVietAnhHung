import { useState } from 'react'
import { formatDuration } from '../../lib/format'

const PLATFORM = {
  youtube:  { label: 'YouTube',  bg: '#FF0000' },
  tiktok:   { label: 'TikTok',   bg: '#010101' },
  facebook: { label: 'Facebook', bg: '#1877F2' },
  other:    { label: 'Video',    bg: '#5C3A1E' },
}

function getEmbedUrl(video) {
  if (video.embed_url) {
    return video.platform === 'youtube'
      ? video.embed_url.replace('watch?v=', 'embed/') + (video.embed_url.includes('?') ? '&' : '?') + 'autoplay=1&rel=0'
      : video.embed_url
  }
  if (video.platform === 'youtube' && video.url) {
    const m = video.url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)
    if (m) return `https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0`
  }
  return video.url || ''
}

export default function VideoEmbed({ video }) {
  const [playing, setPlaying] = useState(false)
  const cfg = PLATFORM[video.platform] || PLATFORM.other

  return (
    <div className="video-thumb" style={{ borderRadius: '0.75rem', overflow: 'hidden', background: '#FAE8DA', border: '0.5px solid #D4B896', boxShadow: '0 2px 12px rgba(61,43,26,0.07)' }}>
      {/* 16:9 container */}
      <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', background: '#F5D5C0' }}>
        {!playing ? (
          <>
            {video.thumbnail_url
              ? <img src={video.thumbnail_url} alt={video.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #FAE8DA, #F5D5C0)' }} />
            }
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(61,43,26,0.3), transparent)' }} />
            {/* Platform badge */}
            <div style={{
              position: 'absolute', top: 8, left: 8,
              background: cfg.bg, color: '#fff',
              padding: '2px 8px', borderRadius: 4, fontSize: '0.65rem',
              fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600,
            }}>{cfg.label}</div>
            {/* Duration */}
            {video.duration_sec != null && (
              <div style={{
                position: 'absolute', bottom: 8, right: 8,
                background: 'rgba(61,43,26,0.75)', color: '#FDF5EE',
                padding: '2px 6px', borderRadius: 4, fontSize: '0.7rem', fontFamily: 'monospace',
              }}>{formatDuration(video.duration_sec)}</div>
            )}
            {/* Play button */}
            <button
              onClick={() => setPlaying(true)}
              style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'transparent', border: 'none', cursor: 'pointer',
              }}
            >
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'rgba(139,26,26,0.88)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.2s, background 0.2s',
                boxShadow: '0 4px 20px rgba(139,26,26,0.35)',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform='scale(1.1)'; e.currentTarget.style.background='#8B1A1A' }}
                onMouseLeave={e => { e.currentTarget.style.transform='scale(1)';   e.currentTarget.style.background='rgba(139,26,26,0.88)' }}
              >
                <div style={{ width: 0, height: 0, borderTop: '12px solid transparent', borderBottom: '12px solid transparent', borderLeft: '20px solid #FDF5EE', marginLeft: 4 }} />
              </div>
            </button>
          </>
        ) : (
          <iframe
            src={getEmbedUrl(video)}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
      {/* Title */}
      <div style={{ padding: '0.6rem 0.85rem 0.75rem', background: '#FDF5EE' }}>
        <div style={{ color: '#3D2B1A', fontSize: '0.85rem', fontFamily: "'Playfair Display', serif", fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {video.title}
        </div>
        <div style={{ color: '#A0794E', fontSize: '0.65rem', marginTop: 3, fontFamily: "'Be Vietnam Pro', sans-serif" }}>{cfg.label}</div>
      </div>
    </div>
  )
}
