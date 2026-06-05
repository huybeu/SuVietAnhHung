import { useState, useEffect, useRef } from 'react'

function SkeletonRow({ cols }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-[#f6be3b]/10 rounded animate-pulse" style={{ width: i === 0 ? '60%' : '80%' }} />
        </td>
      ))}
    </tr>
  )
}

export default function DataTable({
  data = [], columns = [], totalCount = 0,
  page = 1, pageSize = 20, onPageChange,
  sortBy, sortDir = 'asc', onSortChange,
  isLoading, isError, onRetry,
  selectable = false, selectedIds, onSelectionChange,
  batchActions, filterBar, rowActions,
  emptyState,
}) {
  const [openMenuId, setOpenMenuId] = useState(null)
  const menuRef = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenuId(null)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const totalPages = Math.ceil(totalCount / pageSize)
  const start = (page - 1) * pageSize + 1
  const end   = Math.min(page * pageSize, totalCount)

  function toggleAll() {
    if (!onSelectionChange) return
    const ids = new Set(data.map(r => r.id))
    const allSelected = data.every(r => selectedIds?.has(r.id))
    onSelectionChange(allSelected ? new Set() : ids)
  }

  function toggleRow(id) {
    if (!onSelectionChange) return
    const next = new Set(selectedIds)
    next.has(id) ? next.delete(id) : next.add(id)
    onSelectionChange(next)
  }

  function handleSort(key) {
    if (!onSortChange) return
    if (sortBy === key) {
      onSortChange(key, sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      onSortChange(key, 'asc')
    }
  }

  function getPageNumbers() {
    const pages = []
    const delta = 2
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...')
      }
    }
    return pages
  }

  return (
    <div className="flex flex-col gap-3">
      {filterBar && <div>{filterBar}</div>}

      {selectedIds?.size > 0 && batchActions && (
        <div className="bg-[#1b110d] border border-[#f6be3b]/30 rounded-lg px-4 py-2 flex items-center gap-3 text-[#e8dcc8] text-sm animate-[slideDown_0.2s_ease]">
          <span className="text-[#f6be3b] font-cinzel text-xs">{selectedIds.size} mục đã chọn</span>
          <div className="flex gap-2 ml-2">{batchActions}</div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-[#f6be3b]/15">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#1b110d]">
              {selectable && (
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={data.length > 0 && data.every(r => selectedIds?.has(r.id))}
                    onChange={toggleAll}
                    className="accent-[#dc143c] w-4 h-4"
                  />
                </th>
              )}
              {columns.map(col => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-4 py-3 text-left font-cinzel text-[0.65rem] tracking-widest text-[#f6be3b]/60 uppercase border-b border-[#f6be3b]/15
                    ${col.sortable ? 'cursor-pointer hover:text-[#f6be3b] select-none' : ''}`}
                >
                  <span className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortBy === col.key && (
                      <span className="text-[#dc143c]">{sortDir === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </span>
                </th>
              ))}
              {rowActions && <th className="px-4 py-3 w-10" />}
            </tr>
          </thead>
          <tbody>
            {isLoading && Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} cols={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)} />
            ))}

            {!isLoading && isError && (
              <tr><td colSpan={99} className="text-center py-12 text-[#e8dcc8]/40">
                <div className="flex flex-col items-center gap-3">
                  <span className="text-3xl">⚠</span>
                  <span className="font-cinzel text-sm">Đã xảy ra lỗi khi tải dữ liệu</span>
                  {onRetry && (
                    <button onClick={onRetry} className="text-[#dc143c] text-sm hover:underline">Thử lại</button>
                  )}
                </div>
              </td></tr>
            )}

            {!isLoading && !isError && data.length === 0 && (
              <tr><td colSpan={99} className="py-16">
                {emptyState || (
                  <div className="text-center text-[#e8dcc8]/30 font-cinzel text-sm">Không có dữ liệu</div>
                )}
              </td></tr>
            )}

            {!isLoading && !isError && data.map(row => (
              <tr key={row.id}
                className={`border-b border-[#f6be3b]/8 group transition-colors
                  ${selectedIds?.has(row.id) ? 'bg-[#f6be3b]/5' : 'hover:bg-[#dc143c]/5'}`}
              >
                {selectable && (
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selectedIds?.has(row.id) || false}
                      onChange={() => toggleRow(row.id)} className="accent-[#dc143c] w-4 h-4" />
                  </td>
                )}
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3 text-[#e8dcc8] text-sm">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {rowActions && (
                  <td className="px-2 py-3 relative" ref={openMenuId === row.id ? menuRef : null}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === row.id ? null : row.id) }}
                      className="p-1.5 rounded hover:bg-[#dc143c]/20 text-[#e8dcc8]/40 hover:text-[#e8dcc8] opacity-0 group-hover:opacity-100 transition"
                    >⋮</button>
                    {openMenuId === row.id && (
                      <div className="absolute right-0 top-8 z-50 glass-panel rounded-lg py-1 min-w-44 shadow-xl border border-[#f6be3b]/20">
                        {rowActions(row).filter(a => !a.hidden).map((action, i) => (
                          <button key={i} onClick={() => { action.onClick(); setOpenMenuId(null) }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-[#dc143c]/15 transition flex items-center gap-2
                              ${action.variant === 'danger' ? 'text-red-400 hover:text-red-300' : 'text-[#e8dcc8]'}`}
                          >
                            {action.icon && <span className="material-symbols-outlined text-sm" style={{ fontSize: 16 }}>{action.icon}</span>}
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalCount > 0 && (
        <div className="flex items-center justify-between text-sm text-[#e8dcc8]/50 flex-wrap gap-3">
          <span className="font-cinzel text-xs">
            Hiển thị {start}–{end} trong {totalCount} kết quả
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => onPageChange?.(page - 1)} disabled={page <= 1}
              className="px-3 py-1 rounded border border-[#f6be3b]/20 hover:border-[#f6be3b]/60 disabled:opacity-30 disabled:cursor-not-allowed transition">‹</button>
            {getPageNumbers().map((p, i) => (
              p === '...'
                ? <span key={`e${i}`} className="px-2 text-[#e8dcc8]/30">…</span>
                : <button key={p} onClick={() => onPageChange?.(p)}
                    className={`px-3 py-1 rounded border transition
                      ${p === page
                        ? 'bg-[#dc143c] border-[#dc143c] text-white font-cinzel'
                        : 'border-[#f6be3b]/20 hover:border-[#f6be3b]/60 text-[#e8dcc8]/60'}`}
                  >{p}</button>
            ))}
            <button onClick={() => onPageChange?.(page + 1)} disabled={page >= totalPages}
              className="px-3 py-1 rounded border border-[#f6be3b]/20 hover:border-[#f6be3b]/60 disabled:opacity-30 disabled:cursor-not-allowed transition">›</button>
          </div>
        </div>
      )}
    </div>
  )
}
