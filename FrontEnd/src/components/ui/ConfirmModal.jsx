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

  const confirmCls = variant === 'danger'
    ? 'bg-[#dc143c] hover:bg-[#8b0000] text-white'
    : 'bg-[#f6be3b] hover:bg-[#e0aa2a] text-[#0a0402]'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
      <div className="glass-panel relative w-full max-w-md rounded-xl p-6 shadow-2xl">
        <h3 className="font-cinzel text-[#f2dfd6] text-lg mb-3">{title}</h3>
        <p className="text-[#e8dcc8]/80 text-sm leading-relaxed mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-[#f6be3b]/30 text-[#e8dcc8]/70 hover:border-[#f6be3b]/60 hover:text-[#e8dcc8] font-cinzel text-sm transition"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg font-cinzel text-sm transition ${confirmCls}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
