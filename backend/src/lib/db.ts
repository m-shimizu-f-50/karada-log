import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from 'dotenv';

// .envファイルから環境変数を読み込む（tsx は自動で .env を読まないため明示的に呼ぶ）
config();

// PrismaClientのインスタンスをグローバルに保持するための型定義
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Prisma v7 ではアダプター経由でDBに接続する（新しいJavaScriptエンジン採用のため）
function createPrismaClient() {
	const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
	return new PrismaClient({ adapter });
}

// 既にグローバルにPrismaClientのインスタンスが存在する場合はそれを使用し、存在しない場合は新たに作成する
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// 開発環境では、ホットリロードによってPrismaClientのインスタンスが複数作成されるのを防ぐために、グローバルにインスタンスを保存する
if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma;
}
