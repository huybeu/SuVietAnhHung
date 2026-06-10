// src/hooks/useTags.js
import { useQuery } from '@tanstack/react-query'
import { articleService } from '../services/articleService'
import { queryKeys } from '../lib/queryKeys'

export function useTags() {
  return useQuery({
    queryKey: queryKeys.articleTags.all(),
    queryFn:  ({ signal }) => articleService.getTags({ signal }),
    select:   (res) => res?.data ?? [],
    staleTime: 5 * 60 * 1000,
  })
}
