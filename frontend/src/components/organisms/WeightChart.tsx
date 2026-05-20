'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import type { WeightRecord, WeightGoal } from '@/types/weight'

type Props = {
  records: WeightRecord[]
  goal: WeightGoal
}

export default function WeightChart({ records, goal }: Props) {
  if (records.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
        <h2 className="text-base font-semibold text-gray-700 mb-4">体重の推移</h2>
        <p className="text-sm text-gray-400 text-center py-8">記録がありません</p>
      </div>
    )
  }

  // グラフ用にラベルを短縮（MM/DD 形式）
  const data = records.map((r) => ({
    date: r.date.slice(5), // "YYYY-MM-DD" → "MM-DD"
    weight: r.weight,
  }))

  // Y軸の範囲を体重データ±2kgに設定して見やすくする
  const weights = records.map((r) => r.weight)
  const minWeight = Math.min(...weights)
  const maxWeight = Math.max(...weights)
  const yMin = Math.floor(minWeight - 2)
  const yMax = Math.ceil(maxWeight + 2)

  return (
    <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
      <h2 className="text-base font-semibold text-gray-700 mb-4">体重の推移</h2>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[yMin, yMax]}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            unit="kg"
          />
          <Tooltip
            formatter={(value) => [`${value} kg`, '体重']}
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #bae6fd',
              fontSize: '12px',
            }}
          />
          {/* 目標体重のライン */}
          {goal.targetWeight != null && (
            <ReferenceLine
              y={goal.targetWeight}
              stroke="#f59e0b"
              strokeDasharray="4 3"
              label={{ value: `目標 ${goal.targetWeight}kg`, fill: '#f59e0b', fontSize: 11 }}
            />
          )}
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#38bdf8"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#38bdf8', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#0ea5e9' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
