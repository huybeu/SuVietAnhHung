import { can, useRole } from '../../lib/permissions'

export default function Can({ role, perform, children, fallback = null }) {
  const resolvedRole = role ?? useRole()
  return can(resolvedRole, perform) ? children : fallback
}

export { useRole }
