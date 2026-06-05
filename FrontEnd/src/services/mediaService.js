import { httpClient } from '../api/httpClient'

function toQS(params) {
  const p = {}
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') p[k] = v
  })
  return new URLSearchParams(p).toString()
}

export const mediaService = {
  getMedia: (params, { signal } = {}) => httpClient.get(`/media?${toQS(params)}`, signal),
  uploadMedia: (file) => {
    const fd = new FormData()
    fd.append('file', file)
    return httpClient.post('/media', fd)
  },
}
