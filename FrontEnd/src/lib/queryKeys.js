/**
 * Centralized React Query cache keys.
 * Tất cả queryKey phải đến từ đây để tránh typo và đảm bảo invalidation chính xác.
 */
export const queryKeys = {
  heroes: {
    all:     ['heroes'],
    list:    (params) => ['heroes', params],
    bySlug:  (slug)   => ['hero', slug],
    count:   ()       => ['heroes-count'],
  },

  articles: {
    all:        ['articles'],
    list:       (params) => ['articles', params],
    detail:     (id)     => ['article', id],
    count:      ()       => ['articles-count'],
    draftCount: ()       => ['articles-draft-count'],
  },

  donations: {
    all:        ['donations'],
    admin:      (params) => ['donations-admin', params],
    adminStats: ()       => ['donations-admin-stats'],
    pending:    ()       => ['donations-pending'],
  },

  eras: {
    all: () => ['eras'],
  },

  videos: {
    all:    ['videos'],
    list:   (params) => ['videos', params],
    detail: (id)     => ['video', id],
  },

  siteConfig: () => ['site-config'],
}
