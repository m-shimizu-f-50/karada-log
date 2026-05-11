# ADR-0008: グラフライブラリに Recharts を採用

- 日付: 2026-05-10
- 状態: 承認済み

## 背景

体重の推移グラフ（折れ線グラフ）を実装するにあたり、グラフライブラリの選定が必要だった。

## 検討した選択肢

| 選択肢 | 特徴 |
|---|---|
| **Recharts** | React 専用・コンポーネントベース・軽量 |
| Chart.js + react-chartjs-2 | 汎用グラフライブラリ。非 React のプロジェクトでも使える |
| Victory | React 専用・アニメーション豊富 |
| nivo | React 専用・高機能・重め |

## 決定

**Recharts** を採用する。

## 理由

- React コンポーネントとして宣言的に記述できるため、React の書き方と統一感がある
- `<LineChart>` `<XAxis>` `<YAxis>` のようにコンポーネントを組み合わせる設計が直感的
- 軽量でパフォーマンスが良い
- 週次ダウンロード数が React 向けグラフライブラリの中で最多クラス
- TypeScript 型定義が組み込まれている

## トレードオフ・注意点

- Recharts は Client Component でのみ動作する（`"use client"` が必要）
- Next.js の Server Component では使用できないため、グラフコンポーネントには `"use client"` を付与する
