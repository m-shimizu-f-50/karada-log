# ADR-0009: コンポーネント設計に Atomic Design を採用

- 日付: 2026-05-10
- 状態: 承認済み

## 背景

フロントエンドのコンポーネントをどのように分類・管理するかの方針が必要だった。
コンポーネントが増えるにつれて「どこに何を置くか」が曖昧になることを防ぎたかった。

## 検討した選択肢

### A. 機能別ディレクトリ構成

```
components/
├── weight/     # 体重関連コンポーネント
├── meal/       # 食事関連コンポーネント
└── exercise/   # 運動関連コンポーネント
```

- シンプルでわかりやすい
- 汎用コンポーネントの置き場所が曖昧になりやすい

### B. Atomic Design

```
components/
├── atoms/       # 最小単位（Button, Input など）
├── molecules/   # Atoms の組み合わせ（FormField など）
├── organisms/   # 機能を持つ複合部品（WeightForm など）
└── templates/   # ページレイアウト骨格
```

- 粒度の基準が明確
- 実務でも採用されている設計手法

## 決定

**Atomic Design** を採用する。

## 理由

- コンポーネントの粒度（どれくらい小さく分割するか）の判断基準が明確になる
- 汎用的な UI 部品（Button・Input など）と機能固有の部品（WeightForm など）を明確に分けられる
- 実務でも使われている設計手法であり、考え方自体が業務で応用できる
- 依存関係のルール（上位層は下位層のみ使える）により、コンポーネント間の依存が整理される

## 階層の定義

| 階層 | 役割 | 例 |
|---|---|---|
| Atoms | 最小単位のUI部品 | `Button`, `Input`, `Label`, `Card` |
| Molecules | Atoms の組み合わせ | `FormField`（Label + Input）, `RecordItem` |
| Organisms | 機能を持つ複合部品 | `WeightForm`, `WeightChart`, `Header` |
| Templates | ページのレイアウト骨格 | `AuthenticatedLayout` |
| Pages | 実際のページ | Next.js の `page.tsx`（App Router で対応） |

## 依存関係のルール

```
Pages → Templates → Organisms → Molecules → Atoms
```

上位層は下位層を使えるが、下位層が上位層を使うことは禁止する。

## トレードオフ・注意点

- 小規模なプロジェクトでは分割しすぎると逆に管理が煩雑になる場合がある
- コンポーネントをどの階層に置くか迷う場面が出てくるが、迷ったら「より下位層（粒度が小さい方）」に置くことを基本とする
