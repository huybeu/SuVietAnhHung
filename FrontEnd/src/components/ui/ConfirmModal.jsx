import { useEffect, useRef } from 'react'

export default function ConfirmModal({
  isOpen, title, message,
  onConfirm, onCancel,
  variant = 'danger',
  confirmLabel = 'Xác Nhận',
  cancelLabel  = 'Huỷ',
}) {
  const confirmRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    confirmRef.current?.focus()
    function onKey(e) { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  const confirmStyle = variant === 'danger'
    ? { background: '#8B1A1A', color: '#FDF5EE' }
    : { background: '#C4956A', color: '#3D2B1A' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div style={{
        position: 'relative', width: '100%', maxWidth: 480, borderRadius: '0.85rem', padding: '1.5rem',
        background: '#FDF5EE', border: '0.5px solid #D4B896',
        boxShadow: '0 8px 32px rgba(61,43,26,0.18), 0 2px 8px rgba(61,43,26,0.08)',
      }}>
        <h3 style={{ color: '#3D2B1A', fontSize: '1.1rem', marginBottom: '0.75rem', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>{title}</h3>
        <p style={{ color: '#5C3A1E', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.5rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            style={{
              padding: '0.5rem 1rem', borderRadius: '0.5rem',
              border: '0.5px solid #D4B896', background: 'transparent',
              color: '#A0794E', cursor: 'pointer', transition: 'all 0.15s',
              fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.85rem', fontWeight: 600,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#8B1A1A'; e.currentTarget.style.color='#3D2B1A' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='#D4B896'; e.currentTarget.style.color='#A0794E' }}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            style={{
              padding: '0.5rem 1.25rem', borderRadius: '0.5rem',
              border: 'none', cursor: 'pointer', transition: 'opacity 0.15s',
              fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.85rem', fontWeight: 700,
              ...confirmStyle,
            }}
            onMouseEnter={e => e.currentTarget.style.opacity='0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity='1'}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
