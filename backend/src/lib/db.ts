import { PrismaClient } from '@prisma/client';

// PrismaClientのインスタンスをグローバルに保持するための型定義
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// 既にグローバルにPrismaClientのインスタンスが存在する場合はそれを使用し、存在しない場合は新たに作成する
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// 開発環境では、ホットリロードによってPrismaClientのインスタンスが複数作成されるのを防ぐために、グローバルにインスタンスを保存する
if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma;
}
