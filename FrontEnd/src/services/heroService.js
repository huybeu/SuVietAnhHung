import { httpClient } from '../api/httpClient'

function toQS(params) {
  const p = {}
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') p[k] = v
  })
  return new URLSearchParams(p).toString()
}

export const heroService = {
  getHeroes:     (params, { signal } = {}) => httpClient.get(`/heroes?${toQS(params)}`, signal),
  getHeroBySlug: (slug,   { signal } = {}) => httpClient.get(`/heroes/slug/${slug}`, signal),
  getEras:       (        { signal } = {}) => httpClient.get('/eras', signal),
  createHero:    (data)                    => httpClient.post('/heroes', data),
  updateHero:    (id, data)                => httpClient.patch(`/heroes/${id}`, data),
  deleteHero:    (id)                      => httpClient.delete(`/heroes/${id}`),
  reorderHeroes:  (ids)                    => httpClient.patch('/heroes/reorder', { ids }),
  toggleFeatured: (id)                     => httpClient.patch(`/heroes/${id}/featured`),
}
