/**
 * Compatibility shim — re-exports từ service layer.
 * Các module mới nên import trực tiếp từ services/ thay vì từ file này.
 */
import { heroService }     from '../services/heroService'
import { articleService }  from '../services/articleService'
import { donationService } from '../services/donationService'
import { mediaService }    from '../services/mediaService'
import { httpClient }      from '../api/httpClient'

function toQS(params) {
  const p = {}
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') p[k] = v
  })
  return new URLSearchParams(p).toString()
}

// ── Heroes ────────────────────────────────────────────────────────────────────
export const fetchHeroBySlug = (slug)   => heroService.getHeroBySlug(slug)
export const fetchHeroes     = (params) => heroService.getHeroes(params)
export const fetchEras       = ()       => heroService.getEras()
export const createHero      = (data)   => heroService.createHero(data)
export const updateHero      = (id, d)  => heroService.updateHero(id, d)
export const deleteHero      = (id)     => heroService.deleteHero(id)
export const reorderHeroes   = (ids)    => heroService.reorderHeroes(ids)

// ── Articles ──────────────────────────────────────────────────────────────────
export const fetchArticleBySlug = (slug)   => articleService.getArticleBySlug(slug)
export const fetchArticles      = (params) => articleService.getArticles(params)
export const fetchArticleAdmin  = (id)     => articleService.getArticleById(id)
export const createArticle      = (data)   => articleService.createArticle(data)
export const updateArticle      = (id, d)  => articleService.updateArticle(id, d)
export const deleteArticle      = (id)     => articleService.deleteArticle(id)

// ── Donations ─────────────────────────────────────────────────────────────────
export const fetchDonationTiers = ()       => donationService.getDonationTiers()
export const fetchDonations     = (params) => donationService.getDonations(params)
export const createDonation     = (data)   => donationService.createDonation(data)

// ── Media ─────────────────────────────────────────────────────────────────────
export const fetchMedia  = (params) => mediaService.getMedia(params)
export const uploadMedia = (file)   => mediaService.uploadMedia(file)

// ── Misc (dùng httpClient trực tiếp vì chưa có service riêng) ────────────────
export const fetchVideos      = (params) => httpClient.get(`/videos?${toQS(params)}`)
export const fetchSiteConfig  = ()       => httpClient.get('/site-config')
export const updateSiteConfig = (key, v) => httpClient.patch(`/site-config/${key}`, { value: v })
export const fetchUsers       = ()       => httpClient.get('/users')
