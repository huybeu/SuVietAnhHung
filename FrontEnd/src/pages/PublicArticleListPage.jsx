// src/pages/PublicArticleListPage.jsx
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useArticles } from '../hooks/useArticles'
import ArticleGrid from '../components/article/ArticleGrid'
import ArticleSearch from '../components/article/ArticleSearch'
import TagFilter from '../components/article/TagFilter'
import HeroDropdownFilter from '../components/article/HeroDropdownFilter'
import Pagination from '../components/article/Pagination'
import PageMeta from '../components/PageMeta'

const PAGE_SIZE = 12

export default function PublicArticleListPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const currentPage  = parseInt(searchParams.get('page') || '1', 10)
  const currentQ     = searchParams.get('q') || ''
  const currentHero  = searchParams.get('hero') || ''
  const currentTags  = searchParams.get('tag') ? searchParams.get('tag').split(',').filter(Boolean) : []

  // Local search state for instant UI feedback (actual search is debounced in ArticleSearch)
  const [localQ, setLocalQ] = useState(currentQ)
  useEffect(() => { setLocalQ(currentQ) }, [currentQ])

  const params = {
    status: 'published',
    page: currentPage,
    limit: PAGE_SIZE,
    sortBy: 'published_at',
    sortDir: 'desc',
    ...(currentQ   && { q: currentQ }),
    ...(currentHero && { hero: currentHero }),
    ...(currentTags.length && { tag: currentTags.join(',') }),
  }

  const { data, isLoading, isError, refetch } = useArticles(params)
  const articles   = data?.data ?? []
  const totalCount = data?.meta?.total ?? 0
  const totalPages = data?.meta?.totalPages ?? Math.ceil(totalCount / PAGE_SIZE)

  const setParam = (key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value) next.set(key, value); else next.delete(key)
      next.set('page', '1')
      return next
    })
  }

  const handleSearch = (val) => {
    setLocalQ(val)
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (val) next.set('q', val); else next.delete('q')
      next.set('page', '1')
      return next
    })
  }

  const handleTagsChange = (tags) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (tags.length) next.set('tag', tags.join(',')); else next.delete('tag')
      next.set('page', '1')
      return next
    })
  }

  const handleHeroChange = (heroId) => setParam('hero', heroId)

  const handlePageChange = (page) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.set('page', String(page))
      return next
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hasFilters = !!(currentQ || currentHero || currentTags.length)

  const clearAll = () => {
    setLocalQ('')
    setSearchParams(new URLSearchParams())
  }

  return (
    <div style={{ background: '#FDF5EE', minHeight: '100vh', paddingTop: 64 }}>
      <PageMeta
        title="Bài Viết | Sử Việt Anh Hùng"
        description="Những bài viết được chia sẻ bởi cộng đồng yêu sử Việt"
      />

      {/* Page header */}
      <div style={{
        background: 'linear-gradient(180deg, #FAE8DA 0%, #FDF5EE 100%)',
        borderBottom: '0.5px solid rgba(196,149,106,0.25)',
        padding: '3rem 1.5rem 2rem',
        textAlign: 'center',
      }}>
        <p style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C4956A', marginBottom: '0.5rem' }}>
          Cộng đồng
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 700, color: '#3D2B1A', lineHeight: 1.2, marginBottom: '0.75rem' }}>
          Bài Viết Cộng Đồng
        </h1>
        <p style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.95rem', color: '#5C3A1E', maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
          Những bài viết được chia sẻ bởi cộng đồng yêu sử Việt
        </p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Filter bar */}
        <div style={{
          background: '#FAE8DA', border: '0.5px solid rgba(196,149,106,0.3)',
          borderRadius: 14, padding: '1rem 1.25rem', marginBottom: '2rem',
        }}>
          {/* Row 1: Search + Hero + Count */}
          <div className="flex flex-wrap gap-3 items-center" style={{ marginBottom: '0.75rem' }}>
            <ArticleSearch
              value={localQ}
              onChange={handleSearch}
              totalCount={totalCount}
              isLoading={isLoading}
            />
            <HeroDropdownFilter value={currentHero} onChange={handleHeroChange} />
          </div>

          {/* Row 2: Tag filter */}
          <TagFilter selectedTags={currentTags} onChange={handleTagsChange} />

          {/* Active filter chips */}
          {hasFilters && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem', alignItems: 'center' }}>
              {currentQ && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '2px 10px', borderRadius: 20, fontSize: '0.78rem', background: 'rgba(139,26,26,0.08)', color: '#8B1A1A', border: '0.5px solid rgba(139,26,26,0.25)', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}>
                  Tìm: {currentQ}
                  <button onClick={() => handleSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B1A1A', padding: 0, marginLeft: 2 }}>✕</button>
                </span>
              )}
              <button onClick={clearAll} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B1A1A', fontSize: '0.78rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600, padding: '2px 6px', textDecoration: 'underline' }}>
                Xoá tất cả bộ lọc
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {isError ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: '#8B1A1A' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem', color: '#C4956A' }}>error_outline</span>
            <p style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600, marginBottom: '1rem' }}>Không thể tải dữ liệu. Vui lòng thử lại.</p>
            <button onClick={refetch} style={{ padding: '0.5rem 1.5rem', background: '#8B1A1A', color: '#FDF5EE', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600, fontSize: '0.9rem' }}>
              Thử lại
            </button>
          </div>
        ) : !isLoading && articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: '#A0794E' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem', color: 'rgba(196,149,106,0.45)' }}>search_off</span>
            <p style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600, fontSize: '1rem', marginBottom: '0.5rem', color: '#5C3A1E' }}>
              Không tìm thấy bài viết nào
            </p>
            <p style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.88rem' }}>
              {hasFilters ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.' : 'Chưa có bài viết nào được đăng.'}
            </p>
            {hasFilters && (
              <button onClick={clearAll} style={{ marginTop: '1rem', padding: '0.45rem 1.2rem', background: 'none', border: '0.5px solid #8B1A1A', borderRadius: 8, color: '#8B1A1A', cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600, fontSize: '0.85rem' }}>
                Xoá bộ lọc
              </button>
            )}
          </div>
        ) : (
          <ArticleGrid articles={articles} isLoading={isLoading} searchQuery={currentQ} />
        )}

        <Pagination page={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  )
}
