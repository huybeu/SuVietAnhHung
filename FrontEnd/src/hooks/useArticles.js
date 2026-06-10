// src/hooks/useArticles.js
import { useQuery } from '@tanstack/react-query'
import { articleService } from '../services/articleService'
import { queryKeys } from '../lib/queryKeys'

export function useArticles(params = {}) {
  return useQuery({
    queryKey: queryKeys.articles.list(params),
    queryFn:  ({ signal }) => articleService.getArticles(params, { signal }),
    placeholderData: (prev) => prev,
  })
}
