// src/hooks/useToggleArticleFeatured.js
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { articleService } from '../services/articleService'
import { queryKeys } from '../lib/queryKeys'
import { useToast } from '../components/ui/Toast'

const FEATURED_WARN_LIMIT = 5

export function useToggleArticleFeatured() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (id) => articleService.toggleFeatured(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.articles.all })

      // Snapshot all matching caches for rollback
      const snapshots = queryClient.getQueriesData({ queryKey: queryKeys.articles.all })

      // Optimistically toggle is_featured / isFeatured in every cached list
      queryClient.setQueriesData({ queryKey: queryKeys.articles.all }, (old) => {
        if (!old) return old
        // Handle paginated list shape { data: [...], total, ... }
        if (Array.isArray(old?.data)) {
          return {
            ...old,
            data: old.data.map(a =>
              a.id === id
                ? { ...a, is_featured: !(a.is_featured ?? a.isFeatured), isFeatured: !(a.is_featured ?? a.isFeatured) }
                : a
            ),
          }
        }
        // Handle single article
        if (old?.id === id) {
          return { ...old, is_featured: !(old.is_featured ?? old.isFeatured), isFeatured: !(old.is_featured ?? old.isFeatured) }
        }
        return old
      })

      return { snapshots }
    },

    onSuccess: (result, id) => {
      const isFeatured = result?.isFeatured ?? result?.is_featured
      if (isFeatured) {
        // Count featured articles across cached lists to warn if over limit
        const allLists = queryClient.getQueriesData({ queryKey: queryKeys.articles.all })
        let featuredCount = 0
        for (const [, data] of allLists) {
          if (Array.isArray(data?.data)) {
            featuredCount = Math.max(featuredCount, data.data.filter(a => a.is_featured || a.isFeatured).length)
          }
        }
        if (featuredCount > FEATURED_WARN_LIMIT) {
          toast.info(`Hiện có ${featuredCount} bài nổi bật. Nên giữ tối đa ${FEATURED_WARN_LIMIT}.`)
        }
      }
    },

    onError: (_err, _id, context) => {
      if (context?.snapshots) {
        for (const [key, data] of context.snapshots) {
          queryClient.setQueryData(key, data)
        }
      }
      toast.error('Không thể cập nhật bài nổi bật. Vui lòng thử lại.')
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all })
    },
  })
}
