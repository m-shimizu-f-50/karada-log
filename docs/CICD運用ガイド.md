# CI/CD 運用ガイド

## CI/CD とは

### CI（Continuous Integration / 継続的インテグレーション）

コードを Push・PR するたびに「壊れていないか」を**自動でチェック**する仕組み。

人間がレビューする前に機械がチェックするので、ケアレスミスや型エラーをリポジトリに混入させない。

### CD（Continuous Delivery / 継続的デリバリー）

CI が通ったコードを**自動でデプロイ**する仕組み。
`main` ブランチにマージされると、Vercel（フロントエンド）と Render（バックエンド）へ自動でデプロイが走る。

---

## 現在の設定状況

### CI（GitHub Actions）

| ジョブ | 状態 | 内容 |
|---|---|---|
| `Frontend: Lint` | ✅ 設定済み | ESLint でコード品質チェック |
| `Frontend: Type Check` | ✅ 設定済み | TypeScript 型エラーチェック |
| `Frontend: Build` | ✅ 設定済み | `next build` が通るか確認 |
| `Frontend: Test` | ⏳ 未設定 | テスト実装後に追加予定 |
| `Backend: Lint` | ⏳ 未設定 | セクション2（バックエンド初期化）完了後に追加予定 |
| `Backend: Type Check` | ⏳ 未設定 | セクション2完了後に追加予定 |
| `Backend: Build` | ⏳ 未設定 | セクション2完了後に追加予定 |

### CD（自動デプロイ）

| サービス | 状態 | 内容 |
|---|---|---|
| Vercel（フロントエンド） | ⏳ 未設定 | Vercel アカウント連携後に有効化 |
| Render（バックエンド） | ⏳ 未設定 | バックエンド実装・Render アカウント連携後に有効化 |

### ブランチ保護ルール（GitHub）

| ルール | 状態 |
|---|---|
| `main` への直接 Push を禁止 | ⏳ 未設定（GitHub リポジトリの Settings で設定が必要） |
| PR マージに CI 通過を必須にする | ⏳ 未設定（同上） |

> **ブランチ保護の設定方法**
> GitHub リポジトリ → Settings → Branches → Add branch ruleset
> - Branch name pattern: `main`
> - Require status checks to pass にチェック
> - 必須チェック対象: `Frontend: Lint` / `Frontend: Type Check` / `Frontend: Build`

---

## このプロジェクトの CI/CD 全体像

```
開発者が feature/* ブランチで実装
          ↓
GitHub へ Push
          ↓
Pull Request を作成（develop または main へ）
          ↓
┌─────────────────────────────────┐
│  GitHub Actions: CI が自動起動   │
│                                 │
│  Frontend: Lint                 │
│  Frontend: Type Check           │
│  Frontend: Build ─── ↑両方通過時のみ実行
│                                 │
│  （Backend: セクション2完了後追加）│
└─────────────────────────────────┘
          ↓
✅ 全ジョブ通過 → マージ可能
❌ 1つでも失敗 → マージをブロック
          ↓
main にマージ
          ↓
┌──────────────────┐  ┌──────────────────┐
│ Vercel が検知     │  │ Render が検知     │
│ フロントエンドを   │  │ バックエンドを    │
│ 自動デプロイ      │  │ 自動デプロイ      │
└──────────────────┘  └──────────────────┘
```

---

## ワークフローファイルの構造

ファイル: `.github/workflows/ci.yml`

```yaml
on:                        # トリガー（いつ動かすか）
  pull_request:
    branches:
      - main               # main への PR 作成・更新時に起動

jobs:                      # ジョブ（何をするか）
  frontend-lint:           # ジョブ名（GitHub の画面に表示される）
    runs-on: ubuntu-latest # 実行環境（GitHub が用意する Linux サーバー）
    steps:                 # ステップ（上から順番に実行）
      - uses: actions/checkout@v4      # リポジトリのコードを取得するアクション
      - uses: actions/setup-node@v4   # Node.js をセットアップするアクション
        with:
          node-version: 20             # Node.js のバージョン指定
          cache: "npm"                 # npm キャッシュを有効化（2回目以降が速くなる）
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci                    # 依存関係をインストール（package-lock.json 厳守）
        working-directory: frontend    # frontend/ ディレクトリで実行
      - run: npm run lint
        working-directory: frontend
```

### 主要なキーワード

| キーワード | 意味 |
|---|---|
| `on` | CI を起動するトリガーの定義 |
| `jobs` | 並列実行される処理の単位 |
| `runs-on` | 実行環境（基本は `ubuntu-latest`） |
| `steps` | ジョブ内の手順（上から順に実行） |
| `uses` | 公開されているアクション（処理の部品）を使う |
| `run` | シェルコマンドを実行する |
| `working-directory` | コマンドを実行するディレクトリを指定 |
| `needs` | このジョブが実行される前提条件（依存ジョブ）を指定 |
| `cache` | 依存関係のキャッシュを有効化してCI実行時間を短縮 |

---

## ジョブの実行順序

```
frontend-lint ──┐
                ├──→ frontend-build（両方通過時のみ）
frontend-type-check ──┘
```

Lint と Type Check は**並列実行**される。
どちらかが失敗すると Build は実行されない（無駄な待ち時間を防ぐ）。

---

## GitHub での CI 確認方法

### PR 画面での確認

PR を作成すると、画面下部にチェックが表示される。

```
✅ Frontend: Lint          passing
✅ Frontend: Type Check    passing
✅ Frontend: Build         passing
─────────────────────────────────
✅ All checks have passed
```

失敗した場合:

```
❌ Frontend: Lint          failing
⚠️  Frontend: Type Check   skipped
⚠️  Frontend: Build        skipped
─────────────────────────────────
❌ Some checks were not successful
```

### 失敗した時のログの見方

1. PR 画面の「Details」をクリック
2. 失敗したステップ（赤い `✕` マーク）をクリック
3. エラーメッセージを確認して修正する

---

## CI が失敗した時の対応フロー

```
CI 失敗
  ↓
GitHub の「Details」でエラーログを確認
  ↓
ローカルで同じコマンドを実行して再現
  │
  ├── Lint エラー       → cd frontend && npm run lint
  ├── 型エラー          → cd frontend && npm run type-check
  └── ビルドエラー      → cd frontend && npm run build
  ↓
修正して再 Push → CI が自動再実行される
```

### よくあるエラーと対処法

| エラー | 原因 | 対処 |
|---|---|---|
| `npm ci` が失敗 | `package-lock.json` がない・古い | `npm install` を実行して `package-lock.json` を更新 |
| Lint エラー | ESLint のルール違反 | `npm run lint` のエラーを修正 |
| 型エラー | TypeScript の型が合っていない | `npm run type-check` のエラーを修正 |
| ビルドエラー | `next build` が失敗 | ローカルで `npm run build` を実行して原因を確認 |

---

## `npm install` と `npm ci` の違い

CI では `npm install` ではなく `npm ci` を使う。

| | `npm install` | `npm ci` |
|---|---|---|
| 用途 | ローカル開発時 | CI 環境 |
| `package-lock.json` | 更新する場合がある | 厳密に従う（変更しない） |
| 速度 | 普通 | 速い（ロックファイル厳守で処理が単純） |
| 再現性 | 環境によって差が出ることがある | 常に同じ結果になる |

CI では**再現性**が重要なので `npm ci` を使う。

---

## 今後の追加予定

| タイミング | 追加するジョブ |
|---|---|
| セクション2完了後 | `backend-lint` / `backend-type-check` / `backend-build` |
| テスト実装後 | `frontend-test` / `backend-test` |
