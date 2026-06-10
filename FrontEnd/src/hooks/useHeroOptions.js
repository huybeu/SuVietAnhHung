// src/hooks/useHeroOptions.js
import { useQuery } from '@tanstack/react-query'
import { heroService } from '../services/heroService'
import { queryKeys } from '../lib/queryKeys'

export function useHeroOptions() {
  return useQuery({
    queryKey: [...queryKeys.heroes.all, 'options'],
    queryFn:  ({ signal }) => heroService.getHeroes({ select: 'id,name', limit: 200, sortBy: 'name', sortDir: 'asc' }, { signal }),
    staleTime: 5 * 60 * 1000,
    select: (data) => data?.data ?? data ?? [],
  })
}
