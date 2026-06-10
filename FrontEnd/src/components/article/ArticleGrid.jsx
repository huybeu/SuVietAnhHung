// src/components/article/ArticleGrid.jsx
import ArticleCard from './ArticleCard'
import ArticleSkeleton from './ArticleSkeleton'

const SKELETON_COUNT = 12

export default function ArticleGrid({ articles, isLoading, searchQuery = '' }) {
  if (isLoading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => <ArticleSkeleton key={i} />)}
      </div>
    )
  }

  if (!articles?.length) return null

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} searchQuery={searchQuery} />
      ))}
    </div>
  )
}
