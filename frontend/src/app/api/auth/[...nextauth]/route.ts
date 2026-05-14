import { handlers } from '@/lib/auth'

// NextAuth.js が必要とする GET / POST ハンドラをそのままエクスポート
export const { GET, POST } = handlers
