# リポジトリ構造定義書

## 1. ディレクトリ全体構成

```
karada-log/
├── .github/
│   └── workflows/
│       └── ci.yml                  # GitHub Actions CI設定
├── .steering/                      # 作業単位のドキュメント（開発履歴）
├── docs/                           # 永続的ドキュメント
│   ├── product-requirements.md
│   ├── functional-design.md
│   ├── architecture.md
│   ├── repository-structure.md
│   ├── development-guidelines.md
│   └── glossary.md
├── prisma/                         # Prisma（ORM）
│   ├── schema.prisma               # スキーマ定義
│   └── migrations/                 # マイグレーションファイル
├── public/                         # 静的ファイル
│   ├── icons/                      # PWA用アイコン
│   └── images/                     # 画像ファイル
├── src/                            # アプリケーションソースコード
│   ├── app/                        # Next.js App Router
│   ├── components/                 # Reactコンポーネント
│   ├── lib/                        # ユーティリティ・外部サービス設定
│   ├── hooks/                      # カスタムReact Hooks
│   ├── types/                      # TypeScript型定義
│   └── utils/                      # 汎用ヘルパー関数
├── .env.local                      # ローカル環境変数（Gitignore対象）
├── .env.example                    # 環境変数のテンプレート（Git管理対象）
├── .gitignore
├── .eslintrc.json                  # ESLint設定
├── .prettierrc                     # Prettier設定
├── CLAUDE.md                       # プロジェクトメモリ
├── next.config.ts                  # Next.js設定
├── package.json
├── tailwind.config.ts              # Tailwind CSS設定
├── tsconfig.json                   # TypeScript設定
└── vitest.config.ts                # Vitest設定
```

---

## 2. `src/app/` ディレクトリ（App Router）

```
src/app/
├── layout.tsx                      # ルートレイアウト（フォント・背景エフェクト）
├── page.tsx                        # ログインページ（/）
├── globals.css                     # グローバルスタイル
├── dashboard/
│   └── page.tsx                    # ダッシュボード（/dashboard）
├── weight/
│   └── page.tsx                    # 体重記録ページ（/weight）
├── meal/
│   └── page.tsx                    # 食事記録ページ（/meal）
├── exercise/
│   └── page.tsx                    # 運動記録ページ（/exercise）
└── api/
    ├── auth/
    │   └── [...nextauth]/
    │       └── route.ts            # NextAuth.jsハンドラ
    ├── weight/
    │   ├── route.ts                # GET, POST /api/weight
    │   ├── [id]/
    │   │   └── route.ts            # DELETE /api/weight/[id]
    │   └── goal/
    │       └── route.ts            # GET, PUT /api/weight/goal
    ├── meal/
    │   ├── route.ts                # GET, POST /api/meal
    │   └── [id]/
    │       └── route.ts            # DELETE /api/meal/[id]
    ├── exercise/
    │   ├── route.ts                # GET, POST /api/exercise
    │   └── [id]/
    │       └── route.ts            # DELETE /api/exercise/[id]
    └── line/
        └── webhook/
            └── route.ts            # POST /api/line/webhook
```

---

## 3. `src/components/` ディレクトリ

```
src/components/
├── layout/
│   ├── Header.tsx                  # ヘッダー（タイトル・ログアウトボタン）
│   ├── BottomNav.tsx               # ボトムナビゲーション（スマホ用）
│   └── BackgroundEffect.tsx        # 背景グローエフェクト
├── ui/                             # 汎用UIコンポーネント
│   ├── Button.tsx                  # グラデーションボタン・アウトラインボタン
│   ├── Card.tsx                    # カード・グラデーションボーダーカード
│   ├── Input.tsx                   # テキスト入力フィールド
│   └── GradientText.tsx            # グラデーションテキスト
├── weight/
│   ├── WeightForm.tsx              # 体重入力フォーム
│   ├── WeightChart.tsx             # 体重推移グラフ（折れ線）
│   ├── WeightHistory.tsx           # 体重記録履歴リスト
│   └── WeightGoalForm.tsx          # 目標体重設定フォーム
├── meal/
│   ├── MealTabBar.tsx              # 朝昼夜間食タブ切り替え
│   ├── MealForm.tsx                # 食事入力フォーム
│   └── MealList.tsx                # 食事記録リスト
├── exercise/
│   ├── ExerciseForm.tsx            # 運動入力フォーム
│   └── ExerciseList.tsx            # 運動記録リスト
└── dashboard/
    ├── WeightSummary.tsx           # 今日の体重サマリーカード
    └── CalorieSummary.tsx          # カロリー収支サマリーカード
```

---

## 4. `src/lib/` ディレクトリ

```
src/lib/
├── auth.ts                         # NextAuth.js設定（プロバイダー・コールバック）
├── db.ts                           # Prisma Clientのシングルトン
├── redis.ts                        # Upstash Redisクライアント
└── line.ts                         # LINE SDK設定・メッセージ送信ヘルパー
```

---

## 5. `src/hooks/` ディレクトリ

```
src/hooks/
├── useWeight.ts                    # 体重データのfetch・mutation
├── useMeal.ts                      # 食事データのfetch・mutation
└── useExercise.ts                  # 運動データのfetch・mutation
```

---

## 6. `src/types/` ディレクトリ

```
src/types/
├── weight.ts                       # 体重関連の型定義
├── meal.ts                         # 食事関連の型定義
├── exercise.ts                     # 運動関連の型定義
└── line.ts                         # LINE Webhook関連の型定義
```

---

## 7. `src/utils/` ディレクトリ

```
src/utils/
├── date.ts                         # 日付フォーマットヘルパー
├── calorie.ts                      # カロリー計算ヘルパー
└── line-parser.ts                  # LINEメッセージ解析ロジック
```

---

## 8. テストファイルの配置ルール

テストファイルはテスト対象ファイルと同じディレクトリに配置する。

```
src/utils/
├── calorie.ts
├── calorie.test.ts                 # ← 同じディレクトリに配置
├── line-parser.ts
└── line-parser.test.ts
```

| 対象 | テストの優先度 |
|---|---|
| `src/utils/` | 高（純粋関数が多いため必ずテストを書く） |
| `src/lib/` | 中（外部サービスとの境界部分） |
| `src/components/` | 低（UIは目視確認を優先） |
| `src/app/api/` | 中（APIルートの正常系・異常系） |

---

## 9. ファイル配置ルール

### 命名規則

| 種別 | 規則 | 例 |
|---|---|---|
| Reactコンポーネント | PascalCase | `WeightForm.tsx` |
| ページ（App Router） | `page.tsx` 固定 | `app/weight/page.tsx` |
| APIルート（App Router） | `route.ts` 固定 | `app/api/weight/route.ts` |
| Hooks | camelCase、`use` プレフィックス | `useWeight.ts` |
| ユーティリティ | camelCase | `line-parser.ts` |
| 型定義 | camelCase | `weight.ts` |
| テスト | `[対象ファイル名].test.ts(x)` | `calorie.test.ts` |

### 新規ファイル追加時のルール

- コンポーネントは必ず `src/components/` の機能別サブディレクトリに配置する
- 複数箇所で使う汎用UIは `src/components/ui/` に配置する
- 1つの機能にしか使わないコンポーネントは機能別ディレクトリ（例: `weight/`）に置く
- API Routeのファイルは `src/app/api/` 以下に配置し、RESTfulなパス設計に従う
- 環境変数は必ず `.env.example` にダミー値で追記してからコードで使用する

---

## 10. 環境変数ファイル

| ファイル | Git管理 | 用途 |
|---|---|---|
| `.env.local` | 対象外 | ローカル開発用の実際の値 |
| `.env.example` | 対象 | 必要な環境変数のテンプレート（値はダミー） |

`.env.example` の記載例:

```bash
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Supabase
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# LINE
LINE_CHANNEL_SECRET=your-line-channel-secret
LINE_CHANNEL_ACCESS_TOKEN=your-line-channel-access-token
```
