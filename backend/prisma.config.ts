import { defineConfig } from 'prisma/config';
import { config } from 'dotenv';

// .envファイルから環境変数を読み込む
config();

export default defineConfig({
	datasource: {
		// データベース接続の設定
		url: process.env.DATABASE_URL!,
	},
});
