# 開発ガイドライン

## 1. コーディング規約

### 基本方針

- TypeScript を使用し、`any` 型の使用を禁止する
- 関数は単一責任の原則に従い、1つのことだけを行う
- コメントはロジックが自明でない箇所にのみ記載する
- マジックナンバーは定数として定義する

### TypeScript

```ts
// NG: any型の使用
const data: any = fetchData()

// OK: 型を明示する
const data: WeightRecord[] = await fetchData()

// NG: 型アサーション（as）の乱用
const user = response as User

// OK: 型ガードで安全に絞り込む
function isUser(value: unknown): value is User {
  return typeof value === 'object' && value !== null && 'id' in value
}
```

### React コンポーネント

- コンポーネントは関数コンポーネントで統一する（クラスコンポーネント禁止）
- props の型は `interface` で定義する
- デフォルトエクスポートを使用する

```tsx
// コンポーネントの基本構造
interface WeightFormProps {
  onSubmit: (weight: number) => void
  isLoading?: boolean
}

export default function WeightForm({ onSubmit, isLoading = false }: WeightFormProps) {
  return (
    // ...
  )
}
```

### Server Components / Client Components

- デフォルトは Server Component（`'use client'` なし）
- インタラクション（onClick、useState、useEffect）が必要な場合のみ `'use client'` を付与する
- データフェッチは可能な限り Server Component で行う

```tsx
// Server Component（データフェッチを担当）
export default async function WeightPage() {
  const records = await getWeightRecords()
  return <WeightHistory records={records} />
}

// Client Component（インタラクションを担当）
'use client'
export default function WeightForm({ onSubmit }: WeightFormProps) {
  const [weight, setWeight] = useState('')
  // ...
}
```

### API Routes

- リクエストのバリデーションを必ず行う
- 認証チェックを必ず行い、未認証は `401` を返す
- エラーレスポンスは統一したフォーマットで返す

```ts
// API Routeの基本構造
export async function POST(request: Request) {
  // 1. 認証チェック
  const session = await getServerSession(authOptions)
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. バリデーション
  const body = await request.json()
  if (!body.weight || typeof body.weight !== 'number') {
    return Response.json({ error: 'Invalid weight' }, { status: 400 })
  }

  // 3. ビジネスロジック
  const record = await createWeightRecord({ userId: session.user.id, ...body })

  // 4. レスポンス
  return Response.json(record, { status: 201 })
}
```

---

## 2. 命名規則

### ファイル・ディレクトリ

| 種別 | 規則 | 例 |
|---|---|---|
| Reactコンポーネント | PascalCase | `WeightForm.tsx` |
| ページ | `page.tsx` 固定 | `app/weight/page.tsx` |
| APIルート | `route.ts` 固定 | `app/api/weight/route.ts` |
| Hooks | camelCase + `use` プレフィックス | `useWeight.ts` |
| ユーティリティ | kebab-case | `line-parser.ts` |
| 型定義ファイル | kebab-case | `weight.ts` |
| テストファイル | `[対象].test.ts(x)` | `calorie.test.ts` |

### コード内の命名

| 種別 | 規則 | 例 |
|---|---|---|
| 変数・関数 | camelCase | `weightRecord`, `fetchWeight()` |
| 定数 | UPPER_SNAKE_CASE | `MAX_WEIGHT_VALUE` |
| 型・インターフェース | PascalCase | `WeightRecord`, `MealType` |
| Enum | PascalCase（値もPascalCase） | `MealType.Breakfast` |
| コンポーネント | PascalCase | `WeightForm` |
| カスタムHooks | camelCase + `use` プレフィックス | `useWeight` |
| イベントハンドラ | `handle` プレフィックス | `handleSubmit`, `handleDelete` |
| 非同期関数 | 動詞 + 名詞 | `fetchWeightRecords`, `createMealRecord` |

### データベース（Prisma）

- テーブル名: PascalCase（例: `WeightRecord`）
- カラム名: camelCase（例: `userId`, `createdAt`）
- リレーション: 単数形（1対1）または複数形（1対多）

---

## 3. スタイリング規約

### 基本方針

- スタイリングは **Tailwind CSS のみ** を使用する
- インラインスタイル（`style={{ }}` 属性）は原則禁止
- カスタムCSSは `globals.css` に最小限で定義する
- コンポーネント固有のスタイルは `className` で記述する

### クラス名の記述順序

Tailwind CSS のクラスは以下の順序で記述する。

```
1. レイアウト       (flex, grid, block, hidden...)
2. 位置             (relative, absolute, fixed, top, left...)
3. サイズ           (w-, h-, min-, max-...)
4. スペーシング     (p-, m-, gap-, space-...)
5. 背景・ボーダー  (bg-, border-, rounded-...)
6. テキスト        (text-, font-, tracking-...)
7. エフェクト      (shadow-, opacity-, blur-...)
8. トランジション  (transition-, duration-, ease-...)
9. レスポンシブ    (sm:, md:, lg:...)
10. 状態修飾子     (hover:, focus:, active:, disabled:...)
```

```tsx
// 例
<button
  className="
    flex items-center justify-center
    w-full
    px-4 py-3
    rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
    text-sm font-semibold text-white
    shadow-lg shadow-purple-500/25
    transition-all duration-200
    hover:from-blue-600 hover:via-purple-600 hover:to-pink-600
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
  "
>
```

### デザイントークン

`functional-design.md` のデザインシステムで定義したカラー・スタイルを一貫して使用する。
独自の色コードを直接記述せず、必ず Tailwind のクラスを使う。

```tsx
// NG: 独自カラーコードの直接指定
<div style={{ backgroundColor: '#A855F7' }}>

// OK: Tailwindクラスを使用
<div className="bg-purple-500">
```

### レスポンシブデザイン

- モバイルファーストで記述する（スマホ向けをデフォルト、PCは `md:` 以上で上書き）
- ブレークポイント: `sm`（640px）, `md`（768px）, `lg`（1024px）

```tsx
// モバイルファーストの例
<div className="px-4 md:px-8 lg:px-16">
```

---

## 4. テスト規約

### テスト対象と優先度

| 対象 | 優先度 | 理由 |
|---|---|---|
| `src/utils/` | **必須** | 純粋関数で副作用がなくテストしやすい |
| `src/app/api/` | 推奨 | APIの正常系・異常系を網羅する |
| `src/lib/` | 任意 | 外部サービスへの依存があるためモック前提 |
| `src/components/` | 任意 | UIは目視確認を優先、ロジック部分のみ対象 |

### テストの書き方

```ts
// vitest の基本構造
import { describe, it, expect } from 'vitest'
import { calculateCalorieBalance } from './calorie'

describe('calculateCalorieBalance', () => {
  it('摂取カロリーから消費カロリーを引いた値を返す', () => {
    expect(calculateCalorieBalance(1800, 300)).toBe(1500)
  })

  it('消費カロリーが摂取カロリーを上回る場合は負の値を返す', () => {
    expect(calculateCalorieBalance(1200, 1500)).toBe(-300)
  })
})
```

### テストの命名規則

- `describe`: テスト対象の関数名・コンポーネント名
- `it`: 「〜の場合、〜を返す / 〜する」の形式で日本語で記述

---

## 5. Git 規約

### ブランチ命名規則

```
feature/[機能名]    # 機能追加
fix/[バグ内容]      # バグ修正
docs/[ドキュメント名]  # ドキュメント更新
refactor/[対象]    # リファクタリング
chore/[作業内容]   # 設定変更・依存関係更新
```

**例:**

```
feature/add-weight-form
feature/line-webhook
fix/calorie-calculation
docs/update-api-design
refactor/meal-components
chore/update-dependencies
```

### コミットメッセージ規約

[Conventional Commits](https://www.conventionalcommits.org/) に準拠する。

```
<type>: <概要（英語、命令形）>

<本文（任意、日本語可）>
```

**type 一覧:**

| type | 用途 |
|---|---|
| `feat` | 新機能の追加 |
| `fix` | バグ修正 |
| `docs` | ドキュメントのみの変更 |
| `style` | コードの動作に影響しない変更（フォーマット等） |
| `refactor` | バグ修正でも機能追加でもないコード変更 |
| `test` | テストの追加・修正 |
| `chore` | ビルドプロセスや補助ツールの変更 |

**例:**

```
feat: add weight record form
fix: correct calorie balance calculation
docs: update API design in functional-design.md
chore: update next.js to 15.3
```

### PRのルール

- タイトルはコミットメッセージと同じ形式（`feat: add weight form`）
- レビュー前にセルフレビューを行い、不要なデバッグコードを削除する
- CIがすべて通過していることを確認してからマージする
- `main` ブランチへの直接pushは禁止（PR必須）

### `.gitignore` で管理対象外にするもの

```
.env.local
.env.*.local
node_modules/
.next/
out/
*.log
.DS_Store
```

---

## 6. 品質チェック

実装後、以下をすべてパスしてからPRを作成する。

```bash
# Lint チェック
npm run lint

# 型チェック
npm run type-check

# テスト実行
npm run test

# ビルド確認
npm run build
```

これらは GitHub Actions の CI でも自動実行されるが、
PR作成前にローカルで確認することで手戻りを防ぐ。
