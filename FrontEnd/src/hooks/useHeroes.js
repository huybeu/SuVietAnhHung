// src/hooks/useHeroes.js
import { useQuery } from '@tanstack/react-query'
import { heroService } from '../services/heroService'
import { queryKeys } from '../lib/queryKeys'

export function useHeroes(params = {}) {
  return useQuery({
    queryKey: queryKeys.heroes.list(params),
    queryFn:  ({ signal }) => heroService.getHeroes(params, { signal }),
    staleTime: 60_000,
  })
}

export function useEras() {
  return useQuery({
    queryKey: queryKeys.eras.all(),
    queryFn:  ({ signal }) => heroService.getEras({ signal }),
    staleTime: 5 * 60_000,
  })
}
