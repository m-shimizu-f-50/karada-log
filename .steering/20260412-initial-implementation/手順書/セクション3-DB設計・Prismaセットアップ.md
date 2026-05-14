# セクション3: DB設計・Prisma セットアップ

## このセクションで作るもの

Supabase（クラウドのデータベース）にテーブルを作成し、
バックエンドから TypeScript でデータベースを操作できる状態にする。

---

## 前提知識

### データベースとは

データを永続的に保存する場所。
アプリを再起動してもデータが消えないようにするために使う。

```
アプリ（メモリ）          データベース
再起動すると消える  ←→  永続的に保存される

let weight = 68.5  ←→  weight_records テーブルの中に保存
```

### SQL とは

データベースを操作するための言語。

```sql
-- テーブルを作る
CREATE TABLE users (id TEXT, email TEXT);

-- データを追加する
INSERT INTO users VALUES ('user-1', 'test@example.com');

-- データを取得する
SELECT * FROM users WHERE email = 'test@example.com';
```

### ORM とは

「Object-Relational Mapper」の略。
SQL を直接書かずに、TypeScript のコードでデータベースを操作できるようにするライブラリ。

```typescript
// SQL を直接書く場合
db.query("SELECT * FROM users WHERE email = 'test@example.com'")

// ORM（Prisma）を使う場合
prisma.user.findFirst({ where: { email: 'test@example.com' } })
```

ORM を使う利点：
- TypeScript の型が使える（間違いをコードで検出できる）
- SQL インジェクション（セキュリティの脆弱性）を自動で防いでくれる
- データベースの種類が変わってもコードを変えなくていい

### Prisma とは

Node.js / TypeScript 用の ORM。
スキーマファイル（設計図）を書くと、TypeScript の型付き操作関数を自動生成してくれる。

### Supabase とは

PostgreSQL データベースをクラウドで提供するサービス。
無料プランで 500MB まで使える。
ダッシュボードからテーブルの中身を確認したり、SQL を実行したりできる。

---

## 実施内容

### 1. Supabase でプロジェクトを作成した（手動）

Supabase のダッシュボードでプロジェクトを作成し、接続文字列を取得した。

### 2. `backend/.env` に `DATABASE_URL` を設定した

```
DATABASE_URL="postgresql://postgres:パスワード@db.xxxx.supabase.co:5432/postgres"
```

### 3. `prisma/schema.prisma` を作成した

データベースのテーブル設計を定義するファイル。

### 4. `prisma.config.ts` を作成した

Prisma 7 から必要になった設定ファイル。接続先 URL を指定する。

### 5. Supabase SQL エディタでテーブルを作成した

通常は `npx prisma migrate dev` コマンドで自動作成できるが、
開発環境からポート 5432 への接続がブロックされていたため、
SQL を生成して Supabase のダッシュボードから手動で実行した。

### 6. `npx prisma generate` を実行した

Prisma Client（TypeScript でDB操作するライブラリ）を生成した。

### 7. `src/lib/db.ts` を作成した

Prisma Client のシングルトンを定義するファイル。

---

## 作成されたファイルの解説

### `prisma/schema.prisma` — テーブル設計図

Prisma の中核となるファイル。「どんなテーブルが必要か」を定義する。

#### 基本構造

```prisma
generator client {
  provider = "prisma-client-js"
}
// ↑ TypeScript 用の Prisma Client を生成する設定

datasource db {
  provider = "postgresql"
}
// ↑ データベースの種類（PostgreSQL）を指定
//   接続URLは prisma.config.ts に記述（Prisma 7 の新しい方式）
```

#### モデル（テーブル）の定義

```prisma
model User {
  id        String   @id @default(cuid())
  // ↑ 主キー。自動的に一意のIDが生成される（例: clx1234abcd5678）

  email     String   @unique
  // ↑ メールアドレス。@unique = 重複不可

  name      String?
  // ↑ ? は「null でもいい（任意）」という意味

  image     String?
  createdAt DateTime @default(now())
  // ↑ 作成日時。レコード作成時に自動で現在時刻が入る

  @@map("users")
  // ↑ データベース上のテーブル名を "users" にする
  //   （Prisma のモデル名は User だが、テーブル名は users）
}
```

#### 全テーブルの役割

| モデル | テーブル | 役割 |
|---|---|---|
| `User` | `users` | ユーザーの基本情報 |
| `Account` | `accounts` | Google 連携情報（NextAuth.js が自動で使う） |
| `Session` | `sessions` | ログインセッション（NextAuth.js が自動で使う） |
| `WeightRecord` | `weight_records` | 体重の記録（日付・体重） |
| `WeightGoal` | `weight_goals` | 目標体重 |
| `MealRecord` | `meal_records` | 食事の記録（食品名・カロリー・食事区分） |
| `ExerciseRecord` | `exercise_records` | 運動の記録（種目・時間・消費カロリー） |

#### リレーション（テーブル間の関係）

```prisma
model WeightRecord {
  id     String   @id @default(cuid())
  userId String
  // ↑ どのユーザーの記録か（User テーブルの id を参照）

  date   DateTime @db.Date
  weight Decimal  @db.Decimal(5, 1)
  // ↑ Decimal(5, 1) = 小数点1桁まで、合計5桁（例: 123.4）

  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  // ↑ userId は User テーブルの id と紐づいている
  //   onDelete: Cascade = ユーザーが削除されたら関連する記録も削除

  @@unique([userId, date])
  // ↑ 同じユーザーが同じ日に2件記録できない制約
  //   （体重は1日1件、同じ日に登録したら上書きする仕様）

  @@map("weight_records")
}
```

**リレーションとは？**
テーブル同士の「関係」のこと。
体重記録は必ず「誰かのもの」なので、User テーブルと紐づけている。

```
users テーブル
  id: "user-abc"
  email: "test@example.com"
        ↑
        │ この id を参照
        │
weight_records テーブル
  id: "rec-001"
  userId: "user-abc"  ← どのユーザーの記録か
  date: 2026-04-12
  weight: 68.5
```

### `prisma.config.ts` — Prisma の設定ファイル

```typescript
import { defineConfig } from 'prisma/config'
import { config } from 'dotenv'

config()
// ↑ .env ファイルを読み込む
//   これにより process.env.DATABASE_URL が使えるようになる

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,
    // ↑ データベースの接続先 URL
    //   ! は「この値は必ず存在する」という TypeScript への宣言（Non-null assertion）
  },
})
```

**なぜ `schema.prisma` に URL を書かないのか？**
Prisma 7 からのルールが変わった。
以前は `schema.prisma` の `datasource` ブロックに `url = env("DATABASE_URL")` と書いていた。
Prisma 7 からは `prisma.config.ts` という別ファイルに書く方式に変更された。

### `src/lib/db.ts` — Prisma Client のシングルトン

```typescript
import { PrismaClient } from '@prisma/client'

// グローバル変数として prisma クライアントを保持するための型
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// すでに存在すれば再利用、なければ新規作成
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient()

// 開発環境のみ: グローバル変数にキャッシュする
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

**シングルトンとは？**
「アプリ全体で1つだけ存在するインスタンス」のこと。

**なぜシングルトンが必要か？**
`new PrismaClient()` を呼ぶたびに、データベースへの新しい接続が作られる。

```typescript
// ❌ 悪い例: ファイルごとに new PrismaClient() すると接続が増える
// route-a.ts
const prisma = new PrismaClient()  // 接続 #1

// route-b.ts
const prisma = new PrismaClient()  // 接続 #2（無駄！）
```

開発環境では、ファイルを保存するたびにコードが再読み込みされる（ホットリロード）。
毎回 `new PrismaClient()` すると接続が際限なく増えてエラーになる。

グローバル変数にキャッシュすることで、再読み込みが起きても同じ接続を使い回せる。

```typescript
// ✅ 良い例: シングルトン
// どのファイルからインポートしても同じインスタンスが返る
import { prisma } from '../lib/db.js'

const users = await prisma.user.findMany()
```

**`globalThis` とは？**
Node.js・ブラウザなどどの環境でも使える、真のグローバルオブジェクト。
ここに `prisma` を保存することで、モジュールの再読み込みを超えて値を保持できる。

---

## マイグレーションとは

データベースの構造変更（テーブルの追加・カラムの追加など）を管理する仕組み。

```
変更前: users テーブルに name カラムがない
                ↓ マイグレーション実行
変更後: users テーブルに name カラムが追加された
```

**通常の流れ（ポート 5432 が使える環境）**：
```bash
npx prisma migrate dev --name init
# → schema.prisma を読んでSQLを生成し、DBに適用する
```

**今回の対応（ポート 5432 がブロックされていた）**：
```bash
# SQLだけ生成する（DBへの接続は不要）
npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script

# → 生成されたSQLをコピーして Supabase の SQL エディタに貼り付けて実行
```

---

## `npx prisma generate` とは

`schema.prisma` を読んで、TypeScript 用の型付きDB操作関数を生成するコマンド。
生成されたコードは `node_modules/@prisma/client` に保存される。

実行後、このように型安全なコードが書けるようになる：

```typescript
// 型補完が効く
const user = await prisma.user.findFirst({
  where: { email: 'test@example.com' }
})

// user は User 型 | null
console.log(user?.name)  // TypeScript がプロパティを知っている

// 間違ったプロパティはコードを書いた時点でエラー
console.log(user?.phone)  // ← エラー: 'phone' プロパティは存在しない
```

---

## ファイル間の関係

```
prisma/schema.prisma（設計図）
        │
        │ npx prisma generate
        ▼
node_modules/@prisma/client（型付きDB操作関数）
        │
        │ import { PrismaClient } from '@prisma/client'
        ▼
src/lib/db.ts（シングルトン）
        │
        │ import { prisma } from './lib/db.js'
        ▼
src/routes/*.ts（各APIルート）
        │
        │ prisma.user.findMany() など
        ▼
Supabase（実際のデータベース）
```

---

## ハマった点・補足

- **Prisma 7 の設定方法が変わっていた**: `schema.prisma` に `url = env("DATABASE_URL")` と書く旧来の方法が廃止。`prisma.config.ts` に URL を書く方式に変更された
- **DevContainer からポート 5432 への接続がブロック**: クラウド開発環境はセキュリティ上、外部データベースへの直接接続（ポート 5432）が制限されている場合がある。代替として SQL を生成して Supabase の SQL エディタで実行した
- **Supabase の RLS 警告**: テーブル作成時に「RLS が有効になっていない」という警告が表示された。RLS（Row Level Security）は Supabase クライアントから直接テーブルにアクセスするときのセキュリティ機能。このプロジェクトはバックエンド API 経由でアクセスするため不要

---

## 確認したこと

- Supabase の「Table Editor」で7つのテーブルが作成されていることを確認
- `npx prisma generate` が成功し、Prisma Client が生成された
- バックエンドの型チェック（`npm run type-check`）がエラーなしで通る
