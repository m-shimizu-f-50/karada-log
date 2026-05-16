import { createMiddleware } from 'hono/factory';
import { hkdfSync } from 'node:crypto';
import { jwtDecrypt } from 'jose';
import { prisma } from '../lib/db.js';

export type AuthVariables = {
	userId: string;
};

// NextAuth v5 が使うのと同じ方法で AUTH_SECRET から暗号化キーを導出する
function getDerivedKey(secret: string): Uint8Array {
	return new Uint8Array(
		hkdfSync('sha256', secret, '', 'Auth.js Generated Encryption Key', 32),
	);
}

// リクエストの Authorization ヘッダーから JWT を検証し、userId をコンテキストにセットする
export const authMiddleware = createMiddleware<{ Variables: AuthVariables }>(
	async (c, next) => {
		const authHeader = c.req.header('Authorization');
		if (!authHeader?.startsWith('Bearer ')) {
			return c.json({ error: '認証が必要です' }, 401);
		}

		const token = authHeader.slice(7); // "Bearer " を除去してトークン部分がJWTトークン

		try {
			// JWTを取得して検証するための暗号化キーを導出
			const derivedKey = getDerivedKey(process.env.AUTH_SECRET!);
			const { payload } = await jwtDecrypt(token, derivedKey);

			const email = payload.email as string;
			const name = payload.name as string | undefined;
			const picture = payload.picture as string | undefined;

			// メールアドレスでユーザーを取得または新規作成
			const user = await prisma.user.upsert({
				where: { email },
				create: { email, name, image: picture },
				update: { name, image: picture },
			});

			c.set('userId', user.id);
			await next();
		} catch {
			return c.json({ error: '認証が無効です' }, 401);
		}
	},
);
