import { useState, useEffect, useRef } from 'react'

function SkeletonRow({ cols }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded animate-pulse" style={{ background: 'rgba(196,149,106,0.14)', width: i === 0 ? '60%' : '80%' }} />
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
  emptyState, getRowProps,
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
        <div style={{ background: '#FAE8DA', border: '0.5px solid #D4B896', borderRadius: '0.5rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ color: '#8B1A1A', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.8rem', fontWeight: 700 }}>{selectedIds.size} mục đã chọn</span>
          <div className="flex gap-2 ml-2">{batchActions}</div>
        </div>
      )}

      <div style={{ overflowX: 'auto', borderRadius: '0.75rem', border: '0.5px solid #D4B896', boxShadow: '0 2px 12px rgba(61,43,26,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
          <thead>
            <tr style={{ background: '#FAE8DA' }}>
              {selectable && (
                <th style={{ padding: '0.75rem 1rem', width: 40 }}>
                  <input
                    type="checkbox"
                    checked={data.length > 0 && data.every(r => selectedIds?.has(r.id))}
                    onChange={toggleAll}
                    style={{ accentColor: '#8B1A1A', width: 16, height: 16 }}
                  />
                </th>
              )}
              {columns.map(col => (
                <th
                  key={col.key}
                  style={{
                    width: col.width, padding: '0.75rem 1rem', textAlign: 'left',
                    color: '#A0794E', fontSize: '0.65rem', letterSpacing: '0.12em',
                    textTransform: 'uppercase', borderBottom: '0.5px solid rgba(212,184,150,0.5)',
                    fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700,
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: col.sortable ? 'none' : 'auto',
                    transition: 'color 0.15s',
                  }}
                  onClick={() => col.sortable && handleSort(col.key)}
                  onMouseEnter={e => { if (col.sortable) e.currentTarget.style.color='#3D2B1A' }}
                  onMouseLeave={e => { if (col.sortable) e.currentTarget.style.color='#A0794E' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {col.header}
                    {col.sortable && sortBy === col.key && (
                      <span style={{ color: '#8B1A1A' }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </span>
                </th>
              ))}
              {rowActions && <th style={{ padding: '0.75rem 1rem', width: 40 }} />}
            </tr>
          </thead>
          <tbody>
            {isLoading && Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} cols={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)} />
            ))}

            {!isLoading && isError && (
              <tr><td colSpan={99} style={{ textAlign: 'center', padding: '3rem 0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }}>⚠</span>
                  <span style={{ color: '#A0794E', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.88rem' }}>Đã xảy ra lỗi khi tải dữ liệu</span>
                  {onRetry && (
                    <button onClick={onRetry} style={{ color: '#8B1A1A', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Thử lại</button>
                  )}
                </div>
              </td></tr>
            )}

            {!isLoading && !isError && data.length === 0 && (
              <tr><td colSpan={99} style={{ padding: '4rem 0' }}>
                {emptyState || (
                  <div style={{ textAlign: 'center', color: '#A0794E', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.88rem' }}>Không có dữ liệu</div>
                )}
              </td></tr>
            )}

            {!isLoading && !isError && data.map(row => {
              const extra = getRowProps ? getRowProps(row) : {}
              const { className: extraCls = '', ...extraProps } = extra
              const isSelected = selectedIds?.has(row.id)
              return (
                <tr key={row.id}
                  {...extraProps}
                  className={`group ${extraCls}`}
                  style={{
                    borderBottom: '0.5px solid rgba(212,184,150,0.35)',
                    background: isSelected ? 'rgba(196,149,106,0.08)' : 'transparent',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background='rgba(139,26,26,0.04)' }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background='transparent' }}
                >
                  {selectable && (
                    <td style={{ padding: '0.65rem 1rem' }}>
                      <input type="checkbox" checked={isSelected || false}
                        onChange={() => toggleRow(row.id)} style={{ accentColor: '#8B1A1A', width: 16, height: 16 }} />
                    </td>
                  )}
                  {columns.map(col => (
                    <td key={col.key} style={{ padding: '0.65rem 1rem', color: '#3D2B1A', fontSize: '0.88rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {rowActions && (
                    <td style={{ padding: '0.4rem 0.5rem', position: 'relative' }} ref={openMenuId === row.id ? menuRef : null}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === row.id ? null : row.id) }}
                        style={{
                          padding: '0.25rem 0.5rem', borderRadius: '0.375rem', background: 'none', border: 'none',
                          color: 'rgba(61,43,26,0.35)', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1,
                          opacity: 0, transition: 'opacity 0.15s, background 0.15s',
                        }}
                        className="group-hover:!opacity-100"
                        onMouseEnter={e => { e.currentTarget.style.background='rgba(139,26,26,0.08)'; e.currentTarget.style.color='#3D2B1A' }}
                        onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='rgba(61,43,26,0.35)' }}
                      >⋮</button>
                      {openMenuId === row.id && (
                        <div style={{
                          position: 'absolute', right: 0, top: '2rem', zIndex: 50, minWidth: 176,
                          background: '#FDF5EE', border: '0.5px solid #D4B896',
                          borderRadius: '0.625rem', padding: '0.25rem 0',
                          boxShadow: '0 8px 24px rgba(61,43,26,0.14), 0 2px 6px rgba(61,43,26,0.07)',
                        }}>
                          {rowActions(row).filter(a => !a.hidden).map((action, i) => (
                            <button key={i} onClick={() => { action.onClick(); setOpenMenuId(null) }}
                              style={{
                                width: '100%', textAlign: 'left', padding: '0.55rem 1rem',
                                fontSize: '0.85rem', background: 'none', border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'background 0.12s',
                                color: action.variant === 'danger' ? '#8B1A1A' : '#3D2B1A',
                                fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500,
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = action.variant === 'danger' ? 'rgba(139,26,26,0.08)' : 'rgba(196,149,106,0.10)'}
                              onMouseLeave={e => e.currentTarget.style.background='transparent'}
                            >
                              {action.icon && <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{action.icon}</span>}
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {totalCount > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <span style={{ color: '#A0794E', fontSize: '0.78rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            Hiển thị {start}–{end} trong {totalCount} kết quả
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <button onClick={() => onPageChange?.(page - 1)} disabled={page <= 1}
              style={{
                padding: '0.3rem 0.75rem', borderRadius: '0.375rem',
                border: '0.5px solid #D4B896', background: 'transparent',
                color: '#A0794E', cursor: page <= 1 ? 'not-allowed' : 'pointer',
                opacity: page <= 1 ? 0.4 : 1, transition: 'border-color 0.15s',
                fontFamily: "'Be Vietnam Pro', sans-serif",
              }}
              onMouseEnter={e => { if (page > 1) e.currentTarget.style.borderColor='#8B1A1A' }}
              onMouseLeave={e => e.currentTarget.style.borderColor='#D4B896'}
            >‹</button>
            {getPageNumbers().map((p, i) => (
              p === '...'
                ? <span key={`e${i}`} style={{ padding: '0 0.5rem', color: 'rgba(61,43,26,0.35)' }}>…</span>
                : <button key={p} onClick={() => onPageChange?.(p)}
                    style={{
                      padding: '0.3rem 0.65rem', borderRadius: '0.375rem', cursor: 'pointer', transition: 'all 0.15s',
                      border: p === page ? '0.5px solid #8B1A1A' : '0.5px solid #D4B896',
                      background: p === page ? '#8B1A1A' : 'transparent',
                      color: p === page ? '#FDF5EE' : '#5C3A1E',
                      fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: p === page ? 700 : 400, fontSize: '0.85rem',
                    }}
                    onMouseEnter={e => { if (p !== page) e.currentTarget.style.borderColor='#8B1A1A' }}
                    onMouseLeave={e => { if (p !== page) e.currentTarget.style.borderColor='#D4B896' }}
                  >{p}</button>
            ))}
            <button onClick={() => onPageChange?.(page + 1)} disabled={page >= totalPages}
              style={{
                padding: '0.3rem 0.75rem', borderRadius: '0.375rem',
                border: '0.5px solid #D4B896', background: 'transparent',
                color: '#A0794E', cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                opacity: page >= totalPages ? 0.4 : 1, transition: 'border-color 0.15s',
                fontFamily: "'Be Vietnam Pro', sans-serif",
              }}
              onMouseEnter={e => { if (page < totalPages) e.currentTarget.style.borderColor='#8B1A1A' }}
              onMouseLeave={e => e.currentTarget.style.borderColor='#D4B896'}
            >›</button>
          </div>
        </div>
      )}
    </div>
  )
}
