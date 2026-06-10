// src/hooks/useToggleFeatured.js
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { heroService } from '../services/heroService'
import { queryKeys } from '../lib/queryKeys'

/**
 * Optimistic toggle cho trạng thái "Nổi Bật" qua PATCH /heroes/:id/featured.
 * Gọi: mutation.mutate({ id, currentValue })
 * currentValue: giá trị is_featured hiện tại của hero (để đảo chiều optimistic).
 */
export function useToggleFeatured() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }) => heroService.toggleFeatured(id),

    onMutate: async ({ id, currentValue }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.heroes.all })
      const prev = queryClient.getQueriesData({ queryKey: queryKeys.heroes.all })

      queryClient.setQueriesData({ queryKey: queryKeys.heroes.all }, (old) => {
        if (!old?.data) return old
        return {
          ...old,
          data: old.data.map(h =>
            h.id === id ? { ...h, is_featured: !currentValue } : h
          ),
        }
      })

      return { prev }
    },

    onError: (_err, _vars, context) => {
      if (context?.prev) {
        context.prev.forEach(([key, data]) => queryClient.setQueryData(key, data))
      }
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.heroes.all }),
  })
}
