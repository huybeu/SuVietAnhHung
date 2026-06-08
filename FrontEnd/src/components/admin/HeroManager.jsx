import { useState, useCallback, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams, useNavigate } from 'react-router-dom'
import DataTable from '../ui/DataTable'
import OptimisticToggle from '../ui/OptimisticToggle'
import ConfirmModal from '../ui/ConfirmModal'
import { can, useRole } from '../../lib/permissions'
import { heroService } from '../../services/heroService'
import { queryKeys }   from '../../lib/queryKeys'
import { formatYear }  from '../../lib/format'

// ── Optimistic Toggle Hook — FE-030 ──────────────────────────────────────────
// Cập nhật optimistic + rollback đầy đủ khi gặp lỗi
function useOptimisticToggle(field) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, value }) => heroService.updateHero(id, { [field]: value }),
    onMutate: async ({ id, value }) => {
      // Hủy refetch đang chạy để tránh ghi đè optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.heroes.all })
      // Snapshot toàn bộ hero queries để rollback
      const prev = queryClient.getQueriesData({ queryKey: queryKeys.heroes.all })
      // Apply optimistic update
      queryClient.setQueriesData({ queryKey: queryKeys.heroes.all }, (old) => {
        if (!old?.data) return old
        return { ...old, data: old.data.map(h => h.id === id ? { ...h, [field]: value } : h) }
      })
      return { prev }
    },
    onError: (_err, _vars, context) => {
      // Rollback về snapshot trước đó
      if (context?.prev) {
        context.prev.forEach(([key, data]) => queryClient.setQueryData(key, data))
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.heroes.all }),
  })
}

// ── Filter Bar ────────────────────────────────────────────────────────────────
function HeroFilterBar({ searchParams, setSearchParams, eras }) {
  const [localQ, setLocalQ] = useState(searchParams.get('q') || '')
  const debounceRef = useRef(null)

  const setParam = (key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value && value !== 'all') next.set(key, value); else next.delete(key)
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

  const activeEra      = searchParams.get('era') || ''
  const activeFeatured = searchParams.get('featured') || 'all'
  const activeActive   = searchParams.get('active') || 'all'
  const hasFilters     = !!(searchParams.get('q') || activeEra || activeFeatured !== 'all' || activeActive !== 'all')
  const eraName        = activeEra && eras ? eras.find(e => String(e.id) === String(activeEra))?.name : null

  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2" style={{ fontSize: '18px', color: 'rgba(61,43,26,0.35)' }}>search</span>
          <input className="input-gold pl-9 pr-3 py-2 text-sm w-full" placeholder="Tìm kiếm anh hùng..." value={localQ} onChange={e => handleSearch(e.target.value)} />
        </div>
        <select className="input-gold py-2 px-3 text-sm min-w-[160px] cursor-pointer" value={activeEra} onChange={e => setParam('era', e.target.value)}>
          <option value="">Tất cả thời kỳ</option>
          {eras?.map(era => <option key={era.id} value={era.id}>{era.name}</option>)}
        </select>
        <select className="input-gold py-2 px-3 text-sm min-w-[140px] cursor-pointer" value={activeFeatured} onChange={e => setParam('featured', e.target.value)}>
          <option value="all">Nổi bật: Tất cả</option>
          <option value="yes">Có</option>
          <option value="no">Không</option>
        </select>
        <select className="input-gold py-2 px-3 text-sm min-w-[160px] cursor-pointer" value={activeActive} onChange={e => setParam('active', e.target.value)}>
          <option value="all">Trạng thái: Tất cả</option>
          <option value="yes">Đang hoạt động</option>
          <option value="no">Ẩn</option>
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
          {eraName && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(196,149,106,0.12)', color: '#C4956A', border: '0.5px solid rgba(196,149,106,0.35)' }}>
              Thời kỳ: {eraName}
              <button onClick={() => setParam('era', '')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C4956A', marginLeft: '0.25rem' }}>✕</button>
            </span>
          )}
          {activeFeatured !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(196,149,106,0.12)', color: '#C4956A', border: '0.5px solid rgba(196,149,106,0.35)' }}>
              Nổi bật: {activeFeatured === 'yes' ? 'Có' : 'Không'}
              <button onClick={() => setParam('featured', 'all')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C4956A', marginLeft: '0.25rem' }}>✕</button>
            </span>
          )}
          {activeActive !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(61,43,26,0.07)', color: '#5C3A1E', border: '0.5px solid rgba(61,43,26,0.18)' }}>
              {activeActive === 'yes' ? 'Đang hoạt động' : 'Ẩn'}
              <button onClick={() => setParam('active', 'all')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5C3A1E', marginLeft: '0.25rem' }}>✕</button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// ── Batch Actions Bar ─────────────────────────────────────────────────────────
function BatchActionsBar({ selectedIds, onActivateAll, onHideAll, onDeleteAll, role }) {
  const n = selectedIds.size
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', background: '#FAE8DA', border: '0.5px solid #D4B896', borderRadius: '0.5rem' }}>
      <span style={{ color: '#5C3A1E', fontSize: '0.85rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Đã chọn <span style={{ color: '#8B1A1A', fontWeight: 700 }}>{n}</span></span>
      <div style={{ width: 1, height: 16, background: 'rgba(212,184,150,0.5)' }} />
      <button onClick={onActivateAll} style={{ fontSize: '0.82rem', padding: '0.25rem 0.75rem', borderRadius: '0.375rem', border: '0.5px solid rgba(196,149,106,0.5)', color: '#C4956A', background: 'transparent', cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif' " }}>Kích hoạt tất cả</button>
      <button onClick={onHideAll}     style={{ fontSize: '0.82rem', padding: '0.25rem 0.75rem', borderRadius: '0.375rem', border: '0.5px solid rgba(61,43,26,0.2)', color: '#A0794E', background: 'transparent', cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif' " }}>Ẩn tất cả</button>
      {can(role, 'heroes:delete') && (
        <button onClick={onDeleteAll} style={{ fontSize: '0.82rem', padding: '0.25rem 0.75rem', borderRadius: '0.375rem', border: '0.5px solid rgba(139,26,26,0.35)', color: '#8B1A1A', background: 'transparent', cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif' " }}>Xoá {n} anh hùng</button>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function HeroManager() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const role = useRole()

  const [selectedIds,       setSelectedIds]       = useState(new Set())
  const [editingRowId,      setEditingRowId]      = useState(null)
  const [editValues,        setEditValues]        = useState({ name: '', title: '' })
  const [confirmDelete,     setConfirmDelete]     = useState(null)
  const [confirmBatchDelete, setConfirmBatchDelete] = useState(false)
  const [draggedId,         setDraggedId]         = useState(null)
  const [dragOverId,        setDragOverId]        = useState(null)
  const reorderTimerRef = useRef(null)

  const currentPage = parseInt(searchParams.get('page') || '1')

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.heroes.list(Object.fromEntries(searchParams)),
    queryFn:  ({ signal }) => heroService.getHeroes({
      q:          searchParams.get('q') || '',
      era_id:     searchParams.get('era') || '',
      is_featured: searchParams.get('featured') === 'yes' ? true : searchParams.get('featured') === 'no' ? false : undefined,
      is_active:   searchParams.get('active') === 'yes' ? true : searchParams.get('active') === 'no' ? false : undefined,
      page:     parseInt(searchParams.get('page') || '1'),
      pageSize: 20,
      sortBy:   searchParams.get('sortBy') || '',
      sortDir:  searchParams.get('sortDir') || 'asc',
    }, { signal }),
  })

  const { data: erasData } = useQuery({
    queryKey: queryKeys.eras.all(),
    queryFn:  ({ signal }) => heroService.getEras({ signal }),
  })

  const featuredMutation = useOptimisticToggle('is_featured')
  const activeMutation   = useOptimisticToggle('is_active')

  const quickEditMutation = useMutation({
    mutationFn: ({ id, values }) => heroService.updateHero(id, values),
    onSuccess:  () => { setEditingRowId(null); queryClient.invalidateQueries({ queryKey: queryKeys.heroes.all }) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => heroService.deleteHero(id),
    onSuccess:  () => { setConfirmDelete(null); queryClient.invalidateQueries({ queryKey: queryKeys.heroes.all }) },
  })

  const reorderMutation = useMutation({
    mutationFn: (ids) => heroService.reorderHeroes(ids),
    onSettled:  () => queryClient.invalidateQueries({ queryKey: queryKeys.heroes.all }),
  })

  const startEdit  = useCallback((row) => { setEditingRowId(row.id); setEditValues({ name: row.name, title: row.title || '' }) }, [])
  const saveEdit   = useCallback((id) => { if (!editValues.name.trim()) return; quickEditMutation.mutate({ id, values: editValues }) }, [editValues, quickEditMutation])
  const cancelEdit = useCallback(() => setEditingRowId(null), [])
  const handleEditKeyDown = useCallback((e) => { if (e.key === 'Enter') saveEdit(editingRowId); if (e.key === 'Escape') cancelEdit() }, [editingRowId, saveEdit, cancelEdit])

  const handlePageChange = (page) => setSearchParams(prev => { const next = new URLSearchParams(prev); next.set('page', String(page)); return next })
  const handleSortChange = (sortBy, sortDir) => setSearchParams(prev => {
    const next = new URLSearchParams(prev)
    if (sortBy) { next.set('sortBy', sortBy); next.set('sortDir', sortDir) } else { next.delete('sortBy'); next.delete('sortDir') }
    next.set('page', '1'); return next
  })
  const handleDelete = () => { if (confirmDelete) deleteMutation.mutate(confirmDelete.id) }

  const handleBatchActivate = async () => {
    for (const id of selectedIds) await heroService.updateHero(id, { is_active: true })
    queryClient.invalidateQueries({ queryKey: queryKeys.heroes.all })
    setSelectedIds(new Set())
  }

  const handleBatchHide = async () => {
    for (const id of selectedIds) await heroService.updateHero(id, { is_active: false })
    queryClient.invalidateQueries({ queryKey: queryKeys.heroes.all })
    setSelectedIds(new Set())
  }

  const handleBatchDelete = async () => {
    for (const id of selectedIds) await heroService.deleteHero(id)
    queryClient.invalidateQueries({ queryKey: queryKeys.heroes.all })
    setSelectedIds(new Set())
    setConfirmBatchDelete(false)
  }

  const handleDragStart = useCallback((id) => setDraggedId(id), [])
  const handleDragEnd   = useCallback(() => { setDraggedId(null); setDragOverId(null) }, [])
  const handleDragOver  = useCallback((e, id) => { e.preventDefault(); setDragOverId(id) }, [])
  const handleDrop      = useCallback((e, targetId) => {
    e.preventDefault()
    if (!draggedId || draggedId === targetId) return
    const heroes  = data?.data || []
    const fromIdx = heroes.findIndex(h => h.id === draggedId)
    const toIdx   = heroes.findIndex(h => h.id === targetId)
    if (fromIdx === -1 || toIdx === -1) return
    const reordered = [...heroes]
    const [moved] = reordered.splice(fromIdx, 1)
    reordered.splice(toIdx, 0, moved)
    clearTimeout(reorderTimerRef.current)
    reorderTimerRef.current = setTimeout(() => reorderMutation.mutate(reordered.map(h => h.id)), 1000)
    setDraggedId(null); setDragOverId(null)
  }, [draggedId, data, reorderMutation])

  const hasSortActive = !!(searchParams.get('sortBy'))
  const heroes = data?.data || []

  const columns = [
    {
      key: 'drag', header: '', width: '40px',
      render: () => <span className="drag-handle opacity-0 group-hover:opacity-60 cursor-grab text-[#e8dcc8]/50 material-symbols-outlined" style={{ fontSize: '16px' }} title={hasSortActive ? 'Tắt sắp xếp cột để dùng kéo thả' : 'Kéo để sắp xếp'}>drag_indicator</span>,
    },
    {
      key: 'name', header: 'Tên Anh Hùng', sortable: true,
      render: (row) => {
        if (editingRowId === row.id) {
          return (
            <div className="flex flex-col gap-1">
              <input className="input-gold text-sm py-1 px-2 w-full" value={editValues.name} onChange={e => setEditValues(p => ({ ...p, name: e.target.value }))} onKeyDown={handleEditKeyDown} placeholder="Tên anh hùng" autoFocus />
              <input className="input-gold text-xs py-1 px-2 w-full" value={editValues.title} onChange={e => setEditValues(p => ({ ...p, title: e.target.value }))} onKeyDown={handleEditKeyDown} placeholder="Chức danh" />
              <div className="flex gap-2 mt-1">
                <button onClick={() => saveEdit(row.id)} style={{ fontSize: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: '#8B1A1A', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700 }}>Lưu</button>
                <button onClick={cancelEdit} style={{ fontSize: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: '#A0794E', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Huỷ</button>
              </div>
            </div>
          )
        }
        return (
          <div>
            <div style={{ color: '#3D2B1A', fontSize: '0.88rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}>{row.name}</div>
            {row.title && <div style={{ color: '#A0794E', fontSize: '0.75rem', marginTop: '0.15rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{row.title}</div>}
          </div>
        )
      },
    },
    { key: 'era',   header: 'Thời Kỳ',        render: (row) => <span style={{ color: '#5C3A1E', fontSize: '0.85rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{row.era?.name || '—'}</span> },
    { key: 'years', header: 'Năm Sinh – Mất', render: (row) => <span style={{ color: '#A0794E', fontSize: '0.78rem', fontFamily: 'monospace' }}>{formatYear(row.birth_year)} – {formatYear(row.death_year)}</span> },
    {
      key: 'is_featured', header: 'Nổi Bật',
      render: (row) => <OptimisticToggle value={row.is_featured} onChange={(v) => featuredMutation.mutateAsync({ id: row.id, value: v })} disabled={!can(role, 'heroes:write')} />,
    },
    {
      key: 'is_active', header: 'Hoạt Động',
      render: (row) => <OptimisticToggle value={row.is_active} onChange={(v) => activeMutation.mutateAsync({ id: row.id, value: v })} disabled={!can(role, 'heroes:write')} />,
    },
  ]

  const rowActions = (row) => [
    { label: 'Chỉnh sửa nhanh', icon: 'edit_note', onClick: () => startEdit(row), hidden: !can(role, 'heroes:write') },
    { label: 'Chỉnh sửa đầy đủ', icon: 'edit', onClick: () => navigate(`/admin/anh-hung/${row.id}/sua`) },
    { label: 'Sao chép', icon: 'content_copy', onClick: () => {} },
    { label: 'Xoá', icon: 'delete', variant: 'danger', onClick: () => setConfirmDelete({ id: row.id, name: row.name }), hidden: !can(role, 'heroes:delete') },
  ]

  const getRowProps = (row) => ({
    draggable: true,
    onDragStart: () => handleDragStart(row.id),
    onDragEnd:   handleDragEnd,
    onDragOver:  (e) => handleDragOver(e, row.id),
    onDrop:      (e) => handleDrop(e, row.id),
    className: ['group', draggedId === row.id ? 'opacity-50' : '', dragOverId === row.id ? 'drag-over-top' : ''].filter(Boolean).join(' '),
  })

  return (
    <div>
      {hasSortActive && (
        <div style={{ marginBottom: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', background: 'rgba(196,149,106,0.10)', border: '0.5px solid rgba(196,149,106,0.30)', color: '#C4956A', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>info</span>
          Tắt sắp xếp cột để dùng tính năng kéo thả
        </div>
      )}

      <DataTable
        data={heroes}
        columns={columns}
        totalCount={data?.total || 0}
        page={currentPage}
        pageSize={20}
        onPageChange={handlePageChange}
        sortBy={searchParams.get('sortBy')}
        sortDir={searchParams.get('sortDir') || 'asc'}
        onSortChange={handleSortChange}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        selectable={can(role, 'heroes:write')}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        getRowProps={getRowProps}
        filterBar={<HeroFilterBar searchParams={searchParams} setSearchParams={setSearchParams} eras={erasData?.data || erasData || []} />}
        batchActions={
          selectedIds.size > 0 ? (
            <BatchActionsBar selectedIds={selectedIds} onActivateAll={handleBatchActivate} onHideAll={handleBatchHide} onDeleteAll={() => setConfirmBatchDelete(true)} role={role} />
          ) : null
        }
        rowActions={rowActions}
        emptyState={<div style={{ textAlign: 'center', padding: '4rem 0', color: '#A0794E', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.9rem' }}>Những trang sử còn chờ được ghi lại...</div>}
      />

      <ConfirmModal isOpen={!!confirmDelete} title="Xoá Anh Hùng" message={`Bạn có chắc muốn xoá "${confirmDelete?.name}"? Hành động này không thể hoàn tác.`} onConfirm={handleDelete} onCancel={() => setConfirmDelete(null)} />
      <ConfirmModal isOpen={confirmBatchDelete} title={`Xoá ${selectedIds.size} Anh Hùng`} message={`Bạn có chắc muốn xoá ${selectedIds.size} anh hùng đã chọn? Hành động này không thể hoàn tác.`} onConfirm={handleBatchDelete} onCancel={() => setConfirmBatchDelete(false)} />
    </div>
  )
}
