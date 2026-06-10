import { httpClient } from '../api/httpClient'

function toQS(params) {
  const p = {}
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') p[k] = v
  })
  return new URLSearchParams(p).toString()
}

export const articleService = {
  getArticles:        (params, { signal } = {}) => httpClient.get(`/articles?${toQS(params)}`, signal),
  getArticleById:     (id,     { signal } = {}) => httpClient.get(`/articles/${id}`, signal),
  getArticleBySlug:   (slug,   { signal } = {}) => httpClient.get(`/articles/slug/${slug}`, signal),
  createArticle:      (data)                    => httpClient.post('/articles', data),
  updateArticle:      (id, data)                => httpClient.patch(`/articles/${id}`, data),
  deleteArticle:      (id)                      => httpClient.delete(`/articles/${id}`),
  getTags:            ({ signal } = {})         => httpClient.get('/tags', signal),
  toggleFeatured:     (id)                      => httpClient.patch(`/articles/${id}/featured`),
}
