import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      // FE-029: retry thông minh — không retry 4xx (client error), retry tối đa 3 lần với exponential backoff
      retry: (failureCount, error) => {
        if (error?.status >= 400 && error?.status < 500) return false
        return failureCount < 3
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
      refetchOnWindowFocus: false,
    },
    mutations: { retry: 0 },
  },
})
