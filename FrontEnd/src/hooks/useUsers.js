import { useQuery } from '@tanstack/react-query'
import { userService } from '../services/userService'
import { queryKeys } from '../lib/queryKeys'

// Lấy danh sách users có phân trang — params: { page, limit }
export function useUsers(params = {}) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn:  ({ signal }) => userService.getUsers(params, { signal }),
    staleTime: 30_000,
  })
}

// Lấy thông tin một user theo ID
export function useUser(id) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn:  ({ signal }) => userService.getUserById(id, { signal }),
    enabled:  !!id, // không gọi API nếu id là null/undefined
    staleTime: 30_000,
  })
}
