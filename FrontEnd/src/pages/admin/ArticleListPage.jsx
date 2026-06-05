import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams, useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable from '../../components/ui/DataTable'
import StatusBadge from '../../components/ui/StatusBadge'
import ConfirmModal from '../../components/ui/ConfirmModal'
import ViewerBanner from '../../components/admin/ViewerBanner'
import { can, useRole } from '../../lib/permissions'
import { articleService } from '../../services/articleService'
import { queryKeys }       from '../../lib/queryKeys'
import { formatDateShort } from '../../lib/format'

// ── Filter Bar ────────────────────────────────────────────────────────────────
function ArticleFilterBar({ searchParams, setSearchParams }) {
  const [localQ, setLocalQ] = useState(searchParams.get('q') || '')
  const debounceRef = useRef(null)

  const setParam = (key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value && value !== 'all') next.set(key, value)
      else next.delete(key)
      next.set('page', '1')
      return next
    })
  }

  const handleSearch = (val) => {
    setLocalQ(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev)
        if (val) next.set('q', val)
        else next.delete('q')
        next.set('page', '1')
        return next
      })
    }, 300)
  }

  const clearAll = () => { setLocalQ(''); setSearchParams(new URLSearchParams()) }
  const activeStatus = searchParams.get('status') || 'all'
  const hasFilters = !!(searchParams.get('q') || activeStatus !== 'all')

  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2" style={{ fontSize: '18px', color: 'rgba(61,43,26,0.35)' }}>search</span>
          <input className="input-gold pl-9 pr-3 py-2 text-sm w-full" placeholder="Tìm kiếm bài viết..." value={localQ} onChange={e => handleSearch(e.target.value)} />
        </div>
        <select className="input-gold py-2 px-3 text-sm min-w-[160px] cursor-pointer" value={activeStatus} onChange={e => setParam('status', e.target.value)}>
          <option value="all">Trạng thái: Tất cả</option>
          <option value="published">Đã xuất bản</option>
          <option value="draft">Nháp</option>
          <option value="archived">Lưu kho</option>
        </select>
        {hasFilters && (
          <button onClick={clearAll} className="text-sm flex items-center gap-1 transition-colors" style={{ color: '#8B1A1A', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.color='#C4956A'} onMouseLeave={e => e.currentTarget.style.color='#8B1A1A'}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>filter_alt_off</span>
            Xoá bộ lọc
          </button>
        )}
      </div>
      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {searchParams.get('q') && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(139,26,26,0.08)', color: '#8B1A1A', border: '0.5px solid rgba(139,26,26,0.25)' }}>
              Tìm: {searchParams.get('q')}
              <button onClick={() => { setLocalQ(''); setParam('q', '') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B1A1A', marginLeft: '0.25rem' }}>✕</button>
            </span>
          )}
          {activeStatus !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(196,149,106,0.12)', color: '#C4956A', border: '0.5px solid rgba(196,149,106,0.35)' }}>
              {activeStatus === 'published' ? 'Đã xuất bản' : activeStatus === 'draft' ? 'Nháp' : 'Lưu kho'}
              <button onClick={() => setParam('status', 'all')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C4956A', marginLeft: '0.25rem' }}>✕</button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ArticleListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const role = useRole()

  const [selectedIds, setSelectedIds] = useState(new Set())
  const [confirmDelete, setConfirmDelete] = useState(null)

  const currentPage = parseInt(searchParams.get('page') || '1')

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.articles.list(Object.fromEntries(searchParams)),
    queryFn:  ({ signal }) => articleService.getArticles({
      q:       searchParams.get('q') || '',
      status:  searchParams.get('status') || '',
      page:    currentPage,
      pageSize: 20,
      sortBy:  searchParams.get('sortBy') || '',
      sortDir: searchParams.get('sortDir') || 'desc',
    }, { signal }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => articleService.deleteArticle(id),
    onSuccess:  () => {
      setConfirmDelete(null)
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all })
    },
  })

  const publishMutation = useMutation({
    mutationFn: ({ id, status }) => articleService.updateArticle(id, { status }),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: queryKeys.articles.all }),
  })

  const handlePageChange = (page) => {
    setSearchParams(prev => { const next = new URLSearchParams(prev); next.set('page', String(page)); return next })
  }

  const handleSortChange = (sortBy, sortDir) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (sortBy) { next.set('sortBy', sortBy); next.set('sortDir', sortDir) }
      else { next.delete('sortBy'); next.delete('sortDir') }
      next.set('page', '1')
      return next
    })
  }

  const articles = data?.data || []

  const columns = [
    {
      key: 'title',
      header: 'Tiêu Đề',
      sortable: true,
      render: (row) => (
        <div className="max-w-xs">
          <div style={{ color: '#3D2B1A', fontSize: '0.88rem', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}>{row.title}</div>
          {row.excerpt && <div style={{ color: '#A0794E', fontSize: '0.75rem', marginTop: '0.15rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{row.excerpt}</div>}
        </div>
      ),
    },
    { key: 'status', header: 'Trạng Thái', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'author', header: 'Tác Giả', render: (row) => <span style={{ color: '#5C3A1E', fontSize: '0.85rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{row.author?.username || row.author?.name || '—'}</span> },
    {
      key: 'published_at',
      header: 'Ngày Đăng',
      sortable: true,
      render: (row) => (
        <span style={{ color: row.published_at ? '#5C3A1E' : '#A0794E', fontSize: '0.8rem', fontFamily: 'monospace' }}>
          {row.published_at ? formatDateShort(row.published_at) : 'Chưa đăng'}
        </span>
      ),
    },
    {
      key: 'view_count',
      header: 'Lượt Xem',
      sortable: true,
      render: (row) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#A0794E', fontSize: '0.85rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'rgba(61,43,26,0.3)' }}>visibility</span>
          {(row.view_count || 0).toLocaleString('vi-VN')}
        </span>
      ),
    },
  ]

  const rowActions = (row) => [
    { label: 'Sửa', icon: 'edit', onClick: () => navigate(`/admin/bai-viet/${row.id}/sua`) },
    {
      label: row.status === 'published' ? 'Gỡ xuất bản' : 'Xuất bản',
      icon: row.status === 'published' ? 'unpublished' : 'publish',
      onClick: () => publishMutation.mutate({ id: row.id, status: row.status === 'published' ? 'draft' : 'published' }),
      hidden: !can(role, 'articles:publish'),
    },
    { label: 'Lưu vào kho', icon: 'archive', onClick: () => publishMutation.mutate({ id: row.id, status: 'archived' }), hidden: !can(role, 'articles:archive') },
    { label: 'Xoá', icon: 'delete', variant: 'danger', onClick: () => setConfirmDelete({ id: row.id, name: row.title }), hidden: !can(role, 'articles:delete') },
  ]

  return (
    <AdminLayout
      topbarTitle="Quản Lý Bài Viết"
      topbarBreadcrumbs={[{ label: 'Admin', path: '/admin' }, { label: 'Bài Viết', path: '/admin/bai-viet' }]}
      topbarActions={
        can(role, 'articles:write') && (
          <button onClick={() => navigate('/admin/bai-viet/tao')} className="btn-epic px-4 py-2 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-sm" style={{ fontSize: '16px' }}>add</span>
            Thêm Bài Viết
          </button>
        )
      }
    >
      {!can(role, 'articles:write') && <ViewerBanner />}
      <DataTable
        data={articles}
        columns={columns}
        totalCount={data?.total || 0}
        page={currentPage}
        pageSize={20}
        onPageChange={handlePageChange}
        sortBy={searchParams.get('sortBy')}
        sortDir={searchParams.get('sortDir') || 'desc'}
        onSortChange={handleSortChange}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        selectable={can(role, 'articles:write')}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        filterBar={<ArticleFilterBar searchParams={searchParams} setSearchParams={setSearchParams} />}
        rowActions={rowActions}
        emptyState={<div style={{ textAlign: 'center', padding: '4rem 0', color: '#A0794E', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.9rem' }}>Lịch sử chưa được kể — hãy là người đầu tiên.</div>}
      />
      <ConfirmModal
        isOpen={!!confirmDelete}
        title="Xoá Bài Viết"
        message={`Bạn có chắc muốn xoá "${confirmDelete?.name}"? Hành động này không thể hoàn tác.`}
        onConfirm={() => deleteMutation.mutate(confirmDelete.id)}
        onCancel={() => setConfirmDelete(null)}
      />
    </AdminLayout>
  )
}
