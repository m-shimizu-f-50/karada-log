import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

// サーバーコンポーネントから バックエンド API を呼ぶ関数
// NextAuth のセッションクッキー（JWTトークン）を Authorization ヘッダーに付与して送信する
export async function apiFetch(path: string, options?: RequestInit) {
	// サーバー側でクッキーを読むNextJsの関数
	const cookieStore = await cookies();

	// NextAuth v5 のセッショントークンのクッキー名(環境によって異なる)を取得
	// 開発環境: authjs.session-token
	// 本番環境（HTTPS）: __Secure-authjs.session-token
	const token =
		cookieStore.get('authjs.session-token')?.value ?? // 開発環境
		cookieStore.get('__Secure-authjs.session-token')?.value; // 本番環境

	return fetch(`${API_URL}${path}`, {
		...options, // 呼び出し元から渡されたオプション(method, bodyなど)を展開
		headers: {
			'Content-Type': 'application/json',
			// JWTトークンが存在する場合は Authorization ヘッダーに Bearer トークンとして追加
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...options?.headers,
		},
	});
}
