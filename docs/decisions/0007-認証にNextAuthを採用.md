# ADR-0007: 認証に NextAuth.js v5（Auth.js）を採用

- 日付: 2026-05-10
- 状態: 承認済み

## 背景

Google アカウントでのログイン機能が必要だった。
OAuth 2.0 の実装を自前で行うことも可能だが、セキュリティリスクと実装コストを考慮した。

## 検討した選択肢

| 選択肢 | 特徴 |
|---|---|
| **NextAuth.js v5** | Next.js 専用の認証ライブラリ。OAuth プロバイダー対応 |
| Clerk | 認証 SaaS。UI コンポーネントも提供。無料枠あり |
| Supabase Auth | Supabase 内蔵の認証機能 |
| 自前実装 | JWT・セッション管理を自分で実装 |

## 決定

**NextAuth.js v5（Auth.js）** を採用する。

## 理由

- Next.js との統合が最もシンプルで、公式ドキュメントが充実している
- Google OAuth など主要なプロバイダーへの対応が設定数行で完結する
- Prisma Adapter を使うことで、認証に必要なテーブル（User・Account・Session）の管理を自動化できる
- フロントエンドで発行した JWT をバックエンドに渡す構成（ADR-0001）と相性が良い
- 実務での採用実績が多く、学習価値が高い

## 認証フロー

```
1. ユーザーが「Google でログイン」ボタンをクリック
2. NextAuth.js が Google OAuth の認証ページへリダイレクト
3. Google 認証後、NextAuth.js がコールバックを受け取りセッション・JWT を生成
4. フロントエンドがバックエンド API を呼ぶ際、JWT を Authorization ヘッダーに付与
5. バックエンドが AUTH_SECRET で JWT を検証してユーザーを特定
```

## トレードオフ・注意点

- NextAuth.js v5 は v4 から破壊的変更があるため、v4 の情報と混在しないよう注意が必要
- フロントエンドとバックエンドで `AUTH_SECRET` を同じ値に設定する必要がある
- バックエンドは NextAuth.js を使わず、JWT の検証のみ行う（`jose` ライブラリなどを使用）
