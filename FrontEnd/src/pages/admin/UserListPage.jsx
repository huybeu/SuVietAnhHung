import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'

const ROLES = ['viewer', 'editor', 'superadmin']

const ROLE_LABELS = {
  viewer:     'Xem',
  editor:     'Biên Tập',
  superadmin: 'Superadmin',
}

const ROLE_STYLE = {
  viewer:     { borderColor: '#D4B896',  color: '#A0794E', background: 'rgba(196,149,106,0.08)' },
  editor:     { borderColor: '#8B1A1A',  color: '#8B1A1A', background: 'rgba(139,26,26,0.10)'  },
  superadmin: { borderColor: '#C4956A',  color: '#8B1A1A', background: 'rgba(196,149,106,0.15)' },
}

/* Mock data — thay bằng API call thực tế */
const MOCK_USERS = [
  { id: 1,  username: 'admin',      displayName: 'Nguyễn Quản Trị', email: 'admin@suviet.vn',   role: 'superadmin', createdAt: '2024-01-15' },
  { id: 2,  username: 'editor01',   displayName: 'Trần Biên Tập',   email: 'editor01@suviet.vn', role: 'editor',     createdAt: '2024-02-20' },
  { id: 3,  username: 'user_an',    displayName: 'Lê Văn An',       email: 'le.an@gmail.com',    role: 'viewer',     createdAt: '2024-03-10' },
  { id: 4,  username: 'user_binh',  displayName: 'Phạm Thị Bình',   email: 'pham.b@gmail.com',   role: 'viewer',     createdAt: '2024-04-05' },
  { id: 5,  username: 'editor02',   displayName: 'Hoàng Minh',      email: 'h.minh@suviet.vn',   role: 'editor',     createdAt: '2024-05-18' },
]

function RoleBadge({ role }) {
  const s = ROLE_STYLE[role] || ROLE_STYLE.viewer
  return (
    <span style={{
      display: 'inline-block', padding: '0.18rem 0.55rem',
      borderRadius: '4px', border: '0.5px solid',
      fontSize: '0.72rem', letterSpacing: '0.03em', fontWeight: 600,
      fontFamily: "'Be Vietnam Pro', sans-serif",
      ...s,
    }}>
      {ROLE_LABELS[role] ?? role}
    </span>
  )
}

export default function UserListPage() {
  const [users, setUsers]     = useState(MOCK_USERS)
  const [search, setSearch]   = useState('')
  const [editingId, setEditingId] = useState(null)
  const [pendingRole, setPendingRole] = useState('')
  const [saving, setSaving]   = useState(false)
  const [toast, setToast]     = useState(null)

  const filtered = users.filter(u =>
    u.displayName.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  function startEdit(user) {
    setEditingId(user.id)
    setPendingRole(user.role)
  }

  function cancelEdit() {
    setEditingId(null)
    setPendingRole('')
  }

  async function saveRole(userId) {
    setSaving(true)
    /* TODO: gọi API PATCH /admin/users/:id/role { role: pendingRole } */
    await new Promise(r => setTimeout(r, 600))
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: pendingRole } : u))
    setSaving(false)
    setEditingId(null)
    setPendingRole('')
    showToast('Cập nhật vai trò thành công!')
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const inputStyle = {
    padding: '0.5rem 0.75rem',
    border: '0.5px solid rgba(196,149,106,0.5)',
    borderRadius: '8px',
    background: '#FDF5EE',
    color: '#3D2B1A',
    fontSize: '0.875rem',
    fontFamily: "'Be Vietnam Pro', sans-serif",
    outline: 'none',
  }

  return (
    <AdminLayout topbarTitle="Người Dùng" topbarBreadcrumbs={[{ label: 'Người Dùng' }]}>
      <style>{`
        .user-row { transition: background 0.15s; }
        .user-row:hover { background: rgba(196,149,106,0.05); }
        @keyframes toast-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ padding: '2rem', maxWidth: 1100 }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', color: '#C4956A', fontVariationSettings: "'FILL' 1" }}>group</span>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#3D2B1A', fontWeight: 700, margin: 0 }}>
              Quản Lý Người Dùng
            </h1>
          </div>
          <p style={{ color: '#A0794E', fontSize: '0.85rem', fontFamily: "'Be Vietnam Pro', sans-serif", margin: 0 }}>
            Xem danh sách thành viên và thay đổi vai trò. Không thể chỉnh sửa thông tin cá nhân.
          </p>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 0 }}>
            <span className="material-symbols-outlined" style={{
              position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
              fontSize: '18px', color: 'rgba(61,43,26,0.35)',
            }}>search</span>
            <input
              type="text"
              placeholder="Tìm kiếm tên, username, email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, width: '100%', paddingLeft: '2.5rem', boxSizing: 'border-box' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#C4956A'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(196,149,106,0.15)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(196,149,106,0.5)'; e.currentTarget.style.boxShadow = 'none' }}
            />
          </div>
          <span style={{ color: '#A0794E', fontSize: '0.82rem', fontFamily: "'Be Vietnam Pro', sans-serif", whiteSpace: 'nowrap' }}>
            {filtered.length} / {users.length} người dùng
          </span>
        </div>

        {/* Table card */}
        <div style={{
          background: '#FDF5EE', border: '0.5px solid #D4B896',
          borderRadius: '12px', boxShadow: '0 2px 12px rgba(61,43,26,0.07)',
          overflow: 'hidden',
        }}>

          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1fr',
            gap: '1rem',
            padding: '0.75rem 1.25rem',
            background: '#FAE8DA',
            borderBottom: '0.5px solid #D4B896',
          }}>
            {['Người Dùng', 'Email', 'Tên Đăng Nhập', 'Vai Trò', 'Thao Tác'].map(h => (
              <span key={h} style={{
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em',
                color: 'rgba(61,43,26,0.45)', textTransform: 'uppercase',
              }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#A0794E', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.88rem' }}>
              Không tìm thấy người dùng nào.
            </div>
          ) : (
            filtered.map(user => {
              const isEditing = editingId === user.id
              return (
                <div
                  key={user.id}
                  className="user-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1fr',
                    gap: '1rem',
                    padding: '0.875rem 1.25rem',
                    borderBottom: '0.5px solid rgba(212,184,150,0.4)',
                    alignItems: 'center',
                  }}
                >
                  {/* Display name + avatar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(139,26,26,0.10)', border: '0.5px solid rgba(196,149,106,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontFamily: "'Playfair Display', serif", color: '#8B1A1A', fontSize: '0.9rem', fontWeight: 700 }}>
                        {user.displayName[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.875rem', fontWeight: 600, color: '#3D2B1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.displayName}
                      </p>
                      <p style={{ margin: 0, fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.72rem', color: '#A0794E' }}>
                        Từ {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <span style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.82rem', color: '#5C3A1E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.email}
                  </span>

                  {/* Username */}
                  <span style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.82rem', color: '#7B4A00', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    @{user.username}
                  </span>

                  {/* Role — editable */}
                  <div>
                    {isEditing ? (
                      <select
                        value={pendingRole}
                        onChange={e => setPendingRole(e.target.value)}
                        style={{
                          ...inputStyle,
                          padding: '0.3rem 0.5rem',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                        }}
                      >
                        {ROLES.map(r => (
                          <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                        ))}
                      </select>
                    ) : (
                      <RoleBadge role={user.role} />
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => saveRole(user.id)}
                          disabled={saving}
                          style={{
                            background: '#8B1A1A', color: '#FDF5EE', border: 'none',
                            borderRadius: '6px', padding: '0.35rem 0.7rem',
                            fontSize: '0.75rem', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
                            fontFamily: "'Be Vietnam Pro', sans-serif",
                            display: 'flex', alignItems: 'center', gap: '0.25rem',
                            opacity: saving ? 0.65 : 1,
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => { if (!saving) e.currentTarget.style.background = '#6B1414' }}
                          onMouseLeave={e => { if (!saving) e.currentTarget.style.background = '#8B1A1A' }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                            {saving ? 'hourglass_empty' : 'check'}
                          </span>
                          {saving ? '...' : 'Lưu'}
                        </button>
                        <button
                          onClick={cancelEdit}
                          style={{
                            background: 'transparent', color: '#5C3A1E',
                            border: '0.5px solid #D4B896', borderRadius: '6px',
                            padding: '0.35rem 0.6rem', fontSize: '0.75rem',
                            cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif",
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(61,43,26,0.05)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          Huỷ
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEdit(user)}
                        title="Thay đổi vai trò"
                        style={{
                          background: 'transparent', border: '0.5px solid rgba(196,149,106,0.4)',
                          borderRadius: '6px', padding: '0.35rem 0.6rem',
                          color: '#7B4A00', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '0.25rem',
                          fontSize: '0.75rem', fontFamily: "'Be Vietnam Pro', sans-serif",
                          fontWeight: 600, transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(196,149,106,0.1)'; e.currentTarget.style.borderColor = '#C4956A' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(196,149,106,0.4)' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit</span>
                        Vai Trò
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '1.5rem',
          background: '#2A7A2A', color: '#fff',
          padding: '0.75rem 1.25rem', borderRadius: '10px',
          fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.88rem', fontWeight: 600,
          zIndex: 300, display: 'flex', alignItems: 'center', gap: '0.5rem',
          boxShadow: '0 4px 20px rgba(42,122,42,0.35)',
          animation: 'toast-in 0.3s ease',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          {toast}
        </div>
      )}
    </AdminLayout>
  )
}
