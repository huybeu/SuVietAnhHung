import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable from '../../components/ui/DataTable'
import StatusBadge from '../../components/ui/StatusBadge'
import ConfirmModal from '../../components/ui/ConfirmModal'
import ViewerBanner from '../../components/admin/ViewerBanner'
import { can, useRole } from '../../lib/permissions'
import { videoService } from '../../services/videoService'
import { queryKeys } from '../../lib/queryKeys'
import { formatDateShort } from '../../lib/format'

const VIDEO_CATEGORIES = [
  { value: 'lich-su',  label: 'Lịch Sử' },
  { value: 'anh-hung', label: 'Anh Hùng' },
  { value: 'thoi-ky',  label: 'Thời Kỳ' },
  { value: 'van-hoa',  label: 'Văn Hóa' },
  { value: 'khac',     label: 'Khác' },
]

const CATEGORY_LABEL = Object.fromEntries(VIDEO_CATEGORIES.map(c => [c.value, c.label]))

const EMPTY_FORM = { title: '', url: '', thumbnail: '', description: '', category: '', tags: '', status: 'draft' }

// ── Inline styles shared across components ────────────────────────────────────
const inputStyle = {
  fontFamily: "'Be Vietnam Pro', sans-serif",
  height: 36, fontSize: '0.85rem',
  padding: '0 0.75rem', borderRadius: '0.375rem',
  border: '0.5px solid rgba(196,149,106,0.45)',
  background: 'rgba(253,245,238,0.8)', color: '#3D2B1A',
  outline: 'none', transition: 'border-color 0.15s',
}

// ── Filter Bar ────────────────────────────────────────────────────────────────
function VideoFilterBar({ searchParams, setSearchParams }) {
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
        if (val) next.set('q', val); else next.delete('q')
        next.set('page', '1')
        return next
      })
    }, 300)
  }

  const clearAll = () => { setLocalQ(''); setSearchParams(new URLSearchParams()) }

  const activeStatus   = searchParams.get('status')   || 'all'
  const activeCategory = searchParams.get('category') || 'all'
  const hasFilters     = !!(searchParams.get('q') || activeStatus !== 'all' || activeCategory !== 'all')

  return (
    <div style={{ marginBottom: '1rem' }}>
      {/* Filter row — horizontal, wraps on mobile */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 180px', minWidth: 160 }}>
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'rgba(61,43,26,0.35)', pointerEvents: 'none' }}>search</span>
          <input
            value={localQ}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Tìm theo tên video..."
            className="input-gold"
            style={{ ...inputStyle, paddingLeft: 32, width: '100%' }}
          />
        </div>

        {/* Category */}
        <select
          value={activeCategory}
          onChange={e => setParam('category', e.target.value)}
          className="input-gold"
          style={{ ...inputStyle, paddingRight: '2rem', flex: '0 1 160px', cursor: 'pointer' }}
        >
          <option value="all">Danh mục: Tất cả</option>
          {VIDEO_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>

        {/* Status */}
        <select
          value={activeStatus}
          onChange={e => setParam('status', e.target.value)}
          className="input-gold"
          style={{ ...inputStyle, paddingRight: '2rem', flex: '0 1 160px', cursor: 'pointer' }}
        >
          <option value="all">Trạng thái: Tất cả</option>
          <option value="published">Đã xuất bản</option>
          <option value="draft">Nháp</option>
          <option value="hidden">Ẩn</option>
        </select>

        {/* Reset */}
        {hasFilters && (
          <button
            onClick={clearAll}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#8B1A1A', fontSize: '0.82rem',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              transition: 'color 0.15s', height: 36, padding: '0 0.5rem',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#C4956A'}
            onMouseLeave={e => e.currentTarget.style.color = '#8B1A1A'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>filter_alt_off</span>
            Xoá lọc
          </button>
        )}
      </div>

      {/* Active filter chips */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2" style={{ marginTop: '0.5rem' }}>
          {searchParams.get('q') && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(139,26,26,0.08)', color: '#8B1A1A', border: '0.5px solid rgba(139,26,26,0.25)', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              Tìm: {searchParams.get('q')}
              <button onClick={() => { setLocalQ(''); setParam('q', '') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B1A1A', lineHeight: 1 }}>✕</button>
            </span>
          )}
          {activeCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(196,149,106,0.12)', color: '#C4956A', border: '0.5px solid rgba(196,149,106,0.35)', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              {CATEGORY_LABEL[activeCategory] || activeCategory}
              <button onClick={() => setParam('category', 'all')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C4956A', lineHeight: 1 }}>✕</button>
            </span>
          )}
          {activeStatus !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(196,149,106,0.12)', color: '#C4956A', border: '0.5px solid rgba(196,149,106,0.35)', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              {activeStatus === 'published' ? 'Đã xuất bản' : activeStatus === 'draft' ? 'Nháp' : 'Ẩn'}
              <button onClick={() => setParam('status', 'all')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C4956A', lineHeight: 1 }}>✕</button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// ── Add/Edit Form Modal ───────────────────────────────────────────────────────
function VideoFormModal({ initial, onSave, onClose, isSaving }) {
  const [form, setForm] = useState(initial || EMPTY_FORM)

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const fieldStyle = { ...inputStyle, height: 'auto', padding: '0.45rem 0.75rem', width: '100%', boxSizing: 'border-box' }
  const labelStyle = { fontFamily: "'Be Vietnam Pro', sans-serif", color: '#5C3A1E', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem', display: 'block' }

  function handleSubmit(e) {
    e.preventDefault()
    const data = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [] }
    onSave(data)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(61,43,26,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: '#FDF5EE', borderRadius: '0.75rem',
        width: '100%', maxWidth: 560,
        boxShadow: '0 8px 40px rgba(61,43,26,0.2)',
        border: '0.5px solid rgba(196,149,106,0.4)',
        display: 'flex', flexDirection: 'column', maxHeight: '90vh',
      }}>
        {/* Header */}
        <div style={{
          padding: '1rem 1.25rem', borderBottom: '0.5px solid rgba(196,149,106,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontFamily: "'Playfair Display', serif", color: '#8B1A1A', fontSize: '1rem', fontWeight: 700 }}>
            {initial?.id ? 'Sửa Video' : 'Thêm Video Mới'}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(61,43,26,0.4)', display: 'flex' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {/* Title */}
          <div>
            <label style={labelStyle}>Tiêu đề <span style={{ color: '#8B1A1A' }}>*</span></label>
            <input required value={form.title} onChange={e => set('title', e.target.value)} placeholder="Tên video..." style={fieldStyle} />
          </div>

          {/* URL */}
          <div>
            <label style={labelStyle}>URL Video <span style={{ color: '#8B1A1A' }}>*</span></label>
            <input required value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://youtube.com/watch?v=..." style={fieldStyle} />
          </div>

          {/* Thumbnail */}
          <div>
            <label style={labelStyle}>Thumbnail URL</label>
            <input value={form.thumbnail} onChange={e => set('thumbnail', e.target.value)} placeholder="https://..." style={fieldStyle} />
            {form.thumbnail && (
              <div style={{ marginTop: '0.5rem', borderRadius: '0.375rem', overflow: 'hidden', height: 80, background: 'rgba(196,149,106,0.1)' }}>
                <img src={form.thumbnail} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Mô tả</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả nội dung video..." rows={3}
              style={{ ...fieldStyle, height: 'auto', resize: 'vertical', lineHeight: 1.5 }} />
          </div>

          {/* Category + Status row */}
          <div className="flex gap-3">
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Danh mục</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} style={{ ...fieldStyle, cursor: 'pointer' }}>
                <option value="">Chọn danh mục...</option>
                {VIDEO_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Trạng thái</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} style={{ ...fieldStyle, cursor: 'pointer' }}>
                <option value="draft">Nháp</option>
                <option value="published">Đã xuất bản</option>
                <option value="hidden">Ẩn</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label style={labelStyle}>Tags <span style={{ color: '#A0794E', fontWeight: 400 }}>(phân cách bằng dấu phẩy)</span></label>
            <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="lịch sử, chiến tranh, anh hùng..." style={fieldStyle} />
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.25rem' }}>
            <button type="button" onClick={onClose}
              style={{
                padding: '0.5rem 1.25rem', borderRadius: '0.375rem',
                border: '0.5px solid rgba(196,149,106,0.5)',
                background: 'transparent', color: '#A0794E', cursor: 'pointer',
                fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.85rem',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,149,106,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Huỷ
            </button>
            <button type="submit" disabled={isSaving} className="btn-epic"
              style={{ padding: '0.5rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: isSaving ? 0.6 : 1 }}>
              {isSaving && <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16 }}>progress_activity</span>}
              {initial?.id ? 'Lưu thay đổi' : 'Thêm video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function VideoListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const role = useRole()

  const [formModal, setFormModal]     = useState(null)   // null | 'add' | { ...video }
  const [confirmDelete, setConfirmDelete] = useState(null)

  const currentPage = parseInt(searchParams.get('page') || '1')

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.videos.list(Object.fromEntries(searchParams)),
    queryFn:  ({ signal }) => videoService.getVideos({
      q:        searchParams.get('q') || '',
      status:   searchParams.get('status') || '',
      category: searchParams.get('category') || '',
      page:     currentPage,
      pageSize: 20,
      sortBy:   searchParams.get('sortBy') || '',
      sortDir:  searchParams.get('sortDir') || 'desc',
    }, { signal }),
  })

  const createMutation = useMutation({
    mutationFn: (data) => videoService.createVideo(data),
    onSuccess:  () => { setFormModal(null); queryClient.invalidateQueries({ queryKey: queryKeys.videos.all }) },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => videoService.updateVideo(id, data),
    onSuccess:  () => { setFormModal(null); queryClient.invalidateQueries({ queryKey: queryKeys.videos.all }) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => videoService.deleteVideo(id),
    onSuccess:  () => { setConfirmDelete(null); queryClient.invalidateQueries({ queryKey: queryKeys.videos.all }) },
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

  function handleSave(formData) {
    if (formModal?.id) {
      updateMutation.mutate({ id: formModal.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const videos = data?.data || []
  const isSaving = createMutation.isPending || updateMutation.isPending

  const columns = [
    {
      key: 'title',
      header: 'Video',
      sortable: true,
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', maxWidth: 320 }}>
          {/* Thumbnail */}
          <div style={{
            width: 64, height: 40, borderRadius: '0.25rem', flexShrink: 0,
            background: 'rgba(196,149,106,0.12)',
            border: '0.5px solid rgba(196,149,106,0.3)',
            overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {row.thumbnail ? (
              <img src={row.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'rgba(196,149,106,0.5)' }}>play_circle</span>
            )}
          </div>
          {/* Text */}
          <div style={{ minWidth: 0 }}>
            <div style={{ color: '#3D2B1A', fontSize: '0.88rem', fontWeight: 600, fontFamily: "'Be Vietnam Pro', sans-serif", overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
              {row.title}
            </div>
            {row.description && (
              <div style={{ color: '#A0794E', fontSize: '0.75rem', marginTop: '0.1rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                {row.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Danh Mục',
      render: (row) => (
        <span style={{ color: '#5C3A1E', fontSize: '0.82rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
          {CATEGORY_LABEL[row.category] || row.category || '—'}
        </span>
      ),
    },
    { key: 'status', header: 'Trạng Thái', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'view_count',
      header: 'Lượt Xem',
      sortable: true,
      render: (row) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#A0794E', fontSize: '0.85rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'rgba(61,43,26,0.3)' }}>visibility</span>
          {(row.view_count || 0).toLocaleString('vi-VN')}
        </span>
      ),
    },
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
  ]

  const rowActions = (row) => [
    {
      label: 'Xem',
      icon: 'open_in_new',
      onClick: () => row.url && window.open(row.url, '_blank'),
      hidden: !row.url,
    },
    {
      label: 'Sửa',
      icon: 'edit',
      onClick: () => setFormModal({
        id: row.id, title: row.title || '', url: row.url || '',
        thumbnail: row.thumbnail || '', description: row.description || '',
        category: row.category || '', tags: Array.isArray(row.tags) ? row.tags.join(', ') : (row.tags || ''),
        status: row.status || 'draft',
      }),
      hidden: !can(role, 'videos:write'),
    },
    {
      label: row.status === 'published' ? 'Gỡ xuất bản' : 'Xuất bản',
      icon: row.status === 'published' ? 'unpublished' : 'publish',
      onClick: () => updateMutation.mutate({ id: row.id, data: { status: row.status === 'published' ? 'draft' : 'published' } }),
      hidden: !can(role, 'videos:write'),
    },
    {
      label: 'Xoá', icon: 'delete', variant: 'danger',
      onClick: () => setConfirmDelete({ id: row.id, name: row.title }),
      hidden: !can(role, 'videos:delete'),
    },
  ]

  return (
    <AdminLayout
      topbarTitle="Quản Lý Video"
      topbarBreadcrumbs={[{ label: 'Admin', path: '/admin' }, { label: 'Video', path: '/admin/video' }]}
      topbarActions={
        can(role, 'videos:write') && (
          <button onClick={() => setFormModal('add')} className="btn-epic px-4 py-2 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
            Thêm Video Mới
          </button>
        )
      }
    >
      {!can(role, 'videos:write') && <ViewerBanner />}

      <DataTable
        data={videos}
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
        rowActions={rowActions}
        filterBar={<VideoFilterBar searchParams={searchParams} setSearchParams={setSearchParams} />}
        emptyState={
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#A0794E', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.9rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 40, display: 'block', marginBottom: '0.75rem', color: 'rgba(196,149,106,0.4)' }}>play_circle</span>
            Chưa có video nào — hãy thêm video đầu tiên.
          </div>
        }
      />

      {/* Add / Edit modal */}
      {formModal && (
        <VideoFormModal
          initial={formModal === 'add' ? null : formModal}
          onSave={handleSave}
          onClose={() => setFormModal(null)}
          isSaving={isSaving}
        />
      )}

      {/* Delete confirm */}
      <ConfirmModal
        isOpen={!!confirmDelete}
        title="Xoá Video"
        message={`Bạn có chắc muốn xoá "${confirmDelete?.name}"? Hành động này không thể hoàn tác.`}
        onConfirm={() => deleteMutation.mutate(confirmDelete.id)}
        onCancel={() => setConfirmDelete(null)}
      />
    </AdminLayout>
  )
}
