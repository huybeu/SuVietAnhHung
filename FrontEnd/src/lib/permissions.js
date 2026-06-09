const PERMISSIONS = {
  'heroes:read':        ['superadmin', 'editor', 'viewer'],
  'heroes:write':       ['superadmin', 'editor'],
  'heroes:delete':      ['superadmin'],
  'articles:read':      ['superadmin', 'editor', 'viewer'],
  'articles:write':     ['superadmin', 'editor'],
  'articles:publish':   ['superadmin', 'editor'],
  'articles:archive':   ['superadmin'],
  'articles:delete':    ['superadmin'],
  'videos:read':        ['superadmin', 'editor', 'viewer'],
  'videos:write':       ['superadmin', 'editor'],
  'videos:delete':      ['superadmin'],
  'eras:write':         ['superadmin', 'editor'],
  'donations:read':     ['superadmin', 'editor', 'viewer'],
  'donations:confirm':  ['superadmin', 'editor'],
  'sponsors:write':     ['superadmin', 'editor'],
  'media:upload':       ['superadmin', 'editor'],
  'media:delete':       ['superadmin'],
  'site_config:write':  ['superadmin'],
  'users:read':         ['superadmin'],
  'users:write':        ['superadmin'],
}

export function can(role, action) {
  if (!role || !action) return false
  return (PERMISSIONS[action] || []).includes(role)
}

export function useRole() {
  try {
    // DEV_BYPASS: không có localStorage user, nhưng vẫn cần quyền superadmin
    if (import.meta.env.VITE_DEV_BYPASS === 'true') return 'superadmin'

    const u = JSON.parse(localStorage.getItem('loggedInUser') || 'null')
    if (!u) return 'viewer'
    if (u.role) return u.role === 'admin' ? 'superadmin' : u.role
    if (u.isAdmin) return 'superadmin'
    return 'editor'
  } catch {
    return 'viewer'
  }
}
