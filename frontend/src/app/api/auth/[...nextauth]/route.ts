import { handlers } from '@/lib/auth';

// 認証のエンドポイント
// NextAuth.js が必要とする GET / POST ハンドラをそのままエクスポート
export const { GET, POST } = handlers;
