# 技術仕様書

## 1. テクノロジースタック

| レイヤー | 技術 |
|---|---|
| フロントエンド | Next.js（React） |
| バックエンド | Next.js API Routes |
| データベース | PostgreSQL（Supabase） |
| キャッシュ | Redis（Upstash） |
| 認証 | NextAuth.js（Googleログイン） |
| グラフ | Recharts |
| LINE連携 | LINE Messaging API |
| デプロイ | Vercel |

---

## 2. CI/CD

### 概要

GitHub Actions（CI）と Vercel（CD）を組み合わせた構成。
`main` ブランチへの直接pushを禁止し、必ずPR経由でマージする運用とする。

```
[ 開発者 ]
    │
    │ feature/* ブランチを作成して実装
    ▼
[ GitHub: Pull Request を作成 ]
    │
    │ PRを作成すると自動起動
    ▼
[ GitHub Actions: CI ]
    ├── Lint        （ESLint）
    ├── Type Check  （tsc --noEmit）
    ├── Unit Test   （Vitest）
    └── Build       （next build）  ← 上記3つが成功した場合のみ実行
    │
    │ 全ジョブ成功 → mergeボタンが有効になる
    │ いずれか失敗 → mergeボタンがグレーアウト（マージ不可）
    ▼
[ GitHub: main ブランチへ merge ]
    │
    │ mainへのマージを検知して自動起動
    ▼
[ Vercel: CD ]
    └── 本番環境へ自動デプロイ
```

---

### CI（GitHub Actions）

#### ワークフローファイル

`.github/workflows/ci.yml`

#### トリガー

`main` ブランチへのPull Request作成・更新時に起動。

#### ジョブ構成

| ジョブ名 | コマンド | 役割 |
|---|---|---|
| Lint | `npm run lint` | ESLintでコードスタイル・品質チェック |
| Type Check | `npm run type-check` | TypeScriptの型エラー検出 |
| Unit Test | `npm run test` | Vitestでユニットテスト実行 |
| Build | `npm run build` | Next.jsのビルドが通るか確認 |

#### 実行順序

```
Lint ─┐
      ├─→ Build（3つすべて成功時のみ実行）
Type Check ─┤
      │
Unit Test ─┘
```

Lint・Type Check・Unit Test は並列実行し、すべて成功した場合のみ Build を実行する。
これにより無駄なビルド実行を防ぎ、フィードバックを早くする。

#### 使用するNode.jsバージョン

`20`（LTS）

---

### CD（Vercel）

#### デプロイトリガー

| ブランチ | 動作 |
|---|---|
| `main` へのmerge | 本番環境へ自動デプロイ |
| `feature/*` へのpush | Preview URL を自動生成（PR上で確認可能） |

#### Preview URL

PRを作成するとVercelが自動でプレビュー環境を生成し、PRのコメントにURLを投稿する。
本番環境に影響を与えずに動作確認ができる。

---

### ブランチ保護ルール（GitHub）

`main` ブランチに以下のルールを設定。

| ルール | 設定値 |
|---|---|
| Pull Request必須 | 有効（直接pushを禁止） |
| CIステータスチェック必須 | 有効（全ジョブ成功でなければマージ不可） |

必須ステータスチェック対象:

- `Lint`
- `Type Check`
- `Unit Test`
- `Build`

---

### ブランチ戦略

```
main          ← 本番環境。直接pushは禁止。PRのみ受け付ける。
feature/*     ← 機能開発用（例: feature/add-weight-form）
fix/*         ← バグ修正用（例: fix/calorie-calculation）
```

---

## 3. 環境変数管理

機密情報はコードに直接書かず、環境変数で管理する。

| 環境 | 管理場所 |
|---|---|
| ローカル開発 | `.env.local`（Gitignore対象） |
| GitHub Actions | GitHub Repository Secrets |
| Vercel（本番） | Vercel Environment Variables |

### 主な環境変数

| 変数名 | 用途 |
|---|---|
| `NEXTAUTH_URL` | NextAuth.jsのベースURL |
| `NEXTAUTH_SECRET` | NextAuth.jsのセッション暗号化キー |
| `GOOGLE_CLIENT_ID` | Google OAuth クライアントID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth クライアントシークレット |
| `DATABASE_URL` | Supabase PostgreSQL接続文字列 |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis接続URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis認証トークン |
| `LINE_CHANNEL_SECRET` | LINE Messaging API チャンネルシークレット |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE Messaging API アクセストークン |

---

## 4. 開発ツールと手法

| ツール | 用途 |
|---|---|
| ESLint | コード品質チェック |
| TypeScript | 型安全な開発 |
| Vitest | ユニットテスト |
| Prettier | コードフォーマット |
| Tailwind CSS | スタイリング |
| Recharts | 体重推移グラフの描画 |
| React Hook Form | フォームの状態管理 |
| Zod | バリデーションスキーマの定義 |
| Prisma | データベースORM |

---

## 5. パフォーマンス要件

| 指標 | 目標値 |
|---|---|
| 主要画面の初回表示（LCP） | 3秒以内 |
| データ保存操作のレスポンス | 1秒以内 |

---

## 6. 技術的制約と要件

- インフラはすべて無料枠で運用（Supabase / Upstash / Vercelの無料プラン）
- スマホブラウザ（iOS Safari / Android Chrome）での動作を優先
- 画面幅320px以上のレスポンシブデザインに対応
