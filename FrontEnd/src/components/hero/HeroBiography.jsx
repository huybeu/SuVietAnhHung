import DOMPurify from 'dompurify'

export default function HeroBiography({ content }) {
  if (!content) return null
  const clean = DOMPurify.sanitize(content, { USE_PROFILES: { html: true } })
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <div
        className="hero-prose"
        style={{ color: '#e8dcc8', lineHeight: 1.9, maxWidth: '68ch', fontFamily: 'Noto Serif, serif' }}
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    </section>
  )
}
