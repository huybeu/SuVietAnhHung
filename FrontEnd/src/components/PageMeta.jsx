import { useEffect } from 'react'

const APP_NAME = import.meta.env.VITE_APP_NAME || 'Sử Việt Anh Hùng'

function upsertMeta(selector, attr, value) {
  let el = document.querySelector(selector)
  const prev = el?.content ?? ''
  if (value) {
    if (!el) {
      el = document.createElement('meta')
      const [k, v] = attr
      el.setAttribute(k, v)
      document.head.appendChild(el)
    }
    el.content = value
  }
  return { el, prev }
}

export default function PageMeta({ title, description, image }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${APP_NAME}` : APP_NAME
    const prevTitle = document.title
    document.title = fullTitle

    const desc  = upsertMeta('meta[name="description"]',    ['name',     'description'], description)
    const ogT   = upsertMeta('meta[property="og:title"]',   ['property', 'og:title'],    fullTitle)
    const ogD   = upsertMeta('meta[property="og:description"]', ['property', 'og:description'], description)
    const ogImg = upsertMeta('meta[property="og:image"]',   ['property', 'og:image'],   image)

    return () => {
      document.title = prevTitle
      if (desc.el  && description) desc.el.content  = desc.prev
      if (ogT.el)                  ogT.el.content   = ogT.prev
      if (ogD.el   && description) ogD.el.content   = ogD.prev
      if (ogImg.el && image)       ogImg.el.content = ogImg.prev
    }
  }, [title, description, image])

  return null
}
