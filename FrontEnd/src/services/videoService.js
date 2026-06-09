import { httpClient } from '../api/httpClient'

function toQS(params) {
  const p = {}
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') p[k] = v
  })
  return new URLSearchParams(p).toString()
}

export const videoService = {
  getVideos:    (params, { signal } = {}) => httpClient.get(`/videos?${toQS(params)}`, signal),
  getVideoById: (id,     { signal } = {}) => httpClient.get(`/videos/${id}`, signal),
  createVideo:  (data)                    => httpClient.post('/videos', data),
  updateVideo:  (id, data)                => httpClient.patch(`/videos/${id}`, data),
  deleteVideo:  (id)                      => httpClient.delete(`/videos/${id}`),
}
