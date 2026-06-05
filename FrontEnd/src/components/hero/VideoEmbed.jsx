import { useState } from 'react'
import { formatDuration } from '../../lib/format'

const PLATFORM = {
  youtube:  { label: 'YouTube',  bg: '#FF0000' },
  tiktok:   { label: 'TikTok',   bg: '#010101' },
  facebook: { label: 'Facebook', bg: '#1877F2' },
  other:    { label: 'Video',    bg: '#333333' },
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
    <div style={{ borderRadius: '0.75rem', overflow: 'hidden', background: '#1b110d', border: '1px solid rgba(246,190,59,0.15)' }}>
      {/* 16:9 container */}
      <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', background: '#000' }}>
        {!playing ? (
          <>
            {video.thumbnail_url
              ? <img src={video.thumbnail_url} alt={video.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1b110d, #0a0402)' }} />
            }
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />
            {/* Platform badge */}
            <div style={{
              position: 'absolute', top: 8, left: 8,
              background: cfg.bg, color: '#fff',
              padding: '2px 8px', borderRadius: 4, fontSize: '0.65rem',
            }} className="font-cinzel">{cfg.label}</div>
            {/* Duration */}
            {video.duration_sec != null && (
              <div style={{
                position: 'absolute', bottom: 8, right: 8,
                background: 'rgba(0,0,0,0.75)', color: '#fff',
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
                background: 'rgba(220,20,60,0.9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.2s, background 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform='scale(1.1)'; e.currentTarget.style.background='#dc143c' }}
                onMouseLeave={e => { e.currentTarget.style.transform='scale(1)';   e.currentTarget.style.background='rgba(220,20,60,0.9)' }}
              >
                <div style={{ width: 0, height: 0, borderTop: '12px solid transparent', borderBottom: '12px solid transparent', borderLeft: '20px solid white', marginLeft: 4 }} />
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
      <div style={{ padding: '0.6rem 0.85rem 0.75rem' }}>
        <div className="font-cinzel" style={{ color: '#e8dcc8', fontSize: '0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {video.title}
        </div>
        <div className="font-cinzel" style={{ color: 'rgba(232,220,200,0.35)', fontSize: '0.65rem', marginTop: 3 }}>{cfg.label}</div>
      </div>
    </div>
  )
}
