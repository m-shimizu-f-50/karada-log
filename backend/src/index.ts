import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { AuthVariables } from './middleware/auth.js';
import weightRoute from './routes/weight.js';
import mealRoute from './routes/meal.js';

// Honoアプリケーションのインスタンスを作成し、AuthVariables型を指定(認証情報をContextで使用するための型定義)
const app = new Hono<{ Variables: AuthVariables }>();

// CORSミドルウェアを全てのルートに適用(フロントエンドからのリクエストを許可するため)
app.use(
	'*',
	cors({
		// フロントエンドのURLを環境変数から取得し、デフォルトはhttp://localhost:3000
		origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
		credentials: true,
	}),
);

// ヘルスチェック用のエンドポイントを定義(サーバーが正常に動作しているか確認するため)
app.get('/health', (c) => {
	return c.json({ status: 'ok' });
});

// 体重記録ルートを登録(/api/weight 以下のリクエストを処理する)
app.route('/api/weight', weightRoute);

// 食事記録ルートを登録(/api/meal 以下のリクエストを処理する)
app.route('/api/meal', mealRoute);

// サーバーを起動するポートを環境変数から取得し、デフォルトは8080
const port = Number(process.env.PORT) || 8080;

serve({ fetch: app.fetch, port }, () => {
	console.log(`Server running on http://localhost:${port}`);
});
