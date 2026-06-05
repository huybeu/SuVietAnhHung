import { createContext, useContext, useState, useCallback, useRef } from 'react'

const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const counter = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t))
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 320)
  }, [])

  const add = useCallback((message, type = 'info') => {
    const id = ++counter.current
    setToasts(prev => [...prev, { id, message, type, exiting: false }])
    setTimeout(() => dismiss(id), 3000)
  }, [dismiss])

  const toast = {
    success: (msg) => add(msg, 'success'),
    error:   (msg) => add(msg, 'error'),
    info:    (msg) => add(msg, 'info'),
  }

  const TYPE_STYLE = {
    success: 'border-l-4 border-green-500',
    error:   'border-l-4 border-[#dc143c]',
    info:    'border-l-4 border-[#f6be3b]',
  }
  const TYPE_ICON = { success: '✓', error: '✕', info: 'ℹ' }

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`glass-panel pointer-events-auto px-4 py-3 rounded-lg flex items-center gap-3 min-w-64 max-w-sm shadow-xl
              ${TYPE_STYLE[t.type]} ${t.exiting ? 'toast-exit' : 'toast-enter'}`}
          >
            <span className="text-sm font-bold flex-shrink-0"
              style={{ color: t.type === 'success' ? '#4ade80' : t.type === 'error' ? '#dc143c' : '#f6be3b' }}>
              {TYPE_ICON[t.type]}
            </span>
            <span className="text-[#e8dcc8] text-sm flex-1">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="text-[#e8dcc8]/40 hover:text-[#e8dcc8] text-xs ml-1">✕</button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
