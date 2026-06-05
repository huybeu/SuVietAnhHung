import { useEffect } from 'react'

const APP_NAME = import.meta.env.VITE_APP_NAME || 'Sử Việt Anh Hùng'

/**
 * Cập nhật document.title và meta description cho từng page.
 * Cleanup tự động khi component unmount.
 */
export default function PageMeta({ title, description }) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title ? `${title} | ${APP_NAME}` : APP_NAME

    let metaEl = document.querySelector('meta[name="description"]')
    const prevDesc = metaEl?.content ?? ''

    if (description) {
      if (!metaEl) {
        metaEl = document.createElement('meta')
        metaEl.name = 'description'
        document.head.appendChild(metaEl)
      }
      metaEl.content = description
    }

    return () => {
      document.title = prevTitle
      if (metaEl && description) metaEl.content = prevDesc
    }
  }, [title, description])

  return null
}
