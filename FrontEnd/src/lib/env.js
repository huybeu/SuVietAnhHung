import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL:  z.string().url('VITE_API_URL phải là URL hợp lệ').optional(),
  VITE_APP_NAME: z.string().min(1).default('Sử Việt Anh Hùng'),
})

export function validateEnv() {
  const result = envSchema.safeParse({
    VITE_API_URL:  import.meta.env.VITE_API_URL,
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  })

  if (!result.success) {
    console.error('[ENV] Biến môi trường không hợp lệ:')
    result.error.errors.forEach(e => {
      console.error(`  ${e.path.join('.')}: ${e.message}`)
    })
  }

  return result.data ?? {}
}
