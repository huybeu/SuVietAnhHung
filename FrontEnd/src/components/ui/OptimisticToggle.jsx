import { useState, useEffect } from 'react'

export default function OptimisticToggle({ value, onChange, disabled, label, className = '' }) {
  const [localValue, setLocalValue] = useState(value)
  const [pending, setPending]       = useState(false)
  const [error, setError]           = useState(false)

  useEffect(() => { setLocalValue(value) }, [value])

  async function handleClick() {
    if (pending || disabled) return
    const next = !localValue
    setLocalValue(next)
    setPending(true)
    setError(false)
    try {
      await onChange(next)
    } catch {
      setLocalValue(!next)
      setError(true)
      setTimeout(() => setError(false), 2000)
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      title={label}
      className={`relative inline-flex w-11 h-6 rounded-full transition-colors focus:outline-none
        ${localValue ? 'bg-[#dc143c]' : 'bg-[#1b110d] border border-[#f6be3b]/30'}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${error ? 'toggle-error ring-2 ring-red-500' : ''}
        ${className}`}
      aria-checked={localValue}
      role="switch"
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform flex items-center justify-center
        ${localValue ? 'translate-x-5' : 'translate-x-0'}`}>
        {pending && (
          <span className="w-3 h-3 border-2 border-[#f6be3b] border-t-transparent rounded-full animate-spin" />
        )}
      </span>
    </button>
  )
}
