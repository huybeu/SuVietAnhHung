// src/hooks/useHero.js
import { useQuery } from '@tanstack/react-query'
import { heroService } from '../services/heroService'
import { queryKeys } from '../lib/queryKeys'

export function useHero(slug) {
  return useQuery({
    queryKey: queryKeys.heroes.bySlug(slug),
    queryFn:  ({ signal }) => heroService.getHeroBySlug(slug, { signal }),
    enabled:  !!slug,
    retry:    (count, err) => err?.status !== 404 && count < 2,
  })
}
