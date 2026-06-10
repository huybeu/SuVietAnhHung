// src/hooks/useArticle.js
import { useQuery } from '@tanstack/react-query'
import { articleService } from '../services/articleService'
import { queryKeys } from '../lib/queryKeys'

export function useArticle(slug) {
  return useQuery({
    queryKey: queryKeys.articles.bySlug(slug),
    queryFn:  ({ signal }) => articleService.getArticleBySlug(slug, { signal }),
    enabled:  !!slug,
    retry:    (count, err) => err?.status !== 404 && count < 2,
  })
}
