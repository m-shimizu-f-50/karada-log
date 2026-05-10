# ADR-0004: ORM に Prisma を採用

- 日付: 2026-05-10
- 状態: 承認済み

## 背景

バックエンドから PostgreSQL を操作するにあたり、ORM の選定が必要だった。
TypeScript との親和性と実務での採用率を重視した。

## 検討した選択肢

| 選択肢 | 特徴 |
|---|---|
| **Prisma** | スキーマファイルで型定義とマイグレーションを一元管理。実務採用率が高い |
| **Drizzle ORM** | SQL ファーストの軽量 ORM。Cloudflare Workers など Edge 環境で動作する |
| TypeORM | デコレーターベース。Java の JPA に近い書き味 |
| Kysely | クエリビルダー。型安全だが記述量が多い |

## 決定

**Prisma** を採用する。

## 理由

- Node.js + TypeScript 環境での ORM として実務採用率が最も高い
- `schema.prisma` でデータモデルを定義すると型定義・マイグレーション・Client が自動生成される設計が直感的
- `npx prisma studio` でデータを GUI で確認できるため、開発時の検証がしやすい
- ドキュメントが充実しており、学習リソースが豊富
- 求人市場での需要が高く、学習価値が大きい

## Drizzle ORM を選ばなかった理由

- Drizzle は Cloudflare Workers など Edge 環境での採用が多く、Node.js サーバーでは Prisma の方が一般的
- 実務経験として Prisma を優先する方が現時点では価値が高い
- 将来 Edge 環境に移行する場合は Drizzle への切り替えを検討する

## トレードオフ・注意点

- Prisma は Cloudflare Workers（Edge）では動作しない（HTTP ドライバを使えば可能だが設定が複雑）
- スキーマ変更のたびにマイグレーションファイルを生成・適用する必要がある
- Prisma Client の初回生成に時間がかかる場合がある（CI での対策が必要）
