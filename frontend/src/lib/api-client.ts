import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

// サーバーコンポーネントから バックエンド API を呼ぶ関数
// NextAuth のセッションクッキー（JWTトークン）を Authorization ヘッダーに付与して送信する
export async function apiFetch(path: string, options?: RequestInit) {
  const cookieStore = await cookies()

  // NextAuth v5 のセッショントークンのクッキー名
  // 開発環境: authjs.session-token
  // 本番環境（HTTPS）: __Secure-authjs.session-token
  const token =
    cookieStore.get('authjs.session-token')?.value ??
    cookieStore.get('__Secure-authjs.session-token')?.value

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })
}
